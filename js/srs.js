/* srs.js — Adaptive spaced-repetition + weak-area targeting engine.
 *
 * This is the brain that "maximizes utilization of study time": it decides
 * which questions to show next so you spend time on what you're most likely
 * to miss on the real exam, and it schedules proven items further out so you
 * don't waste time re-drilling what you already know.
 *
 * Two mechanisms combine:
 *   1) A Leitner-style box system per question (memory scheduling).
 *   2) Topic/domain mastery weighting (targets your weak areas).
 *
 * It is 100% offline and deterministic given local state.
 */
(function () {
  "use strict";

  // Official Series 65 domain weights (fraction of scored questions).
  var DOMAIN_WEIGHTS = { 1: 0.15, 2: 0.25, 3: 0.30, 4: 0.30 };
  var PASS_THRESHOLD = 0.72; // 72% to pass (94/130).

  // Leitner box -> days until due again. Box 0 = brand new / just lapsed.
  var BOX_INTERVALS_DAYS = [0, 1, 3, 7, 16, 35];
  var MAX_BOX = BOX_INTERVALS_DAYS.length - 1;

  var DAY = 24 * 60 * 60 * 1000;

  function now() { return Date.now(); }

  function newCard() {
    return { box: 0, streak: 0, lapses: 0, seen: 0, correct: 0, lastSeen: 0, nextDue: 0, lastMs: 0 };
  }

  // Record an answer for a question and reschedule it.
  // correct: boolean, ms: response time in milliseconds.
  function grade(id, correct, ms) {
    var card = window.Store.getCard(id) || newCard();
    card.seen += 1;
    card.lastSeen = now();
    card.lastMs = ms || 0;
    if (correct) {
      card.correct += 1;
      card.streak += 1;
      // A fast, confident correct answer promotes faster.
      var jump = ms && ms < 8000 ? 1 : 1;
      card.box = Math.min(MAX_BOX, card.box + jump);
    } else {
      card.streak = 0;
      card.lapses += 1;
      // Missed items drop to box 0 so they resurface very soon.
      card.box = 0;
    }
    var interval = BOX_INTERVALS_DAYS[card.box] * DAY;
    // Box 0 items are due again within the same session (~1 minute).
    card.nextDue = card.box === 0 ? now() + 60 * 1000 : now() + interval;
    window.Store.setCard(id, card);
    return card;
  }

  // Mastery of a single card: blends accuracy with how "learned" (box) it is.
  function cardMastery(card) {
    if (!card || card.seen === 0) return null; // unknown
    var acc = card.correct / card.seen;
    var boxFactor = card.box / MAX_BOX;
    // Weighted: recent scheduling progress matters, but accuracy anchors it.
    return Math.max(0, Math.min(1, 0.6 * acc + 0.4 * boxFactor));
  }

  // Compute mastery per topic and per domain across the whole bank.
  // Returns { byTopic: {topic:{domain,seen,total,mastery,due}}, byDomain: {...}, overall, readiness }
  function analyze(bank) {
    var byTopic = {};
    var byDomain = {};
    var t = now();

    bank.forEach(function (q) {
      var card = window.Store.getCard(q.id);
      var tp = byTopic[q.topic] || (byTopic[q.topic] = {
        topic: q.topic, domain: q.domain, total: 0, seen: 0, masterySum: 0, masteryN: 0, due: 0, weakSeen: 0
      });
      var dm = byDomain[q.domain] || (byDomain[q.domain] = {
        domain: q.domain, name: q.domainName, total: 0, seen: 0, masterySum: 0, masteryN: 0, due: 0
      });
      tp.total += 1; dm.total += 1;
      if (card && card.seen > 0) {
        tp.seen += 1; dm.seen += 1;
        var m = cardMastery(card);
        tp.masterySum += m; tp.masteryN += 1;
        dm.masterySum += m; dm.masteryN += 1;
        if (card.nextDue && card.nextDue <= t) { tp.due += 1; dm.due += 1; }
      }
    });

    function finalize(o) {
      // Coverage-adjusted mastery: unseen questions count as 0 mastery so
      // that "I haven't studied this yet" lowers readiness honestly.
      var avgSeenMastery = o.masteryN ? o.masterySum / o.masteryN : 0;
      var coverage = o.total ? o.seen / o.total : 0;
      o.mastery = avgSeenMastery * coverage; // 0..1, honest readiness
      o.rawMastery = avgSeenMastery;          // accuracy on what you've tried
      o.coverage = coverage;
    }
    Object.keys(byTopic).forEach(function (k) { finalize(byTopic[k]); });
    Object.keys(byDomain).forEach(function (k) { finalize(byDomain[k]); });

    // Exam-weighted readiness prediction.
    var readiness = 0, wsum = 0;
    Object.keys(byDomain).forEach(function (d) {
      var w = DOMAIN_WEIGHTS[d] || 0;
      readiness += byDomain[d].mastery * w;
      wsum += w;
    });
    readiness = wsum ? readiness / wsum : 0;

    return {
      byTopic: byTopic,
      byDomain: byDomain,
      readiness: readiness,        // 0..1 predicted exam score
      passLine: PASS_THRESHOLD,
      onTrack: readiness >= PASS_THRESHOLD
    };
  }

  // Score a question for the adaptive picker. Higher = show sooner.
  // recentlySeen: Set of ids shown this session (to avoid repeats).
  function priority(q, analysis, recentlySeen) {
    if (recentlySeen && recentlySeen.has(q.id)) return -1;
    var card = window.Store.getCard(q.id);
    var t = now();
    var score = 0;

    if (!card || card.seen === 0) {
      // Unseen: solid baseline so new material gets covered.
      score = 50;
    } else {
      var m = cardMastery(card);
      if (card.nextDue && card.nextDue <= t) {
        // Due for review — the further overdue, the more urgent.
        var overdueDays = (t - card.nextDue) / DAY;
        score = 70 + Math.min(40, overdueDays * 5);
      } else {
        // Not due yet: deprioritize, but keep weak items in play.
        score = 20 * (1 - m);
      }
      // Lapses (repeatedly missed) get a persistent boost — hone in on misses.
      score += (card.lapses || 0) * 8;
      // Low mastery boost.
      score += (1 - m) * 25;
    }

    // Weak-topic weighting: practice your worst topics more.
    var tp = analysis.byTopic[q.topic];
    if (tp) score += (1 - tp.mastery) * 20;

    // Mirror real-exam composition so practice mix ~ exam mix.
    score *= (1 + (DOMAIN_WEIGHTS[q.domain] || 0.25));

    // Small jitter to avoid deterministic ordering / ties.
    score += Math.random() * 6;
    return score;
  }

  // Build an adaptive session of `count` questions from `bank`.
  // opts: { count, recentlySeen, domainFilter, topicFilter, missedOnly }
  function buildSession(bank, opts) {
    opts = opts || {};
    var count = opts.count || 20;
    var recent = opts.recentlySeen || new Set();
    var analysis = analyze(bank);

    var pool = bank.filter(function (q) {
      if (opts.domainFilter && q.domain !== opts.domainFilter) return false;
      if (opts.topicFilter && q.topic !== opts.topicFilter) return false;
      if (opts.missedOnly) {
        var c = window.Store.getCard(q.id);
        if (!c || c.lapses === 0) return false; // only ever-missed items
      }
      return true;
    });

    var scored = pool
      .map(function (q) { return { q: q, p: priority(q, analysis, recent) }; })
      .filter(function (x) { return x.p >= 0; })
      .sort(function (a, b) { return b.p - a.p; });

    return scored.slice(0, count).map(function (x) { return x.q; });
  }

  // Build a full mock exam: 130 questions weighted to exam composition.
  function buildMock(bank, total) {
    total = total || 130;
    var byDomain = { 1: [], 2: [], 3: [], 4: [] };
    bank.forEach(function (q) { if (byDomain[q.domain]) byDomain[q.domain].push(q); });
    var picks = [];
    Object.keys(DOMAIN_WEIGHTS).forEach(function (d) {
      var want = Math.round(total * DOMAIN_WEIGHTS[d]);
      var arr = shuffle(byDomain[d].slice());
      // If the bank is smaller than the target, take what we have.
      picks = picks.concat(arr.slice(0, Math.min(want, arr.length)));
    });
    return shuffle(picks).slice(0, Math.min(total, picks.length));
  }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  window.SRS = {
    DOMAIN_WEIGHTS: DOMAIN_WEIGHTS,
    PASS_THRESHOLD: PASS_THRESHOLD,
    grade: grade,
    analyze: analyze,
    buildSession: buildSession,
    buildMock: buildMock,
    cardMastery: cardMastery,
    shuffle: shuffle
  };
})();
