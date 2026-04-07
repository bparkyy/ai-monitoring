# Social Media Narrative Monitor — AI & Job Displacement

A real-time monitoring dashboard that analyzes cross-platform social media discourse around AI's impact on employment. Signals are collected from Reddit, X/Twitter, TikTok, and YouTube, then run through a classification engine that automatically detects emerging narratives, computes risk levels, and generates executive-level intelligence briefs.

## Features

- **Narrative Classification Engine** — Scores each signal against theme definitions using weighted keyword matching, sentiment alignment, and tone analysis to automatically group posts into narrative clusters
- **Dynamic Risk Assessment** — Computes threat levels from engagement volume, sentiment ratio, cross-platform spread, and narrative velocity
- **Interactive Charts** — Signal volume over time, sentiment distribution, platform breakdown, and narrative velocity trends (Chart.js)
- **Signal Collection** — Manual entry form with platform, source, sentiment, tone, engagement metrics, and post date. JSON import/export supported
- **Executive Brief Generator** — Synthesizes all analysis into a stakeholder-ready intelligence report
- **Reactive Pipeline** — All analytics (charts, KPIs, alerts, risk matrix, narratives, brief) regenerate live whenever data changes

## Detected Narratives

The engine classifies signals into four narrative clusters:

| Narrative | Description |
|-----------|-------------|
| **The Great Displacement** | AI is actively eliminating jobs — personal stories of layoffs and career disruption |
| **AI as Amplifier, Not Replacement** | AI creates opportunity for those who adapt — productivity gains and new roles |
| **The Accountability Gap** | Policy failures and corporate accountability — demands for AI taxes, UBI, reskilling mandates |
| **The Skeptic's Check** | AI capabilities are overhyped — real deployments underperform, historical precedent suggests job creation |

## Tech Stack

- **JavaScript** (vanilla) — classification engine, data pipeline, UI logic
- **Chart.js** — interactive data visualizations
- **HTML/CSS** — responsive dashboard layout
- **localStorage** — client-side persistence with JSON import/export

## How It Works

1. **Signals** are collected (manually or via JSON import) with platform, source, message, sentiment, tone, engagement metrics, and date
2. The **NarrativeEngine** scores each signal against four theme definitions using keyword frequency, sentiment polarity weights, and tone alignment
3. Signals are grouped into **narrative clusters** with computed platform strength, velocity, risk level, and representative examples
4. **Risk assessment** factors in total engagement, signal count, negative sentiment ratio, velocity trend, and cross-platform penetration
5. All dashboard views — charts, KPIs, alerts, narrative cards, risk matrix, and executive brief — are generated dynamically from the analysis results

## Data

The dashboard includes 27 real signals collected from public social media posts across Reddit, X/Twitter, TikTok, and YouTube. Signals span February–April 2026 and cover the full spectrum of discourse around AI and employment.

## Usage

Open `dashboard/index.html` in a browser. No build step or server required.

- **Overview** — KPIs, charts, and alerts at a glance
- **Collect** — Add signals manually or import/export JSON datasets
- **Signal Collection** — Browse and filter all tracked signals
- **Narratives** — Auto-detected narrative clusters with examples, drivers, and platform strength
- **Analysis** — Velocity, amplification patterns, signal vs. noise, organic vs. coordinated spread
- **Risk Assessment** — Per-narrative risk cards and risk matrix
- **Executive Brief** — Generate a polished internal-style narrative analysis report
