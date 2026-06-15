/* storage.js — Local persistence layer (offline-first).
 *
 * All study progress lives in localStorage so the app works 100% offline.
 * This module is the ONLY place that touches localStorage, so the data
 * shape stays consistent and is easy to export/import for cross-device sync.
 */
(function () {
  "use strict";

  var KEY = "part65.state.v1";
  var SCHEMA_VERSION = 1;

  // Default, empty state.
  function freshState() {
    return {
      schema: SCHEMA_VERSION,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      deviceId: "dev-" + Math.random().toString(36).slice(2, 10),
      // Per-question SRS records keyed by question id.
      cards: {}, // id -> { box, streak, lapses, seen, correct, lastSeen, nextDue, lastMs }
      // Aggregate counters.
      stats: {
        totalAnswered: 0,
        totalCorrect: 0,
        sessions: 0,
        lastStudyDay: null, // YYYY-MM-DD
        streakDays: 0,
        studySeconds: 0,   // wall-clock time inside study sessions
        timedSeconds: 0,   // summed per-question thinking time (for avg/question)
        timedCount: 0
      },
      // Per-day activity: "YYYY-MM-DD" -> { sec, ans, cor }. Powers the heatmap.
      daily: {},
      // Wall-clock seconds spent per domain (1-4). Powers "time by domain".
      domainTime: { 1: 0, 2: 0, 3: 0, 4: 0 },
      // Recent study sessions: [{ date, mode, sec, ans, cor }] (capped).
      sessionsLog: [],
      // Completed mock exams: [{ date, score, correct, total, durationSec, byDomain }]
      mocks: [],
      // User settings.
      settings: {
        dailyGoal: 30,
        examDate: null,
        confettiOnPass: true
      },
      // Sync bookkeeping (for the "online" features).
      sync: { lastBackup: null, lastImport: null }
    };
  }

  // Bring an older saved/seed state up to the current shape without losing data.
  // New fields are added; legacy single-number time is backfilled into the
  // daily log so the time dashboard is meaningful from the first load.
  function migrate(st) {
    if (!st.stats) st.stats = freshState().stats;
    if (st.stats.timedSeconds == null) st.stats.timedSeconds = st.stats.studySeconds || 0;
    if (st.stats.timedCount == null) st.stats.timedCount = st.stats.totalAnswered || 0;
    if (!st.domainTime) st.domainTime = { 1: 0, 2: 0, 3: 0, 4: 0 };
    if (!st.sessionsLog) st.sessionsLog = [];
    var hasDaily = st.daily && Object.keys(st.daily).length > 0;
    if (!st.daily) st.daily = {};
    // Backfill: attribute legacy study time/answers to the last study day so
    // the time dashboard isn't empty when upgrading from a pre-daily state.
    if (!hasDaily && st.stats.lastStudyDay && (st.stats.studySeconds || st.stats.totalAnswered)) {
      st.daily[st.stats.lastStudyDay] = {
        sec: st.stats.studySeconds || 0,
        ans: st.stats.totalAnswered || 0,
        cor: st.stats.totalCorrect || 0
      };
    }
    return st;
  }

  var state = null;

  function load() {
    if (state) return state;
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        state = JSON.parse(raw);
        if (!state.schema) state.schema = SCHEMA_VERSION;
        if (!state.cards) state.cards = {};
        if (!state.settings) state.settings = freshState().settings;
        if (!state.sync) state.sync = { lastBackup: null, lastImport: null };
        if (!state.mocks) state.mocks = [];
        migrate(state);
        return state;
      }
    } catch (e) {
      console.warn("State load failed, starting fresh:", e);
    }
    // No saved state in this browser yet. If a seed snapshot is present
    // (e.g. imported first-session progress), start from it; otherwise fresh.
    if (window.SEED_STATE) {
      try {
        var base = freshState();
        var seed = JSON.parse(JSON.stringify(window.SEED_STATE));
        state = Object.assign(base, seed);
        state.schema = SCHEMA_VERSION;
        state.cards = seed.cards || {};
        state.mocks = seed.mocks || [];
        state.stats = Object.assign(base.stats, seed.stats || {});
        state.settings = Object.assign(base.settings, seed.settings || {});
        state.sync = Object.assign(base.sync, seed.sync || {});
        state.seededFrom = seed.deviceId || true;
        migrate(state);
        saveNow();
        return state;
      } catch (e2) {
        console.warn("Seed load failed, starting fresh:", e2);
      }
    }
    state = freshState();
    save();
    return state;
  }

  var saveTimer = null;
  function save() {
    if (!state) return;
    state.updatedAt = Date.now();
    // Debounce writes so rapid answering doesn't thrash localStorage.
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
      } catch (e) {
        console.error("State save failed (storage full?):", e);
      }
    }, 150);
  }

  function saveNow() {
    if (saveTimer) clearTimeout(saveTimer);
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.error("State save failed:", e);
    }
  }

  // Export the full state as a pretty JSON string (for backup / cross-device).
  function exportJSON() {
    state.sync.lastBackup = Date.now();
    saveNow();
    return JSON.stringify(state, null, 2);
  }

  // Merge an imported state into the current one. We keep the BEST progress
  // per card (more reviews / further-due wins) so importing on a second
  // device never loses work — this is the core of cross-device sync.
  function importJSON(text) {
    var incoming = JSON.parse(text);
    if (!incoming || typeof incoming !== "object" || !incoming.cards) {
      throw new Error("Not a valid Part 65 backup file.");
    }
    var cur = load();
    // Merge cards: take the record with more exposures; if tied, the later nextDue.
    Object.keys(incoming.cards).forEach(function (id) {
      var a = cur.cards[id];
      var b = incoming.cards[id];
      if (!a) {
        cur.cards[id] = b;
      } else {
        var aScore = (a.seen || 0) + (a.box || 0);
        var bScore = (b.seen || 0) + (b.box || 0);
        cur.cards[id] = bScore > aScore ? b : a;
      }
    });
    // Merge counters by taking the max (idempotent-ish, avoids double counting on re-import).
    cur.stats.totalAnswered = Math.max(cur.stats.totalAnswered, incoming.stats.totalAnswered || 0);
    cur.stats.totalCorrect = Math.max(cur.stats.totalCorrect, incoming.stats.totalCorrect || 0);
    cur.stats.studySeconds = Math.max(cur.stats.studySeconds, incoming.stats.studySeconds || 0);
    cur.stats.streakDays = Math.max(cur.stats.streakDays, incoming.stats.streakDays || 0);
    cur.stats.sessions = Math.max(cur.stats.sessions || 0, incoming.stats.sessions || 0);
    cur.stats.timedSeconds = Math.max(cur.stats.timedSeconds || 0, incoming.stats.timedSeconds || 0);
    cur.stats.timedCount = Math.max(cur.stats.timedCount || 0, incoming.stats.timedCount || 0);
    // Daily activity: keep the larger record per day (idempotent on re-import).
    var inDaily = incoming.daily || {};
    Object.keys(inDaily).forEach(function (day) {
      var a = cur.daily[day], b = inDaily[day];
      if (!a || (b.sec || 0) > (a.sec || 0)) cur.daily[day] = b;
    });
    // Per-domain time: take the max per domain.
    var inDT = incoming.domainTime || {};
    [1, 2, 3, 4].forEach(function (d) {
      cur.domainTime[d] = Math.max(cur.domainTime[d] || 0, inDT[d] || 0);
    });
    // Session log: merge and de-dupe by date, keep most recent 60.
    var seenSess = {};
    cur.sessionsLog.forEach(function (x) { seenSess[x.date] = true; });
    (incoming.sessionsLog || []).forEach(function (x) { if (!seenSess[x.date]) cur.sessionsLog.push(x); });
    cur.sessionsLog.sort(function (x, y) { return new Date(y.date) - new Date(x.date); });
    cur.sessionsLog = cur.sessionsLog.slice(0, 60);
    // Merge mock history, de-duped by date.
    var seenDates = {};
    cur.mocks.forEach(function (m) { seenDates[m.date] = true; });
    (incoming.mocks || []).forEach(function (m) {
      if (!seenDates[m.date]) cur.mocks.push(m);
    });
    cur.mocks.sort(function (x, y) { return new Date(x.date) - new Date(y.date); });
    cur.sync.lastImport = Date.now();
    saveNow();
    return cur;
  }

  function resetAll() {
    state = freshState();
    saveNow();
    return state;
  }

  // Convenience accessors.
  function getCard(id) {
    return load().cards[id] || null;
  }
  function setCard(id, rec) {
    load().cards[id] = rec;
    save();
  }

  window.Store = {
    load: load,
    save: save,
    saveNow: saveNow,
    exportJSON: exportJSON,
    importJSON: importJSON,
    resetAll: resetAll,
    getCard: getCard,
    setCard: setCard,
    freshState: freshState
  };
})();
