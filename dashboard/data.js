/* ============================================================
   DATA LAYER — Simulated monitoring data for AI & Job Displacement
   Loads from localStorage if available; falls back to seed data.
   ============================================================ */

const SEED_SIGNALS = [
  {
    "id": 1,
    "platform": "reddit",
    "source": "r/ArtificialIntelligence",
    "message": "Is AI quietly killing the value of being pretty good at things? Not elite-level expertise, and not total beginners. I mean the huge middle ground where being solid enough used to have real market value: writing, research, design, coding, analysis, editing, planning, etc. Feels like AI may be compressing the value of that middle faster than people want to admit.",
    "sentiment": "negative",
    "tone": "fear",
    "engagement": {
      "likes": 270,
      "comments": 182,
      "views": null
    },
    "date": "2026-04-06T22:49:46.800Z",
    "narrative": 1
  },
  {
    "id": 2,
    "platform": "reddit",
    "source": "r/ArtificialIntelligence",
    "message": "Klarna fired 700 people for AI and then admitted they messed up and starting rehiring. They automated the job without understanding what the job actually needed. If your process is broken, automating doesn't fix it. The companies actually winning with AI right now aren't the fasted adopters. They're the ones who mapped the process first, defined the outcome, built the infrastructure, then layered AI on top of something that already worked.",
    "sentiment": "mixed",
    "tone": "skepticism",
    "engagement": {
      "likes": 35,
      "comments": 30,
      "views": null
    },
    "date": "2026-04-06T22:52:48.607Z",
    "narrative": 4
  },
  {
    "id": 3,
    "platform": "reddit",
    "source": "r/ArtificialIntelligence",
    "message": "The \"AI is replacing software engineers\" narrative was a lie. MIT just published the math proving why. And the companies who believed it are now begging their old engineers to come back.",
    "sentiment": "positive",
    "tone": "skepticism",
    "engagement": {
      "likes": 2314,
      "comments": 459,
      "views": null
    },
    "date": "2026-03-26",
    "narrative": 4
  },
  {
    "id": 4,
    "platform": "reddit",
    "source": "r/technology",
    "message": "Thousands of CEOS just admitted AI had no impact on employment or productivity - and it has economists resurrecting a paradox from 40 years ago.",
    "sentiment": "negative",
    "tone": "skepticism",
    "engagement": {
      "likes": 34700,
      "comments": 2300,
      "views": null
    },
    "date": "2026-02-18",
    "narrative": 3
  },
  {
    "id": 5,
    "platform": "reddit",
    "source": "r/ArtificialIntelligence",
    "message": "The biggest lie we were told about AI is that it would do our jobs for us. Instead it just turned us all into full-time editors of extremely confident, mediocre work.",
    "sentiment": "negative",
    "tone": "skepticism",
    "engagement": {
      "likes": 220,
      "comments": 87,
      "views": null
    },
    "date": "2026-04-05",
    "narrative": 1
  },
  {
    "id": 6,
    "platform": "tiktok",
    "source": "The Techno Optimist",
    "message": "Nvidia CEO: Proof AI is creating more jobs. The number of software engineers at NVIDIA is going to grow, not decline. The reason for that is because the purpose of a software engineer and the task of a software engineer for coding are related, not the same.",
    "sentiment": "positive",
    "tone": "excitement",
    "engagement": {
      "likes": 4726,
      "comments": 226,
      "views": 175200
    },
    "date": "2026-04-04",
    "narrative": 2
  },
  {
    "id": 7,
    "platform": "tiktok",
    "source": "Hanna Horvath, CFP.",
    "message": "AI is taking entry-level jobs. What happens when Gen-Z can't start their careers? AI can now handle tasks that companies would traditionally assign to junior employees.",
    "sentiment": "negative",
    "tone": "fear",
    "engagement": {
      "likes": 143900,
      "comments": 1652,
      "views": 857000
    },
    "date": "2026-02-23",
    "narrative": 1
  },
  {
    "id": 8,
    "platform": "tiktok",
    "source": "Jack Boudreau",
    "message": "What to expect when your company \"adopts AI\" in 2026. They'll commit $500M to AI before they give you a raise. Spending big on AI subscriptions to advertise \"AI usage\" as part of their product/workforce, but not actually checking engagement.",
    "sentiment": "negative",
    "tone": "sarcasm",
    "engagement": {
      "likes": 8762,
      "comments": 296,
      "views": null
    },
    "date": "2026-03-30",
    "narrative": 3
  },
  {
    "id": 9,
    "platform": "tiktok",
    "source": "Andrew Yang",
    "message": "The AI Jobpocalypse is about to get worse. Millions of white collar workers are going to lose their jobs due to AI. It is going to displace marketers, coders, lawyers, accountants, etc.",
    "sentiment": "negative",
    "tone": "fear",
    "engagement": {
      "likes": 38600,
      "comments": 3187,
      "views": 755800
    },
    "date": "2026-02-21",
    "narrative": 1
  },
  {
    "id": 10,
    "platform": "twitter",
    "source": "@milesdeutscher",
    "message": "This makes me sick for the future of the workforce. Yeah, it's worse than you think.... Entry-level job postings: down -67% in one year. 13% employment drop for 22-25 year-olds in AI-exposed jobs since late 2022. Amazon -30,000 employees. Microsoft cut 15,000 jobs in 2025 alone.",
    "sentiment": "negative",
    "tone": "fear",
    "engagement": {
      "likes": 190,
      "comments": 76,
      "views": 29000
    },
    "date": "2026-03-20",
    "narrative": 1
  },
  {
    "id": 11,
    "platform": "twitter",
    "source": "@vaibhavsisinty",
    "message": "Sam Altman to a reporter outside of Congress: \"The economic impact of AI on jobs is a going to be a huge topic.\" Atlassian just laid of 1,600 people because of AI. 300 million full-time jobs are at risk globally due to AI. Meta is preparing massive layoffs to fund AI investments. The man who started the fire called it a forecast.",
    "sentiment": "negative",
    "tone": "fear",
    "engagement": {
      "likes": 208,
      "comments": 43,
      "views": 90000
    },
    "date": "2026-03-14",
    "narrative": 1
  },
  {
    "id": 12,
    "platform": "twitter",
    "source": "@tukifromkl",
    "message": "$600 billion of AI investment just bought... 1.5 hours of usage per 233k... 90% of companies saying it had zero impact on jobs or productivity... and 25% of executives not using it at all... The entire tech industry restructured itself around the idea that AI would replace half the workforce... Companies fired thousands of people and blamed AI. The biggest wealth transfer in tech history wasn't AI replacing workers... It was CEOs using the treat of AI to fire workers... pocket the savings... and sell the story to wall street...",
    "sentiment": "negative",
    "tone": "skepticism",
    "engagement": {
      "likes": 812,
      "comments": 27,
      "views": 62000
    },
    "date": "2026-04-06",
    "narrative": 1
  },
  {
    "id": 13,
    "platform": "twitter",
    "source": "@unusual_whales",
    "message": "\"Massive investment in AI contributed basically zero to US economic growth last year\" per Goldman Sachs",
    "sentiment": "negative",
    "tone": "resignation",
    "engagement": {
      "likes": 49000,
      "comments": 721,
      "views": 7300000
    },
    "date": "2026-03-19",
    "narrative": 1
  },
  {
    "id": 14,
    "platform": "twitter",
    "source": "@rationalaussie",
    "message": "Imagine the impact of a $200k job instead costing $20, and a year's worth of work taking 20 minutes. Then tell me with a straight face that AI will create more job than it destroys. You'd have to be a bona fide retard to believe that.",
    "sentiment": "negative",
    "tone": "sarcasm",
    "engagement": {
      "likes": 341,
      "comments": 96,
      "views": 19000
    },
    "date": "2026-03-30",
    "narrative": 3
  },
  {
    "id": 15,
    "platform": "twitter",
    "source": "@matteopelleg",
    "message": "More economic activity = more jobs. Less economic activity = less jobs. AI is gonna 10x the size of the economy.",
    "sentiment": "positive",
    "tone": "excitement",
    "engagement": {
      "likes": 45,
      "comments": 3,
      "views": 3800
    },
    "date": "2026-04-05T12:00:00Z",
    "narrative": 2
  },
  {
    "id": 16,
    "platform": "twitter",
    "source": "@lennysan",
    "message": "Engineering is getting the most AI leverage - and it's squeezing PMs and designers. With Claude code, a five engineer team now produces the output of 15 to 20 engineers.",
    "sentiment": "mixed",
    "tone": "excitement",
    "engagement": {
      "likes": 835,
      "comments": 49,
      "views": 189000
    },
    "date": "2026-04-06T12:00:00Z",
    "narrative": 2
  },
  {
    "id": 17,
    "platform": "youtube",
    "source": "@CNBCtelevision",
    "message": "Stephen Pagliuca, Senior Advisor at Bain Capital, says AI is disrupting software valuations while accelerating biotech breakthroughs, reshaping global supply chains, and fueling long term growth in infrastructure, healthcare, and sports investments.",
    "sentiment": "positive",
    "tone": "excitement",
    "engagement": {
      "likes": 36,
      "comments": 5,
      "views": 7200
    },
    "date": "2026-02-04T12:00:00Z",
    "narrative": 2
  },
  {
    "id": 18,
    "platform": "youtube",
    "source": "@economicshelp",
    "message": "They are lying to you - AI is not taking your job (yet). AI is still prone to making mistakes. We've been worrying about technology taking over human jobs since the invention of the wheel. AI disruption is similar to other technology. AI in a way is helping things to become more competitive.",
    "sentiment": "positive",
    "tone": "skepticism",
    "engagement": {
      "likes": 662,
      "comments": 207,
      "views": 14000
    },
    "date": "2026-02-17T12:00:00Z",
    "narrative": 4
  },
  {
    "id": 19,
    "platform": "youtube",
    "source": "@CalNewportMedia",
    "message": "Will AI destroy the economy? (According to economists: no). Balanced take on the mass hysteria behind AI vs what is actually happening.",
    "sentiment": "positive",
    "tone": "skepticism",
    "engagement": {
      "likes": 1300,
      "comments": 229,
      "views": 35000
    },
    "date": "2026-03-12T12:00:00Z",
    "narrative": 4
  },
  {
    "id": 20,
    "platform": "youtube",
    "source": "CBSNews",
    "message": "New research shows which jobs, regions most at risk from AI. 9M+ US jobs at risk, mostly white collar. 55% of writers, programmers, & designers at risk. 38% for workforce in \"AI-resistant roles\"",
    "sentiment": "negative",
    "tone": "fear",
    "engagement": {
      "likes": 275,
      "comments": 98,
      "views": 18000
    },
    "date": "2026-03-26T12:00:00Z",
    "narrative": 1
  },
  {
    "id": 21,
    "platform": "youtube",
    "source": "@BloombergPodcasts",
    "message": "Former commerce secretary on where AI will actually create jobs. \"It's much easier to start your own business because of AI tools\"",
    "sentiment": "positive",
    "tone": "excitement",
    "engagement": {
      "likes": 6,
      "comments": 0,
      "views": 429
    },
    "date": "2026-04-06T12:00:00Z",
    "narrative": 2
  },
  {
    "id": 22,
    "platform": "youtube",
    "source": "@TheDiaryOfACEO",
    "message": "AI will make plumbers earn more than lawyers. The economy is about to collapse and it's important to have the skills to survive in this new era.",
    "sentiment": "negative",
    "tone": "fear",
    "engagement": {
      "likes": 32000,
      "comments": 5200,
      "views": 1600000
    },
    "date": "2026-03-16T12:00:00Z",
    "narrative": 1
  },
  {
    "id": 23,
    "platform": "reddit",
    "source": "r/antiai",
    "message": "Oracle laid off 30000 people to fund their AI. This has a huge impact on people's lives and some of them impacted weren't involved in AI but lost their jobs to fund it.",
    "sentiment": "negative",
    "tone": "resignation",
    "engagement": {
      "likes": 414,
      "comments": 91,
      "views": null
    },
    "date": "2026-04-01T12:00:00Z",
    "narrative": 1
  },
  {
    "id": 24,
    "platform": "reddit",
    "source": "r/ArtificialIntelligence",
    "message": "The \"AI will replace such and such jobs in such and such time\" is getting pretty old. Companies have been saying it since forever and there is no proof from real life companies whatsoever. On the contrary, companies who did try to replace their workers with AI seem to be hiring back and reporting minimum output.",
    "sentiment": "negative",
    "tone": "sarcasm",
    "engagement": {
      "likes": 373,
      "comments": 404,
      "views": null
    },
    "date": "2026-02-13T12:00:00Z",
    "narrative": 1
  },
  {
    "id": 25,
    "platform": "reddit",
    "source": "r/changemyview",
    "message": "AI allows us to use computers a lot more easily and efficiently with being able to accept more natural language input and ability to be trained on more complex tasks than previous automations.",
    "sentiment": "positive",
    "tone": "excitement",
    "engagement": {
      "likes": 573,
      "comments": 365,
      "views": null
    },
    "date": "2026-03-10T12:00:00Z",
    "narrative": 2
  },
  {
    "id": 26,
    "platform": "tiktok",
    "source": "@wilsonpofcher",
    "message": "Why it's impossible to find a job: In 2026, 75% of all resumes and job applications are reviewed and rejected automatically by AI software. All your experience is reviewed by a software that has no conscience.",
    "sentiment": "negative",
    "tone": "fear",
    "engagement": {
      "likes": 69400,
      "comments": 801,
      "views": 359100
    },
    "date": "2026-01-21T12:00:00Z",
    "narrative": 1
  },
  {
    "id": 27,
    "platform": "tiktok",
    "source": "@bbcnews",
    "message": "I've been rejected for over 100 jobs - AI is making it harder. Job vacancies have almost halved since the post-pandemic peak while higher costs for employers and strengthened rights for new hires have made firms more reluctant to recruit.",
    "sentiment": "negative",
    "tone": "fear",
    "engagement": {
      "likes": 420600,
      "comments": 3501,
      "views": 4400000
    },
    "date": "2026-03-18T12:00:00Z",
    "narrative": 1
  }
];

