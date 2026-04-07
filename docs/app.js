/* ============================================================
   APP.JS — Dashboard controller, chart rendering, and UI logic
   ============================================================ */

(function () {
    "use strict";

    // ── Utility Functions (defined first so all renderers can use them) ──
    function sanitize(str) {
        const div = document.createElement("div");
        div.textContent = String(str);
        return div.innerHTML;
    }

    function formatNum(n) {
        if (n == null) return "—";
        if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
        if (n >= 1000) return (n / 1000).toFixed(1) + "K";
        return String(n);
    }

    function platformLabel(key) {
        const map = { reddit: "Reddit", twitter: "X / Twitter", tiktok: "TikTok", youtube: "YouTube" };
        return map[key] || key;
    }

    function toast(msg, isError) {
        const el = document.createElement("div");
        el.className = "toast" + (isError ? " error" : "");
        el.textContent = msg;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2500);
    }

    // ── Timestamps ──
    const now = new Date();
    const timeStr = now.toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    });
    document.getElementById("lastUpdated").textContent = timeStr;
    document.getElementById("footerTime").textContent = timeStr;

    // ── Tab Navigation ──
    const tabs = document.querySelectorAll(".tab");
    const panels = document.querySelectorAll(".tab-panel");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));
            tab.classList.add("active");
            document.getElementById("panel-" + tab.dataset.tab).classList.add("active");
        });
    });

    // ── Chart defaults ──
    Chart.defaults.color = "#8b949e";
    Chart.defaults.borderColor = "rgba(48, 54, 61, 0.6)";
    Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
    Chart.defaults.font.size = 11;

    // ── Chart instances (stored for re-creation) ──
    let chartVolume, chartSentiment, chartPlatform, chartVelocity;

    function renderCharts() {
        if (chartVolume) chartVolume.destroy();
        if (chartSentiment) chartSentiment.destroy();
        if (chartPlatform) chartPlatform.destroy();
        if (chartVelocity) chartVelocity.destroy();

        // Volume
        chartVolume = new Chart(document.getElementById("chartVolume"), {
            type: "line",
            data: {
                labels: VOLUME_DATA.labels,
                datasets: [
                    { label: "Reddit", data: VOLUME_DATA.datasets.reddit, borderColor: "#ff4500", backgroundColor: "rgba(255,69,0,0.1)", fill: true, tension: 0.35, pointRadius: 3 },
                    { label: "X / Twitter", data: VOLUME_DATA.datasets.twitter, borderColor: "#1d9bf0", backgroundColor: "rgba(29,155,240,0.1)", fill: true, tension: 0.35, pointRadius: 3 },
                    { label: "TikTok", data: VOLUME_DATA.datasets.tiktok, borderColor: "#fe2c55", backgroundColor: "rgba(254,44,85,0.1)", fill: true, tension: 0.35, pointRadius: 3 },
                    { label: "YouTube", data: VOLUME_DATA.datasets.youtube, borderColor: "#ff0000", backgroundColor: "rgba(255,0,0,0.1)", fill: true, tension: 0.35, pointRadius: 3 }
                ]
            },
            options: {
                responsive: true,
                interaction: { mode: "index", intersect: false },
                plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 16 } } },
                scales: {
                    y: { beginAtZero: true, grid: { color: "rgba(48,54,61,0.3)" } },
                    x: { grid: { display: false } }
                }
            }
        });

        // Sentiment
        const sentimentCounts = { positive: 0, negative: 0, mixed: 0 };
        SIGNALS.forEach(s => sentimentCounts[s.sentiment]++);
        chartSentiment = new Chart(document.getElementById("chartSentiment"), {
            type: "doughnut",
            data: {
                labels: ["Negative", "Positive", "Mixed"],
                datasets: [{ data: [sentimentCounts.negative, sentimentCounts.positive, sentimentCounts.mixed], backgroundColor: ["#f85149", "#3fb950", "#d29922"], borderWidth: 0 }]
            },
            options: { responsive: true, cutout: "65%", plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 14 } } } }
        });

        // Platform
        const platformCounts = { reddit: 0, twitter: 0, tiktok: 0, youtube: 0 };
        SIGNALS.forEach(s => platformCounts[s.platform]++);
        chartPlatform = new Chart(document.getElementById("chartPlatform"), {
            type: "bar",
            data: {
                labels: ["Reddit", "X / Twitter", "TikTok", "YouTube"],
                datasets: [{ data: [platformCounts.reddit, platformCounts.twitter, platformCounts.tiktok, platformCounts.youtube], backgroundColor: ["#ff4500", "#1d9bf0", "#fe2c55", "#ff0000"], borderRadius: 4, maxBarThickness: 40 }]
            },
            options: { responsive: true, indexAxis: "y", plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grid: { color: "rgba(48,54,61,0.3)" } }, y: { grid: { display: false } } } }
        });

        // Velocity — dynamic datasets from NARRATIVES
        const velColors = ["#f85149", "#58a6ff", "#d29922", "#3fb950", "#bc8cff", "#f0883e"];
        const velDatasets = NARRATIVES.map((n, i) => ({
            label: n.title,
            data: VELOCITY_DATA.datasets[n.title] || [],
            borderColor: n.color || velColors[i % velColors.length],
            backgroundColor: (n.color || velColors[i % velColors.length]) + "0D",
            fill: true, tension: 0.35, pointRadius: 3, borderWidth: 2
        }));
        chartVelocity = new Chart(document.getElementById("chartVelocity"), {
            type: "line",
            data: { labels: VELOCITY_DATA.labels, datasets: velDatasets },
            options: {
                responsive: true,
                interaction: { mode: "index", intersect: false },
                plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 16 } } },
                scales: {
                    y: { beginAtZero: true, grid: { color: "rgba(48,54,61,0.3)" }, title: { display: true, text: "Engagement Index" } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // ── KPIs ──
    function updateKPIs() {
        document.getElementById("kpiSignals").textContent = SIGNALS.length;
        document.getElementById("kpiNarratives").textContent = NARRATIVES.length;
        const neg = SIGNALS.filter(s => s.sentiment === "negative").length;
        const pos = SIGNALS.filter(s => s.sentiment === "positive").length;
        const pct = SIGNALS.length ? Math.round((pos - neg) / SIGNALS.length * 100) : 0;
        const kpiSent = document.getElementById("kpiSentiment");
        kpiSent.textContent = (pct > 0 ? "+" : "") + pct + "%";
        kpiSent.className = "kpi-value " + (pct < 0 ? "sentiment-negative" : pct > 0 ? "sentiment-positive" : "");
        const hasHigh = NARRATIVES.some(n => n.riskLevel === "high");
        const hasMed = NARRATIVES.some(n => n.riskLevel === "medium");
        const kpiRisk = document.getElementById("kpiRisk");
        kpiRisk.textContent = hasHigh ? (hasMed ? "MED-HIGH" : "HIGH") : hasMed ? "MEDIUM" : "LOW";
        kpiRisk.className = "kpi-value " + (hasHigh ? "risk-high" : hasMed ? "risk-medium" : "risk-low");
    }

    // ── Alerts ──
    function renderAlerts() {
        const alertsList = document.getElementById("alertsList");
        alertsList.innerHTML = "";
        ALERTS.forEach(a => {
            const el = document.createElement("div");
            el.className = "alert-item";
            el.innerHTML = `
                <span class="alert-level ${a.level}">${a.level}</span>
                <span>${sanitize(a.message)}</span>
                <span class="alert-time">${sanitize(a.time)}</span>
            `;
            alertsList.appendChild(el);
        });
    }

    // ── Signal Collection ──
    function renderSignals(filters) {
        const grid = document.getElementById("signalsGrid");
        grid.innerHTML = "";
        let filtered = SIGNALS;
        if (filters.platform !== "all") filtered = filtered.filter(s => s.platform === filters.platform);
        if (filters.sentiment !== "all") filtered = filtered.filter(s => s.sentiment === filters.sentiment);
        if (filters.tone !== "all") filtered = filtered.filter(s => s.tone === filters.tone);

        filtered.forEach(s => {
            const card = document.createElement("div");
            card.className = "signal-card";
            card.innerHTML = `
                <div class="signal-header">
                    <span class="platform-tag ${s.platform}">${sanitize(platformLabel(s.platform))}</span>
                    <span class="sentiment-tag ${s.sentiment}">${sanitize(s.sentiment)}</span>
                </div>
                <div class="signal-message">"${sanitize(s.message)}"</div>
                <div class="signal-meta">
                    <span>📍 ${sanitize(s.source)}</span>
                    <span>👍 ${formatNum(s.engagement.likes)}</span>
                    <span>💬 ${formatNum(s.engagement.comments)}</span>
                    ${s.engagement.views ? `<span>👁 ${formatNum(s.engagement.views)}</span>` : ""}
                    <span class="tone-tag">${sanitize(s.tone)}</span>
                </div>
            `;
            grid.appendChild(card);
        });

        if (filtered.length === 0) {
            grid.innerHTML = '<div style="color: var(--text-muted); padding: 2rem; text-align: center;">No signals match current filters.</div>';
        }
    }

    // Filter listeners
    ["filterPlatform", "filterSentiment", "filterTone"].forEach(id => {
        document.getElementById(id).addEventListener("change", () => {
            renderSignals({
                platform: document.getElementById("filterPlatform").value,
                sentiment: document.getElementById("filterSentiment").value,
                tone: document.getElementById("filterTone").value
            });
        });
    });

    // ── Narratives ──
    function renderNarratives() {
        const narrativesGrid = document.getElementById("narrativesGrid");
        narrativesGrid.innerHTML = "";
        NARRATIVES.forEach(n => {
            const card = document.createElement("div");
            card.className = `narrative-card ${n.cssClass}`;
            card.innerHTML = `
                <div class="narrative-title">${sanitize(n.title)}</div>
                <div class="narrative-description">${sanitize(n.description)}</div>
                <div class="narrative-section">
                    <div class="narrative-section-title">Representative Examples</div>
                    <div class="narrative-examples">${n.examples.map(e => sanitize(e)).join("<br>")}</div>
                </div>
                <div class="narrative-section">
                    <div class="narrative-section-title">Emotional Drivers</div>
                    <div class="narrative-drivers">${n.drivers.map(d => `<span class="driver-tag">${sanitize(d)}</span>`).join("")}</div>
                </div>
                <div class="narrative-section">
                    <div class="narrative-section-title">Platform Strength</div>
                    <div class="narrative-platforms">
                        ${Object.entries(n.platforms).map(([p, strength]) =>
                            `<span class="platform-strength ${strength}">${sanitize(platformLabel(p))}: ${sanitize(strength)}</span>`
                        ).join("")}
                    </div>
                </div>
                <div class="signal-meta" style="margin-top: 0.5rem;">
                    <span>Signals: ${n.signalCount}</span>
                    <span>Velocity: ${sanitize(n.velocity)}</span>
                    <span class="risk-badge ${n.riskLevel}" style="margin-left: auto;">${sanitize(n.riskLevel)} risk</span>
                </div>
            `;
            narrativesGrid.appendChild(card);
        });
    }

    // ── Analysis ──
    function renderAnalysisSection(containerId, data) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <p style="margin-bottom: 0.75rem; color: var(--text-primary); font-weight: 500;">${data.summary}</p>
            <ul>${data.findings.map(f => `<li>${f}</li>`).join("")}</ul>
        `;
    }

    function renderAllAnalysis() {
        renderAnalysisSection("analysisVelocity", ANALYSIS_DATA.velocity);
        renderAnalysisSection("analysisAmplification", ANALYSIS_DATA.amplification);
        renderAnalysisSection("analysisSignalNoise", ANALYSIS_DATA.signalNoise);
        renderAnalysisSection("analysisOrganic", ANALYSIS_DATA.organic);
    }

    // Cross-platform flow (static diagram)
    document.getElementById("flowDiagram").innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 1.5rem; width: 100%;">
            <div style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; justify-content: center;">
                <div class="flow-node reddit">Reddit<br><small>Discussion & Source</small></div>
                <div class="flow-arrow">→</div>
                <div class="flow-node twitter">X / Twitter<br><small>Amplification & News</small></div>
                <div class="flow-arrow">→</div>
                <div class="flow-node tiktok">TikTok<br><small>Emotional Virality</small></div>
            </div>
            <div style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; justify-content: center;">
                <div class="flow-node youtube">YouTube<br><small>Deep Analysis & Longevity</small></div>
                <div class="flow-arrow">↔</div>
                <div class="flow-node twitter">X / Twitter<br><small>Re-amplification</small></div>
                <div class="flow-arrow">→</div>
                <div style="padding: 0.6rem 1rem; border: 1px dashed var(--border); border-radius: var(--radius); font-size: 0.8rem; color: var(--text-secondary); text-align: center;">
                    Mainstream Media<br><small>Narrative Spillover</small>
                </div>
            </div>
            <div class="flow-label">Typical flow: Reddit (source material) → X (amplification) → TikTok (emotional reach) → YouTube (sustained analysis)</div>
        </div>
    `;

    // ── Risk Assessment ──
    function renderRisk() {
        // Risk cards
        const riskGrid = document.getElementById("riskGrid");
        riskGrid.innerHTML = "";
        RISK_ASSESSMENTS.forEach(r => {
            const card = document.createElement("div");
            card.className = `risk-card risk-${r.level}`;
            card.innerHTML = `
                <div class="risk-header">
                    <span class="risk-title">${sanitize(r.narrative)}</span>
                    <span class="risk-badge ${r.level}">${sanitize(r.level)}</span>
                </div>
                <div class="risk-reasoning">${sanitize(r.reasoning)}</div>
                <div class="risk-factors">
                    ${r.factors.map(f => `<span class="risk-factor">${sanitize(f)}</span>`).join("")}
                </div>
            `;
            riskGrid.appendChild(card);
        });

        // Dynamic risk matrix
        const riskMatrix = document.getElementById("riskMatrix");
        // Build reach/impact placement from narrative data
        const colorMap = { high: "var(--accent-red)", medium: "var(--accent-orange)", low: "var(--accent-green)" };
        const matrix = { highHigh: [], highMed: [], highLow: [], medHigh: [], medMed: [], medLow: [], lowHigh: [], lowMed: [], lowLow: [] };
        NARRATIVES.forEach(n => {
            const totalEng = SIGNALS.filter(s => s.narrative === n.id)
                .reduce((sum, s) => (s.engagement.likes || 0) + (s.engagement.comments || 0) * 3 + (s.engagement.views || 0) * 0.01 + sum, 0);
            const reach = totalEng > 300000 ? "high" : totalEng > 80000 ? "med" : "low";
            const impact = n.riskLevel === "high" ? "high" : n.riskLevel === "medium" ? "med" : "low";
            matrix[impact + capitalize(reach)].push(
                '<span class="matrix-marker" style="color: ' + (n.color || colorMap[n.riskLevel]) + ';">● ' + sanitize(n.title) + '</span>'
            );
        });
        function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

        riskMatrix.innerHTML = `
            <div class="matrix-cell"></div>
            <div class="matrix-cell matrix-header">Low Reach</div>
            <div class="matrix-cell matrix-header">Medium Reach</div>
            <div class="matrix-cell matrix-header">High Reach</div>

            <div class="matrix-cell matrix-label">High Impact</div>
            <div class="matrix-cell matrix-medium">${matrix.highLow.join("<br>")}</div>
            <div class="matrix-cell matrix-high">${matrix.highMed.join("<br>")}</div>
            <div class="matrix-cell matrix-high">${matrix.highHigh.join("<br>")}</div>

            <div class="matrix-cell matrix-label">Med Impact</div>
            <div class="matrix-cell matrix-low">${matrix.medLow.join("<br>")}</div>
            <div class="matrix-cell matrix-medium">${matrix.medMed.join("<br>")}</div>
            <div class="matrix-cell matrix-high">${matrix.medHigh.join("<br>")}</div>

            <div class="matrix-cell matrix-label">Low Impact</div>
            <div class="matrix-cell matrix-low">${matrix.lowLow.join("<br>")}</div>
            <div class="matrix-cell matrix-low">${matrix.lowMed.join("<br>")}</div>
            <div class="matrix-cell matrix-medium">${matrix.lowHigh.join("<br>")}</div>
        `;
    }

    // ── Executive Brief Generation ──
    document.getElementById("btnGenerateBrief").addEventListener("click", generateBrief);
    document.getElementById("btnExportBrief").addEventListener("click", () => { window.print(); });

    function generateBrief() {
        const container = document.getElementById("briefContainer");
        const briefDate = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        const neg = SIGNALS.filter(s => s.sentiment === "negative").length;
        const pos = SIGNALS.filter(s => s.sentiment === "positive").length;
        const sentPct = SIGNALS.length ? Math.round((pos - neg) / SIGNALS.length * 100) : 0;
        const accel = NARRATIVES.filter(n => n.velocity === "accelerating");
        const highRisk = NARRATIVES.filter(n => n.riskLevel === "high");
        const medRisk = NARRATIVES.filter(n => n.riskLevel === "medium");
        const hasHigh = highRisk.length > 0;
        const overallRisk = hasHigh ? (medRisk.length ? "MEDIUM-HIGH" : "HIGH") : medRisk.length ? "MEDIUM" : "LOW";

        const narrativeListHtml = NARRATIVES.map(n =>
            `<li><strong>${sanitize(n.title)}</strong> — ${sanitize(n.description.slice(0, 120))}... <em>Risk: ${sanitize(n.riskLevel.toUpperCase())}. Velocity: ${sanitize(n.velocity)}.</em></li>`
        ).join("\n                ");

        const riskListHtml = NARRATIVES.map(n =>
            `<li><strong>${sanitize(n.riskLevel.toUpperCase())} — ${sanitize(n.title)}:</strong> ${sanitize(RISK_ASSESSMENTS.find(r => r.narrative === n.title)?.reasoning || "")}</li>`
        ).join("\n                ");

        const platforms = new Set(SIGNALS.map(s => s.platform));

        container.innerHTML = `<div class="brief-content">
            <div class="brief-classification">INTERNAL — CONFIDENTIAL</div>
            <h2>Social Media Narrative Brief: AI &amp; Job Displacement</h2>
            <div class="brief-date">${sanitize(briefDate)} · Analysis Period: Rolling 7-day window</div>

            <h3>Overview</h3>
            <p>Cross-platform monitoring of discourse around AI-driven job displacement reveals <strong>${NARRATIVES.length} distinct narrative clusters</strong> with different trajectories.${accel.length ? " " + accel.map(n => '"' + n.title + '"').join(" and ") + (accel.length === 1 ? " is" : " are") + " accelerating." : ""}</p>
            <p>Overall sentiment: <strong>${sentPct > 0 ? "+" : ""}${sentPct}%</strong> across ${SIGNALS.length} tracked signals on ${platforms.size} platforms. ${neg > pos ? "Negative sentiment dominates, with fear and resignation as primary emotional drivers." : "Sentiment is relatively balanced across the discourse."}</p>

            <hr>

            <h3>Key Narratives</h3>
            <ul>
                ${narrativeListHtml}
            </ul>

            <hr>

            <h3>Insights</h3>
            <ul>
                <li><strong>Sentiment:</strong> ${neg} negative, ${pos} positive, ${SIGNALS.length - neg - pos} mixed signals across ${platforms.size} platforms.</li>
                <li><strong>Engagement:</strong> ${SIGNALS.filter(s => (s.engagement.likes || 0) + (s.engagement.comments || 0) * 3 + (s.engagement.views || 0) * 0.01 > 50000).length} of ${SIGNALS.length} signals exceed high-engagement threshold, indicating concentrated viral amplification.</li>
                <li><strong>Cross-Platform Pattern:</strong> Reddit generates source material (detailed anecdotes) → X amplifies with data and news hooks → TikTok delivers emotional reach to younger demographics → YouTube sustains narratives through long-form analysis.</li>
                <li><strong>Narrative Velocity:</strong> ${accel.length ? accel.map(n => '"' + sanitize(n.title) + '"').join(" and ") + " showing accelerating engagement." : "All narratives maintaining steady velocity."}</li>
                <li><strong>Source Diversity:</strong> ${new Set(SIGNALS.map(s => s.source)).size} unique sources detected — high diversity suggests predominantly organic discourse.</li>
            </ul>

            <hr>

            <h3>Risk Assessment</h3>
            <p><strong>Overall Risk Level: ${overallRisk}</strong></p>
            <ul>
                ${riskListHtml}
            </ul>

            <hr>

            <h3>Recommendations</h3>
            <ul>
                ${accel.length ? `<li><strong>Intensify monitoring</strong> of accelerating narratives (${accel.map(n => '"' + sanitize(n.title) + '"').join(", ")}) — track whether velocity plateaus or continues to accelerate.</li>` : ""}
                ${highRisk.length ? `<li><strong>Prioritize high-risk narratives</strong> — ${highRisk.map(n => '"' + sanitize(n.title) + '"').join(", ")} ${highRisk.length === 1 ? "poses" : "pose"} the greatest potential to shape public perception at scale.</li>` : ""}
                ${medRisk.length ? `<li><strong>Watch medium-risk escalation</strong> — ${medRisk.map(n => '"' + sanitize(n.title) + '"').join(", ")} could escalate rapidly given institutional or viral catalysts.</li>` : ""}
                <li><strong>Identify credible counter-narrative voices</strong> — third-party validation (academic, independent creators) is more effective than corporate messaging.</li>
                <li><strong>Assess internal exposure</strong> — evaluate whether your organization's AI adoption messaging could be caught in a negative narrative crossfire.</li>
            </ul>

            <hr>
            <p style="font-size: 0.78rem; color: var(--text-muted); text-align: center; margin-top: 2rem;">
                Prepared by Narrative Monitor · Analysis based on ${SIGNALS.length} collected signals across ${platforms.size} platforms · ${sanitize(briefDate)}
            </p>
        </div>`;
    }

    // ── Master Refresh (re-runs analysis engine and re-renders everything) ──
    function refreshAll() {
        runAnalysis();
        updateKPIs();
        renderCharts();
        renderAlerts();
        renderNarratives();
        renderAllAnalysis();
        renderRisk();
        refreshSignalsTab();
        refreshCollectTab();
    }

    // ── Initial Render ──
    renderCharts();
    updateKPIs();
    renderAlerts();
    renderSignals({ platform: "all", sentiment: "all", tone: "all" });
    renderNarratives();
    renderAllAnalysis();
    renderRisk();

    // ── Collect Tab: Data Entry & Management ──
    const entryForm = document.getElementById("entryForm");
    const btnShowForm = document.getElementById("btnShowForm");
    const btnCancelForm = document.getElementById("btnCancelForm");
    const btnSaveSignal = document.getElementById("btnSaveSignal");
    const btnImportJSON = document.getElementById("btnImportJSON");
    const btnExportJSON = document.getElementById("btnExportJSON");
    const btnClearData = document.getElementById("btnClearData");
    const fileImport = document.getElementById("fileImport");

    btnShowForm.addEventListener("click", () => {
        entryForm.style.display = entryForm.style.display === "none" ? "block" : "none";
    });

    btnCancelForm.addEventListener("click", () => {
        entryForm.style.display = "none";
    });

    btnSaveSignal.addEventListener("click", () => {
        const message = document.getElementById("entryMessage").value.trim();
        const source = document.getElementById("entrySource").value.trim();
        if (!message) { toast("Message is required", true); return; }
        if (!source) { toast("Source is required", true); return; }

        const newId = SIGNALS.length > 0 ? Math.max(...SIGNALS.map(s => s.id)) + 1 : 1;
        const views = document.getElementById("entryViews").value;
        const signal = {
            id: newId,
            platform: document.getElementById("entryPlatform").value,
            source: source,
            message: message,
            sentiment: document.getElementById("entrySentiment").value,
            tone: document.getElementById("entryTone").value,
            engagement: {
                likes: parseInt(document.getElementById("entryLikes").value) || 0,
                comments: parseInt(document.getElementById("entryComments").value) || 0,
                views: views ? parseInt(views) : null
            },
            date: document.getElementById("entryDate").value
                ? document.getElementById("entryDate").value + "T12:00:00Z"
                : new Date().toISOString()
        };

        SIGNALS.push(signal);
        saveSignals();

        // Reset form
        document.getElementById("entryMessage").value = "";
        document.getElementById("entrySource").value = "";
        document.getElementById("entryLikes").value = "";
        document.getElementById("entryComments").value = "";
        document.getElementById("entryViews").value = "";
        document.getElementById("entryDate").value = "";
        entryForm.style.display = "none";

        refreshAll();
        toast("Signal saved & analysis updated (" + SIGNALS.length + " total)");
    });

    // Export
    btnExportJSON.addEventListener("click", () => {
        const blob = new Blob([JSON.stringify(SIGNALS, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "signals-export-" + new Date().toISOString().slice(0, 10) + ".json";
        a.click();
        URL.revokeObjectURL(url);
        toast("Exported " + SIGNALS.length + " signals");
    });

    // Import
    btnImportJSON.addEventListener("click", () => fileImport.click());
    fileImport.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (ev) {
            try {
                const imported = JSON.parse(ev.target.result);
                if (!Array.isArray(imported)) throw new Error("Expected an array");
                const valid = imported.every(s =>
                    s.platform && s.message && s.sentiment && s.tone && s.engagement
                );
                if (!valid) throw new Error("Invalid signal format");

                const maxId = SIGNALS.length > 0 ? Math.max(...SIGNALS.map(s => s.id)) : 0;
                imported.forEach((s, i) => { s.id = maxId + i + 1; });

                SIGNALS.push(...imported);
                saveSignals();
                refreshAll();
                toast("Imported " + imported.length + " signals — analysis updated (" + SIGNALS.length + " total)");
            } catch (err) {
                toast("Import failed: " + err.message, true);
            }
        };
        reader.readAsText(file);
        fileImport.value = "";
    });

    // Clear
    btnClearData.addEventListener("click", () => {
        if (!confirm("Delete all signals and reload from seed data?")) return;
        try { localStorage.removeItem("monitor_signals"); } catch (e) {}
        SIGNALS.length = 0;
        SEED_SIGNALS.forEach(s => SIGNALS.push(JSON.parse(JSON.stringify(s))));
        refreshAll();
        toast("Data reset to seed signals");
    });

    function refreshCollectTab() {
        const stats = document.getElementById("collectStats");
        const platforms = {};
        SIGNALS.forEach(s => { platforms[s.platform] = (platforms[s.platform] || 0) + 1; });
        stats.innerHTML = ["reddit", "twitter", "tiktok", "youtube"].map(p =>
            `<div class="collect-stat">
                <div class="collect-stat-label">${sanitize(platformLabel(p))}</div>
                <div class="collect-stat-value">${platforms[p] || 0}</div>
            </div>`
        ).join("");

        document.getElementById("collectCount").textContent = SIGNALS.length;

        const tbody = document.getElementById("collectBody");
        tbody.innerHTML = "";
        [...SIGNALS].reverse().forEach(s => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><span class="platform-tag ${s.platform}">${sanitize(platformLabel(s.platform))}</span></td>
                <td>${sanitize(s.source)}</td>
                <td class="msg-cell" title="${sanitize(s.message)}">${sanitize(s.message)}</td>
                <td><span class="sentiment-tag ${s.sentiment}">${sanitize(s.sentiment)}</span></td>
                <td><span class="tone-tag">${sanitize(s.tone)}</span></td>
                <td>${formatNum(s.engagement.likes)} / ${formatNum(s.engagement.comments)}${s.engagement.views ? " / " + formatNum(s.engagement.views) : ""}</td>
                <td><button class="btn-delete" data-id="${s.id}" title="Delete signal">✕</button></td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.dataset.id);
                const idx = SIGNALS.findIndex(s => s.id === id);
                if (idx > -1) {
                    SIGNALS.splice(idx, 1);
                    saveSignals();
                    refreshAll();
                    toast("Signal deleted — analysis updated");
                }
            });
        });
    }

    function refreshSignalsTab() {
        renderSignals({
            platform: document.getElementById("filterPlatform").value,
            sentiment: document.getElementById("filterSentiment").value,
            tone: document.getElementById("filterTone").value
        });
    }

    // Initial render of collect tab
    refreshCollectTab();

})();
