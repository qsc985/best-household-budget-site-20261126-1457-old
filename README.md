[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/qsc985/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/qsc985/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

# Chen Family Ledger — a household budget site

A working household budget site for one fictional family, the Chens, that runs entirely from static files in your browser — no network requests, no build step. Open `app/index.html` (or run `node serve.ts` and visit http://localhost:8080) and it works on desktop and on a phone.

## What it does

- **Dashboard** — November 2026 income ($9,850) vs spending ($6,301.11), money left to spend ($3,548.89), savings rate (36%), a spending-by-category donut chart and a six-month income-vs-spending bar chart (both hand-drawn inline SVG), upcoming bills, and the budgets closest to their limits.
- **Transactions** — all 42 November transactions with real figures, searchable, filterable by category, with a working add-transaction form (totals, charts and budgets update live) and per-row delete. Edits persist in localStorage.
- **Budgets** — twelve monthly category budgets ($7,255 total) with progress meters, amounts left or over, and a working edit-budget control for every category.
- **Bills & Goals** — twelve recurring bills with due dates, autopay flags and paid/unpaid toggles ($945.99 still to pay, $3,773.25 already paid), plus four savings goals (emergency fund, Hawaii vacation, new car, kids’ college — $19,710 saved toward $48,600) with progress meters and a working contribute control.
- **Insights** — computed from the live figures: biggest spending category, daily average, projected month-end, biggest single payment, budget health, cheapest day, and the six-month saving record.

## Files

- `app/index.html` — page shell and navigation
- `app/styles.css` — the whole look (warm paper, deep teal ink, coral for spending; system fonts only)
- `app/data.js` — the Chen household’s figures: income, 42 transactions, 12 budgets, 12 bills, 4 goals, 6 months of trend
- `app/charts.js` — the donut and bar charts, drawn as inline SVG
- `app/app.js` — hash router, views, and every control
- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to `/output` and writes `dossier.json`
- `screenshots/` — four real renders of the site (dashboard, transactions, budgets, phone)