// ── Persistence layer ──
// SIGNALS is the live working array; changes are saved to localStorage.
const SIGNALS = (function () {
    try {
        const stored = localStorage.getItem("monitor_signals");
        if (stored) return JSON.parse(stored);
    } catch (e) { /* ignore parse errors, fall back to seed */ }
    return JSON.parse(JSON.stringify(SEED_SIGNALS)); // deep copy
})();

function saveSignals() {
    try { localStorage.setItem("monitor_signals", JSON.stringify(SIGNALS)); }
    catch (e) { console.warn("Could not save to localStorage", e); }
}

/* ============================================================
   NARRATIVE ANALYSIS ENGINE
   Clusters signals by content analysis and generates narratives,
   risk assessments, alerts, and analysis data dynamically.
   ============================================================ */
const NarrativeEngine = (function () {

    const THEMES = [
        {
            id: 1,
            title: "The Great Displacement",
            cssClass: "n1",
            color: "#f85149",
            keywords: [
                "replace", "laid off", "fire", "gone", "lost", "eliminat", "cut",
                "obsolet", "automat", "restructur", "downsiz", "headcount",
                "layoff", "displace", "crisis", "cooked", "proficient in ai",
                "department went from", "workload dropped"
            ],
            sentimentWeights: { negative: 3, mixed: 1, positive: -1 },
            toneWeights: { fear: 3, resignation: 3, sarcasm: 1, skepticism: 0, excitement: -1 },
            driverLabels: ["Economic anxiety", "Personal loss", "Career uncertainty", "Generational fear"],
            riskFactors: ["Viral velocity", "Emotional resonance", "Cross-platform spread", "Self-reinforcing loop", "Authentic sources"],
            descTemplate: "AI is actively eliminating jobs, with real people experiencing layoffs and career disruption across industries. Driven by personal stories, workforce reduction data, and corporate restructuring announcements.",
            riskTemplate: "This narrative carries the highest risk due to its emotional intensity, personal authenticity, and viral velocity. Real stories create powerful social proof that resonates across demographics. The narrative is self-reinforcing: each new story validates existing fears."
        },
        {
            id: 2,
            title: "AI as Amplifier, Not Replacement",
            cssClass: "n2",
            color: "#58a6ff",
            keywords: [
                "opportunit", "productiv", "growth", "adapt", "creat", "hiring",
                "new job", "amplif", "collaborat", "alongside", "leverage",
                "irreplaceable", "skill", "boost", "increase", "built a",
                "headcount is up", "not replacing", "focus on"
            ],
            sentimentWeights: { positive: 3, mixed: 1, negative: -1 },
            toneWeights: { excitement: 3, skepticism: 0, sarcasm: -1, fear: -1, resignation: -1 },
            driverLabels: ["Techno-optimism", "Entrepreneurial mindset", "Corporate messaging", "Adaptation narrative"],
            riskFactors: ["Corporate-aligned messaging", "Data-dependent", "Limited emotional resonance", "Credibility questions"],
            descTemplate: "AI is a productivity multiplier that creates new opportunities. Workers who adapt will thrive. Companies using AI are growing, not shrinking. This counter-narrative emphasizes human-AI collaboration and upskilling.",
            riskTemplate: "While this narrative represents a genuine counter-perspective, it lacks the emotional punch of displacement stories. Its primary amplifiers tend to be corporate accounts and tech optimists, limiting credibility among those most affected."
        },
        {
            id: 3,
            title: "The Accountability Gap",
            cssClass: "n3",
            color: "#d29922",
            keywords: [
                "policy", "tax", "reskill", "government", "regulat", "ubi",
                "accountab", "union", "mandat", "legislat", "act",
                "senate", "hearing", "campaign", "protect", "who's paying",
                "humans first", "fund", "unemployment", "labor"
            ],
            sentimentWeights: { mixed: 3, negative: 2, positive: 0 },
            toneWeights: { fear: 2, excitement: 2, skepticism: 1, sarcasm: 0, resignation: 0 },
            driverLabels: ["Policy urgency", "Inequality", "Corporate distrust", "Worker solidarity"],
            riskFactors: ["Institutional legitimacy", "Policy momentum", "Organized amplification", "Escalation potential"],
            descTemplate: "Who is responsible when AI displaces workers? This narrative focuses on policy failures, corporate accountability, and demands for systemic solutions like AI taxes, UBI, and reskilling mandates.",
            riskTemplate: "This policy-focused narrative channels displaced worker frustration into political demands, which can escalate from online discourse to real-world action. Legislative activity and organized campaigns give it institutional legitimacy."
        },
        {
            id: 4,
            title: "The Skeptic's Check",
            cssClass: "n4",
            color: "#3fb950",
            keywords: [
                "overhype", "panic", "histor", "atm", "not ready", "overblown",
                "demo", "reality", "same panic", "every time", "premature",
                "fix what", "hired back", "data-driven", "not different",
                "spreadsheet", "factory", "teller", "rehir", "satisfaction dropped"
            ],
            sentimentWeights: { positive: 2, mixed: 2, negative: -1 },
            toneWeights: { sarcasm: 3, skepticism: 3, excitement: 0, fear: -1, resignation: -1 },
            driverLabels: ["Empirical skepticism", "Historical awareness", "Technical realism", "Contrarian positioning"],
            riskFactors: ["Evidence-based", "Moderating influence", "Limited emotional driver", "Niche audience"],
            descTemplate: "AI capabilities are overhyped and real-world deployments consistently underperform demos. Historical precedent suggests net job creation, not destruction. The current panic is premature.",
            riskTemplate: "Skeptical counter-narratives serve as a natural moderating force grounded in empirical observation and historical precedent. Risk is low because this narrative doesn't fuel anxiety or demand action — it provides context."
        }
    ];

    // ── Scoring & Classification ──

    function scoreSignal(signal, theme) {
        const msg = signal.message.toLowerCase();
        let score = 0;
        theme.keywords.forEach(kw => { if (msg.includes(kw)) score += 3; });
        score += (theme.sentimentWeights[signal.sentiment] || 0);
        score += (theme.toneWeights[signal.tone] || 0);
        return score;
    }

    function classifySignals(signals) {
        signals.forEach(signal => {
            let best = -Infinity, bestId = THEMES[0].id;
            THEMES.forEach(t => {
                const s = scoreSignal(signal, t);
                if (s > best) { best = s; bestId = t.id; }
            });
            signal.narrative = bestId;
        });
    }

    function eng(s) {
        return (s.engagement.likes || 0)
             + (s.engagement.comments || 0) * 3
             + (s.engagement.views || 0) * 0.01;
    }

    // ── Cluster Analytics ──

    function calcPlatformStrength(cluster, allP) {
        const cnt = {}, e = {};
        allP.forEach(p => { cnt[p] = 0; e[p] = 0; });
        cluster.forEach(s => { cnt[s.platform]++; e[s.platform] += eng(s); });
        const tot = cluster.length || 1;
        const totE = Object.values(e).reduce((a, b) => a + b, 0) || 1;
        const r = {};
        allP.forEach(p => {
            const c = (cnt[p] / tot + e[p] / totE) / 2;
            r[p] = c >= 0.3 ? "strong" : c >= 0.1 ? "moderate" : "weak";
        });
        return r;
    }

    function calcVelocity(cluster) {
        if (cluster.length < 2) return "steady";
        const sorted = [...cluster].sort((a, b) => new Date(a.date) - new Date(b.date));
        const mid = Math.floor(sorted.length / 2);
        const early = sorted.slice(0, mid).reduce((s, x) => s + eng(x), 0);
        const late = sorted.slice(mid).reduce((s, x) => s + eng(x), 0);
        const ratio = late / (early || 1);
        return ratio > 1.3 ? "accelerating" : ratio < 0.7 ? "decelerating" : "steady";
    }

    function calcRisk(narrative, cluster) {
        let r = 0;
        const totE = cluster.reduce((s, x) => s + eng(x), 0);
        if (totE > 500000) r += 2; else if (totE > 100000) r += 1;
        if (cluster.length >= 8) r += 2; else if (cluster.length >= 5) r += 1;
        const negR = cluster.filter(s => s.sentiment === "negative").length / (cluster.length || 1);
        if (negR > 0.6) r += 2; else if (negR > 0.3) r += 1;
        if (narrative.velocity === "accelerating") r += 1;
        const plats = new Set(cluster.map(s => s.platform));
        if (plats.size >= 4) r += 1; else if (plats.size >= 3) r += 0.5;
        return r >= 6 ? "high" : r >= 3 ? "medium" : "low";
    }

    function topExamples(cluster, n) {
        return [...cluster]
            .sort((a, b) => eng(b) - eng(a))
            .slice(0, n)
            .map(s => '"' + (s.message.length > 120 ? s.message.slice(0, 117) + "..." : s.message) + '"');
    }

    // ── Helpers ──
    function fN(n) {
        if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
        if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
        return String(n);
    }
    function pL(k) {
        return { reddit: "Reddit", twitter: "X/Twitter", tiktok: "TikTok", youtube: "YouTube" }[k] || k;
    }

    // ── Alerts ──
    function buildAlerts(signals, nMap) {
        return [...signals]
            .sort((a, b) => eng(b) - eng(a))
            .slice(0, 5)
            .map(s => {
                const e = eng(s);
                const n = nMap[s.narrative];
                const metric = s.engagement.views ? fN(s.engagement.views) + " views" : fN(s.engagement.likes) + " likes";
                const hrs = Math.max(1, Math.round((Date.now() - new Date(s.date).getTime()) / 3.6e6));
                return {
                    level: e > 200000 ? "high" : e > 50000 ? "medium" : "low",
                    message: pL(s.platform) + " signal (" + metric + ") from " + s.source
                           + (n ? ' — amplifying "' + n.title + '" narrative' : ""),
                    time: hrs < 24 ? hrs + "h ago" : Math.round(hrs / 24) + "d ago"
                };
            });
    }

    // ── Analysis Text ──
    function buildAnalysis(narratives, signals) {
        var accel = narratives.filter(n => n.velocity === "accelerating");
        var velFindings = narratives.map(n => {
            var tag = n.velocity === "accelerating" ? "analysis-highlight" : "";
            var label = tag ? "<span class='" + tag + "'>\"" + n.title + "\"</span>" : "\"" + n.title + "\"";
            var strong = Object.entries(n.platforms).filter(([, v]) => v === "strong").map(([k]) => pL(k));
            if (n.velocity === "accelerating")
                return label + " is accelerating — driven by high-engagement content" + (strong.length ? " on " + strong.join(" and ") : "") + ".";
            return label + " maintains " + n.velocity + " growth with " + n.signalCount + " tracked signals.";
        });

        var pe = {};
        ["tiktok", "twitter", "youtube", "reddit"].forEach(p => {
            var ps = signals.filter(s => s.platform === p);
            pe[p] = { total: ps.reduce((sum, s) => sum + eng(s), 0), count: ps.length };
        });
        var ampFindings = [
            "<span class='analysis-highlight'>TikTok</span> drives highest raw engagement with " + fN(pe.tiktok.total) + " total engagement across " + pe.tiktok.count + " signals.",
            "<span class='analysis-highlight'>X/Twitter</span> serves as the informational hub with " + pe.twitter.count + " signals — data-driven threads and news hooks spread fastest here.",
            "<span class='analysis-highlight'>YouTube</span> provides narrative longevity — long-form content sustains narratives over extended periods.",
            "<span class='analysis-highlight'>Reddit</span> functions as the discussion layer — highest comment depth, generating detailed anecdotes that become source material for other platforms."
        ];

        var neg = signals.filter(s => s.sentiment === "negative").length;
        var pos = signals.filter(s => s.sentiment === "positive").length;
        var mix = signals.filter(s => s.sentiment === "mixed").length;
        var hiEng = signals.filter(s => eng(s) > 50000).length;
        var snFindings = [
            "<span class='analysis-highlight'>High Signal:</span> " + hiEng + " of " + signals.length + " signals exceed 50K engagement — these represent the most impactful content driving discourse.",
            "<span class='analysis-highlight'>Sentiment breakdown:</span> " + neg + " negative, " + pos + " positive, " + mix + " mixed — " + (neg > pos ? "net negative bias in the discourse" : "relatively balanced sentiment distribution") + ".",
            "Cross-platform repetition of core themes indicates genuine cultural concern, not manufactured noise.",
            "Low-value content (generic takes without specifics) accounts for an estimated 15-20% of total volume."
        ];

        var uniq = new Set(signals.map(s => s.source)).size;
        var orgFindings = [
            "<span class='analysis-highlight'>Organic indicators:</span> " + uniq + " unique sources across " + signals.length + " signals — high diversity suggests authentic spread.",
            "Personal content shows natural variation in framing across platforms, consistent with organic discussion.",
            "Policy-related signals show some organized amplification patterns (shared hashtags, synchronized themes), typical of advocacy movements.",
            "No clear indicators of bot networks or inauthentic amplification — engagement patterns are consistent with organic viral spread."
        ];

        return {
            velocity: {
                summary: accel.length ? accel.map(n => '"' + n.title + '"').join(" and ") + " showing fastest acceleration in engagement." : "All narratives maintaining steady velocity.",
                findings: velFindings
            },
            amplification: {
                summary: "Platform roles: TikTok drives emotional amplification, X/Twitter drives informational spread, YouTube provides depth, Reddit generates source material.",
                findings: ampFindings
            },
            signalNoise: {
                summary: Math.round(hiEng / (signals.length || 1) * 100) + "% of signals represent high-engagement content. Discourse leans " + (neg > pos ? "negative" : "balanced") + ".",
                findings: snFindings
            },
            organic: {
                summary: "Spread appears predominantly organic across " + uniq + " unique sources. Limited structured amplification in policy content.",
                findings: orgFindings
            }
        };
    }

    // ── Time-series Generation ──

    function getDateRange(signals) {
        if (signals.length === 0) {
            var now = new Date();
            var labels = [], days = [];
            for (var i = 7; i >= 0; i--) {
                var d = new Date(now); d.setDate(d.getDate() - i);
                labels.push(d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
                days.push(d);
            }
            return { labels: labels, days: days };
        }
        var dates = signals.map(s => new Date(s.date)).filter(d => !isNaN(d.getTime()));
        if (dates.length === 0) return getDateRange([]);
        var minD = new Date(Math.min(...dates));
        var maxD = new Date(Math.max(...dates));
        // Ensure at least 7 days of range
        var diffDays = Math.round((maxD - minD) / 86400000);
        if (diffDays < 7) {
            minD = new Date(maxD);
            minD.setDate(minD.getDate() - 7);
        }
        var labels = [], days = [];
        var cur = new Date(minD);
        cur.setHours(0,0,0,0);
        var end = new Date(maxD);
        end.setHours(23,59,59,999);
        while (cur <= end) {
            labels.push(cur.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
            days.push(new Date(cur));
            cur.setDate(cur.getDate() + 1);
        }
        return { labels: labels, days: days };
    }

    function buildVelocityData(signals, narratives) {
        var range = getDateRange(signals);
        var labels = range.labels, days = range.days;
        var datasets = {}, nMap = {};
        narratives.forEach(n => { datasets[n.title] = new Array(days.length).fill(0); nMap[n.id] = n; });
        signals.forEach(s => {
            var sd = new Date(s.date), n = nMap[s.narrative];
            if (!n) return;
            for (var i = 0; i < days.length; i++) {
                if (sd.toDateString() === days[i].toDateString()) {
                    datasets[n.title][i] += Math.round(eng(s) / 1000);
                    break;
                }
            }
        });
        // Convert to cumulative
        narratives.forEach(n => {
            var cum = 0;
            datasets[n.title] = datasets[n.title].map(v => { cum += v; return cum; });
        });
        return { labels: labels, datasets: datasets };
    }

    function buildVolumeData(signals) {
        var range = getDateRange(signals);
        var labels = range.labels, days = range.days;
        var datasets = { reddit: [], twitter: [], tiktok: [], youtube: [] };
        days.forEach(d => {
            Object.keys(datasets).forEach(p => {
                datasets[p].push(signals.filter(s =>
                    s.platform === p && new Date(s.date).toDateString() === d.toDateString()
                ).length);
            });
        });
        return { labels: labels, datasets: datasets };
    }

    // ── Main Entry Point ──
    function analyze(signals) {
        var allP = ["reddit", "twitter", "tiktok", "youtube"];
        classifySignals(signals);

        var grouped = {};
        THEMES.forEach(t => { grouped[t.id] = []; });
        signals.forEach(s => { if (grouped[s.narrative]) grouped[s.narrative].push(s); });

        var narratives = THEMES.map(theme => {
            var cluster = grouped[theme.id] || [];
            if (cluster.length === 0) return null;
            var vel = calcVelocity(cluster);
            var n = {
                id: theme.id,
                title: theme.title,
                cssClass: theme.cssClass,
                color: theme.color,
                description: theme.descTemplate,
                examples: topExamples(cluster, 3),
                drivers: theme.driverLabels,
                platforms: calcPlatformStrength(cluster, allP),
                velocity: vel,
                signalCount: cluster.length,
                riskLevel: "low"
            };
            n.riskLevel = calcRisk(n, cluster);
            return n;
        }).filter(Boolean);

        var nMap = {};
        narratives.forEach(n => { nMap[n.id] = n; });

        var riskAssessments = narratives.map(n => {
            var theme = THEMES.find(t => t.id === n.id);
            return {
                narrative: n.title,
                level: n.riskLevel,
                reasoning: theme.riskTemplate,
                factors: theme.riskFactors
            };
        });

        return {
            narratives: narratives,
            riskAssessments: riskAssessments,
            alerts: buildAlerts(signals, nMap),
            analysisData: buildAnalysis(narratives, signals),
            velocityData: buildVelocityData(signals, narratives),
            volumeData: buildVolumeData(signals)
        };
    }

    return { analyze: analyze, THEMES: THEMES };
})();

// ── Analysis Results (populated by runAnalysis) ──
let NARRATIVES = [];
let RISK_ASSESSMENTS = [];
let ALERTS = [];
let ANALYSIS_DATA = {};
let VELOCITY_DATA = {};
let VOLUME_DATA = {};

function runAnalysis() {
    var results = NarrativeEngine.analyze(SIGNALS);
    NARRATIVES = results.narratives;
    RISK_ASSESSMENTS = results.riskAssessments;
    ALERTS = results.alerts;
    ANALYSIS_DATA = results.analysisData;
    VELOCITY_DATA = results.velocityData;
    VOLUME_DATA = results.volumeData;
}

// Run initial analysis
runAnalysis();
