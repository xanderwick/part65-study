# Series 65 — Adaptive Study

A self-contained, **100% offline** web app for passing the **Series 65** exam
(NASAA *Uniform Investment Adviser Law Examination*) in the least study time
possible. It uses spaced repetition and weak-area targeting so every minute is
spent on what's most likely to move your score.

> Built as a static site — no install, no build step, no account, no tracking.
> Just open `index.html`.

## The exam (what you're training for)

| | |
|---|---|
| Scored questions | **130** (plus 10 unscored pretest = 140 total) |
| Time limit | **180 minutes** |
| Passing score | **72%** (94 of 130 correct) |
| Administered by | FINRA, on behalf of NASAA |

The four official content domains and their weights drive everything in this app:

| Domain | Topic | Exam weight |
|---|---|---|
| 1 | Economic Factors & Business Information | 15% |
| 2 | Investment Vehicle Characteristics | 25% |
| 3 | Client Investment Recommendations & Strategies | 30% |
| 4 | Laws, Regulations & Guidelines (incl. unethical practices) | 30% |

## How to use it

1. Open `index.html` in any modern browser (desktop or phone), **or** visit the
   GitHub Pages URL (see Deployment below).
2. Start with **Adaptive Quiz** daily — it's the core loop.
3. Watch the **Dashboard** readiness gauge climb toward the 72% pass line.
4. Take a **Mock Exam** every few days to pressure-test under real conditions.
5. Skim the **Cheat Sheets** for high-yield facts; use **Flashcards** for recall.

Your progress is saved in the browser automatically. To study across devices,
use **Settings → Export backup**, then **Import** the file on the other device
(progress merges — your best record per question is kept).

### Study modes

- **Adaptive Quiz** — 20 questions chosen by the engine: due-for-review items,
  your weakest topics, and uncovered material, mixed to mirror the real exam's
  domain weights. Immediate explanations.
- **Topic Drills** — focus a single domain or topic; or replay only questions
  you've previously missed.
- **Mock Exam** — full-length (130), half (65), or quick (30). Timed, no
  feedback until you submit, then a domain-by-domain breakdown and answer review.
- **Flashcards** — fast recall with self-grading that feeds the same schedule.
- **Cheat Sheets** — concise, high-yield notes per domain.
- **Progress** — mastery for every topic (weakest first), readiness vs. the
  pass line, and your mock-exam history.

## How the adaptive engine works

The goal is **minimum time to a passing score**. Two mechanisms combine
(`js/srs.js`):

1. **Leitner spaced repetition** — each question lives in a "box" (1–5). Get it
   right and it's scheduled further out (1 → 3 → 7 → 16 → 35 days); miss it and
   it drops to box 0 to resurface within the session. You stop wasting time on
   what you already know.
2. **Weak-area weighting** — the question picker scores every item by how overdue
   it is, how often you've missed it, your topic mastery, and the question's
   domain weight. Your worst, most exam-relevant topics come up most.

**Readiness** is a coverage-adjusted, exam-weighted prediction of your score:
unstudied material counts against you, so the number is honest. When it's
comfortably above 72%, you're ready.

## Project structure

```
index.html            App shell (loads data → engine → controller)
css/styles.css        Styles (dark, mobile-first, dependency-free)
js/storage.js         localStorage persistence + export/import sync
js/srs.js             Adaptive spaced-repetition + readiness engine
js/app.js             UI controller (all views & study modes)
data/q-domain1..4.js  182 practice questions w/ explanations, by domain
data/notes.js         High-yield cheat sheets, by domain
scripts/rebalance.js  Maintenance: evens out the correct-answer positions
```

## Deployment (free, via GitHub Pages)

1. Push to GitHub (this repo).
2. Repo **Settings → Pages → Build and deployment → Source: Deploy from a
   branch**, pick your branch and `/ (root)`.
3. Open the published URL on any device. Because the app is fully static and
   offline-capable, it works even with no connection after first load.

You can also just open `index.html` locally, or serve the folder with any static
server (e.g. `python3 -m http.server`).

## Maintaining the question bank

Questions are plain objects in `data/q-domain*.js`. To add one, copy an existing
entry and bump the `id`. After bulk edits, run:

```bash
node scripts/rebalance.js
```

to keep the correct answer evenly distributed across A/B/C/D (so position never
leaks the answer).

---

*Study aid only. Practice questions are original and exam-aligned but are not
actual exam items. Verify current exam specifications at finra.org / nasaa.org.*
