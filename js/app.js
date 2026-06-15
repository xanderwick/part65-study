/* app.js — UI controller wiring the adaptive engine to the study modes.
 *
 * Views: dashboard, adaptive quiz, topic drills, mock exam, flashcards,
 * cheat sheets, progress, settings. Pure vanilla JS, no build step — open
 * index.html directly or serve the folder statically.
 */
(function () {
  "use strict";

  var BANK = window.QUESTION_BANK || [];
  var NOTES = window.STUDY_NOTES || [];
  var Store = window.Store;
  var SRS = window.SRS;

  var DOMAIN_NAMES = {
    1: "Economic Factors & Business Information",
    2: "Investment Vehicle Characteristics",
    3: "Client Recommendations & Strategies",
    4: "Laws, Regulations & Ethics"
  };

  var view = document.getElementById("view");
  var tabs = document.getElementById("tabs");
  var toastEl = document.getElementById("toast");

  // Session memory of question ids shown, so the adaptive picker avoids repeats.
  var sessionSeen = new Set();

  /* ----------------------------- helpers ----------------------------- */

  function el(html) {
    var d = document.createElement("div");
    d.innerHTML = html.trim();
    return d.firstChild;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function pct(x) { return Math.round((x || 0) * 100); }
  function todayStr() { return new Date().toISOString().slice(0, 10); }

  var toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2200);
  }

  function barClass(m) { return m >= 0.72 ? "good" : m >= 0.5 ? "warn" : "bad"; }
  function verdictFor(r) {
    if (r >= 0.85) return { txt: "Exam-ready — strong margin", cls: "good" };
    if (r >= 0.72) return { txt: "On track to pass", cls: "good" };
    if (r >= 0.6) return { txt: "Close — keep drilling weak topics", cls: "warn" };
    if (r >= 0.4) return { txt: "Building — focus on coverage", cls: "warn" };
    return { txt: "Just getting started", cls: "bad" };
  }

  // Update aggregate stats + the daily study streak on each graded answer.
  function recordAnswer(correct, seconds) {
    var s = Store.load();
    s.stats.totalAnswered += 1;
    if (correct) s.stats.totalCorrect += 1;
    s.stats.studySeconds += Math.max(0, Math.round(seconds || 0));
    var today = todayStr();
    if (s.stats.lastStudyDay !== today) {
      var yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      s.stats.streakDays = s.stats.lastStudyDay === yest ? (s.stats.streakDays || 0) + 1 : 1;
      s.stats.lastStudyDay = today;
    }
    Store.save();
  }

  function updateReadinessChip() {
    var a = SRS.analyze(BANK);
    document.getElementById("readinessChip").innerHTML =
      "Readiness <b>" + pct(a.readiness) + "%</b>";
  }

  /* ----------------------------- router ----------------------------- */

  var VIEWS = {
    dashboard: renderDashboard,
    adaptive: renderAdaptiveStart,
    drill: renderDrillStart,
    mock: renderMockStart,
    flash: renderFlashStart,
    notes: renderNotes,
    progress: renderProgress,
    settings: renderSettings
  };

  function go(name) {
    Array.prototype.forEach.call(tabs.children, function (b) {
      b.classList.toggle("active", b.dataset.view === name);
    });
    location.hash = name;
    window.scrollTo(0, 0);
    detachKeys();
    view.innerHTML = "";
    (VIEWS[name] || renderDashboard)();
    updateReadinessChip();
  }

  tabs.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-view]");
    if (b) go(b.dataset.view);
  });

  /* --------------------------- DASHBOARD --------------------------- */

  function renderDashboard() {
    var a = SRS.analyze(BANK);
    var s = Store.load();
    var v = verdictFor(a.readiness);
    var acc = s.stats.totalAnswered ? s.stats.totalCorrect / s.stats.totalAnswered : 0;
    var dueCount = countDue();
    var lastMock = s.mocks.length ? s.mocks[s.mocks.length - 1] : null;

    var gaugeCol = a.readiness >= 0.72 ? "var(--good)" : a.readiness >= 0.5 ? "var(--warn)" : "var(--bad)";

    var examNote = "";
    if (s.settings.examDate) {
      var days = Math.ceil((new Date(s.settings.examDate) - Date.now()) / 86400000);
      examNote = days >= 0
        ? '<div class="subtle" style="margin-top:6px">📅 ' + days + ' day' + (days === 1 ? "" : "s") + ' until your exam (' + s.settings.examDate + ')</div>'
        : '<div class="subtle" style="margin-top:6px">Exam date ' + s.settings.examDate + ' has passed — update it in Settings.</div>';
    }

    var html = '' +
      '<div class="card fade-in">' +
        '<div class="gauge-wrap">' +
          '<div class="gauge" style="--val:' + pct(a.readiness) + ';--col:' + gaugeCol + '">' +
            '<div><div class="pct">' + pct(a.readiness) + '%</div><div class="cap">readiness</div></div>' +
          '</div>' +
          '<div class="gauge-info">' +
            '<div class="gauge-verdict" style="color:var(--' + v.cls + ')">' + v.txt + '</div>' +
            '<div class="subtle">Predicted exam score, weighted to the real Series&nbsp;65 domain mix. Pass line is <b>72%</b> (94/130). Unstudied questions count against you, so this rises as you cover and master material.</div>' +
            examNote +
            '<div class="btn-row" style="margin-top:14px">' +
              '<button class="btn primary" id="dashStudy">▶ Start adaptive session</button>' +
              (dueCount ? '<button class="btn" id="dashDue">⏰ ' + dueCount + ' due for review</button>' : '') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="grid-3 fade-in">' +
        statCard(pct(acc) + "%", "Lifetime accuracy", acc >= 0.72 ? "good" : acc >= 0.5 ? "warn" : "bad") +
        statCard(String(s.stats.totalAnswered), "Questions answered", "") +
        statCard("🔥 " + (s.stats.streakDays || 0), "Day streak", s.stats.streakDays ? "warn" : "") +
        statCard(Math.round(s.stats.studySeconds / 60) + "m", "Time studied", "") +
        statCard(countSeen() + "/" + BANK.length, "Bank covered", "") +
        statCard(lastMock ? lastMock.score + "%" : "—", "Last mock", lastMock ? (lastMock.score >= 72 ? "good" : "bad") : "") +
      '</div>' +

      '<div class="card fade-in">' +
        '<div class="section-title"><h2>Mastery by domain</h2><span class="faint">target ≥ 72%</span></div>' +
        domainMeters(a) +
      '</div>' +

      weakTopicsCard(a) +

      '<div class="card fade-in">' +
        '<div class="section-title"><h2>Jump in</h2></div>' +
        '<div class="grid-2">' +
          '<button class="btn block" data-jump="adaptive">🎯 Adaptive Quiz</button>' +
          '<button class="btn block" data-jump="mock">📝 Full Mock Exam</button>' +
          '<button class="btn block" data-jump="drill">🧩 Topic Drills</button>' +
          '<button class="btn block" data-jump="flash">⚡ Flashcards</button>' +
        '</div>' +
      '</div>';

    view.appendChild(el('<div>' + html + '</div>'));

    document.getElementById("dashStudy").onclick = function () { go("adaptive"); startQuiz(adaptiveConfig()); };
    var dueBtn = document.getElementById("dashDue");
    if (dueBtn) dueBtn.onclick = function () { go("adaptive"); startQuiz(adaptiveConfig()); };
    view.querySelectorAll("[data-jump]").forEach(function (b) {
      b.onclick = function () { go(b.dataset.jump); };
    });
  }

  function statCard(num, lbl, cls) {
    return '<div class="stat"><div class="num ' + (cls || "") + '">' + num + '</div><div class="lbl">' + lbl + '</div></div>';
  }

  function domainMeters(a) {
    return [1, 2, 3, 4].map(function (d) {
      var dm = a.byDomain[d] || { mastery: 0, coverage: 0, rawMastery: 0, total: 0, seen: 0 };
      var w = pct(SRS.DOMAIN_WEIGHTS[d]);
      return '' +
        '<div class="meter-row">' +
          '<div class="meter-head"><span class="name">' + DOMAIN_NAMES[d] + ' <span class="faint">· ' + w + '% of exam</span></span>' +
            '<span class="val">' + pct(dm.mastery) + '%</span></div>' +
          '<div class="bar ' + barClass(dm.mastery) + '"><span style="width:' + pct(dm.mastery) + '%"></span></div>' +
          '<div class="meter-sub">covered ' + (dm.seen || 0) + '/' + (dm.total || 0) +
            ' · accuracy on attempted ' + pct(dm.rawMastery) + '%</div>' +
        '</div>';
    }).join("");
  }

  function weakTopicsCard(a) {
    var topics = Object.keys(a.byTopic).map(function (k) { return a.byTopic[k]; });
    // Weakest = lowest mastery among topics with some content. Prioritise ones
    // you've attempted but are missing, then untouched ones.
    var weak = topics.slice().sort(function (x, y) { return x.mastery - y.mastery; }).slice(0, 6);
    if (!weak.length) return "";
    var rows = weak.map(function (t) {
      var label = t.seen === 0 ? "not started" : pct(t.mastery) + "% mastery";
      return '<button class="btn block sm" style="justify-content:space-between" data-topic="' + esc(t.topic) + '">' +
        '<span>' + esc(t.topic) + '</span><span class="tag">' + label + '</span></button>';
    }).join("");
    return '' +
      '<div class="card fade-in">' +
        '<div class="section-title"><h2>Focus areas</h2><span class="faint">your weakest topics</span></div>' +
        '<div style="display:flex;flex-direction:column;gap:8px">' + rows + '</div>' +
        '<div class="faint" style="margin-top:10px">Tap a topic to drill it directly.</div>' +
      '</div>';
  }

  // Delegate weak-topic clicks (rendered inside dashboard).
  view.addEventListener("click", function (e) {
    var t = e.target.closest("[data-topic]");
    if (t) { go("drill"); startQuiz(drillConfig(null, t.dataset.topic)); }
  });

  function countSeen() {
    return BANK.reduce(function (n, q) { var c = Store.getCard(q.id); return n + (c && c.seen ? 1 : 0); }, 0);
  }
  function countDue() {
    var t = Date.now();
    return BANK.reduce(function (n, q) {
      var c = Store.getCard(q.id);
      return n + (c && c.seen && c.nextDue && c.nextDue <= t ? 1 : 0);
    }, 0);
  }

  /* --------------------------- QUIZ ENGINE --------------------------- */
  /* Shared runner for adaptive, drill, and mock. Config:
   * { mode, title, questions, immediate, timed, onFinish } */

  var quiz = null;

  // Build a session, but if back-to-back sessions have exhausted the pool
  // (everything is in sessionSeen), forget recent history and try again so
  // the user is never blocked from continuing to study.
  function pickSession(opts) {
    var o = Object.assign({ recentlySeen: sessionSeen }, opts);
    var qs = SRS.buildSession(BANK, o);
    if (!qs.length && sessionSeen.size) {
      sessionSeen = new Set();
      o.recentlySeen = sessionSeen;
      qs = SRS.buildSession(BANK, o);
    }
    return qs;
  }

  function adaptiveConfig() {
    return { mode: "adaptive", title: "Adaptive Session", questions: pickSession({ count: 20 }), immediate: true };
  }
  function drillConfig(domain, topic) {
    var qs = pickSession({ count: 15, domainFilter: domain || null, topicFilter: topic || null });
    var title = topic ? "Drill · " + topic : domain ? "Drill · " + DOMAIN_NAMES[domain] : "Drill";
    return { mode: "drill", title: title, questions: qs, immediate: true };
  }
  function missedConfig() {
    return { mode: "drill", title: "Missed Questions", questions: pickSession({ count: 20, missedOnly: true }), immediate: true };
  }
  function mockConfig(total) {
    var qs = SRS.buildMock(BANK, total || 130);
    return { mode: "mock", title: "Mock Exam", questions: qs, immediate: false, timed: true };
  }

  function startQuiz(cfg) {
    if (!cfg.questions || !cfg.questions.length) {
      view.innerHTML = '<div class="card"><div class="empty">No questions available for this selection yet.<br><br>' +
        '<button class="btn primary" onclick="location.hash=\'dashboard\';location.reload()">Back to dashboard</button></div></div>';
      return;
    }
    quiz = {
      cfg: cfg,
      qs: cfg.questions,
      i: 0,
      answers: new Array(cfg.questions.length).fill(null), // chosen index per q
      answered: false,
      qStart: Date.now(),
      startTime: Date.now()
    };
    cfg.questions.forEach(function (q) { sessionSeen.add(q.id); });
    attachKeys();
    renderQuestion();
  }

  function renderQuestion() {
    var c = quiz.cfg, q = quiz.qs[quiz.i];
    quiz.answered = quiz.answers[quiz.i] != null && c.immediate;
    quiz.qStart = Date.now();

    var diffTxt = ["", "Easy", "Medium", "Hard"][q.difficulty] || "";
    var timerHtml = c.timed ? '<span class="pill" id="mockTimer">--:--</span>' : "";

    var head = '' +
      '<div class="quiz-top">' +
        '<div>' +
          '<span class="pill d' + q.domain + '">' + DOMAIN_NAMES[q.domain].split(" ")[0] + ' · D' + q.domain + '</span> ' +
          '<span class="quiz-progress">' + (quiz.i + 1) + ' / ' + quiz.qs.length + '</span>' +
        '</div>' +
        '<div>' + (diffTxt ? '<span class="pill">' + diffTxt + '</span> ' : "") + timerHtml +
          ' <button class="btn ghost sm" id="quitQuiz">Quit</button></div>' +
      '</div>' +
      '<div class="bar" style="margin-bottom:16px"><span style="width:' + ((quiz.i) / quiz.qs.length * 100) + '%"></span></div>';

    var choicesHtml = q.choices.map(function (ch, idx) {
      return '<button class="choice" data-idx="' + idx + '">' +
        '<span class="key">' + "ABCD"[idx] + '</span><span>' + esc(ch) + '</span></button>';
    }).join("");

    var card = el('<div class="card fade-in">' + head +
      '<div class="q-text">' + esc(q.question) + '</div>' +
      '<div class="choices" id="choices">' + choicesHtml + '</div>' +
      '<div id="explainSlot"></div>' +
      '<div class="quiz-actions" id="actions"></div>' +
      '<div class="kbd-hint">Keys: <span class="kbd">1</span>–<span class="kbd">4</span> answer · <span class="kbd">Enter</span> next</div>' +
      '</div>');

    view.innerHTML = "";
    view.appendChild(card);

    document.getElementById("quitQuiz").onclick = confirmQuit;
    document.getElementById("choices").addEventListener("click", function (e) {
      var b = e.target.closest(".choice");
      if (b) choose(parseInt(b.dataset.idx, 10));
    });

    // Restore prior selection (e.g. navigating back in a mock).
    if (quiz.answers[quiz.i] != null) {
      if (c.immediate) lockAndReveal(quiz.answers[quiz.i]);
      else markSelected(quiz.answers[quiz.i]);
    }
    renderActions();
    if (c.timed) startMockTimer();
  }

  function choose(idx) {
    var c = quiz.cfg;
    if (c.immediate) {
      if (quiz.answered) return;
      quiz.answers[quiz.i] = idx;
      quiz.answered = true;
      var q = quiz.qs[quiz.i];
      var correct = idx === q.answer;
      var secs = (Date.now() - quiz.qStart) / 1000;
      SRS.grade(q.id, correct, Date.now() - quiz.qStart);
      recordAnswer(correct, secs);
      lockAndReveal(idx);
      updateReadinessChip();
    } else {
      // Mock: just record selection, allow changes, no reveal.
      quiz.answers[quiz.i] = idx;
      markSelected(idx);
    }
    renderActions();
  }

  function markSelected(idx) {
    view.querySelectorAll(".choice").forEach(function (b, i) {
      b.classList.toggle("correct", false);
      b.style.borderColor = i === idx ? "var(--accent)" : "";
      b.style.background = i === idx ? "var(--card)" : "";
    });
  }

  function lockAndReveal(chosen) {
    var q = quiz.qs[quiz.i];
    var correct = chosen === q.answer;
    view.querySelectorAll(".choice").forEach(function (b, i) {
      b.classList.add("locked");
      if (i === q.answer) b.classList.add("correct");
      else if (i === chosen) b.classList.add("wrong");
      else b.classList.add("dim");
    });
    var slot = document.getElementById("explainSlot");
    slot.innerHTML = '<div class="explain ' + (correct ? "ok" : "no") + '">' +
      '<div class="verdict">' + (correct ? "✓ Correct" : "✗ Incorrect") + '</div>' +
      '<div>' + esc(q.explanation) + '</div>' +
      '<div class="topic-tag">' + esc(q.topic) + ' · ' + DOMAIN_NAMES[q.domain] + '</div>' +
      '</div>';
  }

  function renderActions() {
    var c = quiz.cfg, a = document.getElementById("actions");
    if (!a) return;
    var last = quiz.i === quiz.qs.length - 1;
    var canAdvance = c.immediate ? quiz.answered : true;
    var prevBtn = (!c.immediate && quiz.i > 0) ?
      '<button class="btn ghost" id="prevBtn">← Prev</button>' : '';
    var nextLabel = last ? (c.mode === "mock" ? "Submit Exam ▸" : "See Results ▸") : "Next →";
    a.innerHTML = prevBtn +
      '<button class="btn primary" id="nextBtn"' + (canAdvance ? "" : " disabled") + '>' + nextLabel + '</button>';
    var nb = document.getElementById("nextBtn");
    if (nb) nb.onclick = advance;
    var pb = document.getElementById("prevBtn");
    if (pb) pb.onclick = function () { quiz.i--; renderQuestion(); };
  }

  function advance() {
    var c = quiz.cfg;
    if (c.immediate && !quiz.answered) return;
    if (quiz.i === quiz.qs.length - 1) return finishQuiz();
    quiz.i++;
    renderQuestion();
  }

  function confirmQuit() {
    if (quiz && quiz.cfg.mode === "mock") {
      if (!confirm("Quit the mock exam? Your progress on this attempt won't be scored.")) return;
    }
    stopMockTimer();
    detachKeys();
    quiz = null;
    go("dashboard");
  }

  function finishQuiz() {
    stopMockTimer();
    detachKeys();
    var c = quiz.cfg;
    if (c.mode === "mock") return finishMock();
    // Adaptive / drill summary.
    var total = quiz.qs.length;
    var correct = 0;
    quiz.qs.forEach(function (q, i) { if (quiz.answers[i] === q.answer) correct++; });
    var score = total ? Math.round(correct / total * 100) : 0;
    renderSessionSummary(correct, total, score);
  }

  function renderSessionSummary(correct, total, score) {
    var a = SRS.analyze(BANK);
    var html = '<div class="card fade-in">' +
      '<div class="result-hero">' +
        '<div class="big ' + (score >= 72 ? "pass" : "fail") + '">' + score + '%</div>' +
        '<div class="verdict">' + correct + ' of ' + total + ' correct this session</div>' +
        '<div class="subtle" style="margin-top:8px">Overall readiness is now <b>' + pct(a.readiness) + '%</b>. Missed items will resurface soon; mastered ones are scheduled further out.</div>' +
      '</div>' +
      '<div class="btn-row" style="justify-content:center;margin-top:20px">' +
        '<button class="btn primary" id="again">Another session</button>' +
        '<button class="btn" id="toDash">Dashboard</button>' +
      '</div></div>';
    view.innerHTML = "";
    view.appendChild(el(html));
    document.getElementById("again").onclick = function () {
      var cfg = quiz.cfg.mode === "drill" ? quiz.cfg : adaptiveConfig();
      if (cfg.mode === "drill") { // rebuild fresh for same filter
        cfg = drillFromCfg(quiz.cfg);
      }
      startQuiz(cfg);
    };
    document.getElementById("toDash").onclick = function () { quiz = null; go("dashboard"); };
  }

  function drillFromCfg(prev) {
    // Recreate a drill session for the same scope as before.
    var q0 = prev.questions[0];
    if (prev.title.indexOf("Missed") >= 0) return missedConfig();
    if (prev.title.indexOf("·") >= 0) {
      var topic = q0 ? q0.topic : null;
      return drillConfig(null, topic);
    }
    return adaptiveConfig();
  }

  /* ----------------------------- MOCK ----------------------------- */

  var mockTick = null;
  function startMockTimer() {
    stopMockTimer();
    mockTick = setInterval(function () {
      var elp = Math.floor((Date.now() - quiz.startTime) / 1000);
      var t = document.getElementById("mockTimer");
      if (t) {
        var m = Math.floor(elp / 60), s = elp % 60;
        t.textContent = "⏱ " + m + ":" + (s < 10 ? "0" : "") + s;
      }
    }, 1000);
  }
  function stopMockTimer() { if (mockTick) { clearInterval(mockTick); mockTick = null; } }

  function finishMock() {
    var qs = quiz.qs, total = qs.length;
    var correct = 0;
    var byDomain = { 1: { c: 0, t: 0 }, 2: { c: 0, t: 0 }, 3: { c: 0, t: 0 }, 4: { c: 0, t: 0 } };
    qs.forEach(function (q, i) {
      var chosen = quiz.answers[i];
      var ok = chosen === q.answer;
      // Feed every mock answer into the SRS so it informs adaptive scheduling.
      // Unanswered questions count as incorrect.
      SRS.grade(q.id, ok, 0);
      recordAnswer(ok, 0);
      if (ok) correct++;
      byDomain[q.domain].t++;
      if (ok) byDomain[q.domain].c++;
    });
    var score = Math.round(correct / total * 100);
    var durationSec = Math.round((Date.now() - quiz.startTime) / 1000);
    var pass = score >= 72;

    var s = Store.load();
    s.mocks.push({
      date: new Date().toISOString(),
      score: score, correct: correct, total: total,
      durationSec: durationSec,
      byDomain: {
        1: dpct(byDomain[1]), 2: dpct(byDomain[2]),
        3: dpct(byDomain[3]), 4: dpct(byDomain[4])
      }
    });
    Store.saveNow();
    updateReadinessChip();

    var domRows = [1, 2, 3, 4].map(function (d) {
      var b = byDomain[d], p = b.t ? Math.round(b.c / b.t * 100) : 0;
      return '<div class="meter-row"><div class="meter-head"><span class="name">' + DOMAIN_NAMES[d] +
        '</span><span class="val">' + b.c + '/' + b.t + ' · ' + p + '%</span></div>' +
        '<div class="bar ' + barClass(p / 100) + '"><span style="width:' + p + '%"></span></div></div>';
    }).join("");

    var mm = Math.floor(durationSec / 60), ss = durationSec % 60;
    var html = '<div class="card fade-in">' +
      '<div class="result-hero">' +
        '<div class="big ' + (pass ? "pass" : "fail") + '">' + score + '%</div>' +
        '<div class="verdict" style="color:var(--' + (pass ? "good" : "bad") + ')">' +
          (pass ? "✓ PASS — above the 72% line" : "✗ Below the 72% pass line") + '</div>' +
        '<div class="subtle" style="margin-top:6px">' + correct + ' / ' + total + ' correct · ' +
          mm + 'm ' + ss + 's · need ' + Math.ceil(total * 0.72) + ' to pass</div>' +
      '</div></div>' +
      '<div class="card fade-in"><div class="section-title"><h2>Breakdown by domain</h2></div>' + domRows + '</div>' +
      '<div class="card fade-in"><div class="section-title"><h2>Review your answers</h2><span class="faint">missed first</span></div>' +
        mockReviewList() + '</div>' +
      '<div class="btn-row" style="justify-content:center"><button class="btn primary" id="newMock">New mock exam</button>' +
        '<button class="btn" id="mockDash">Dashboard</button></div>';

    view.innerHTML = "";
    view.appendChild(el('<div>' + html + '</div>'));
    document.getElementById("newMock").onclick = function () { go("mock"); };
    document.getElementById("mockDash").onclick = function () { quiz = null; go("dashboard"); };
  }
  function dpct(b) { return b.t ? Math.round(b.c / b.t * 100) : 0; }

  function mockReviewList() {
    var items = quiz.qs.map(function (q, i) {
      return { q: q, chosen: quiz.answers[i], ok: quiz.answers[i] === q.answer };
    }).sort(function (a, b) { return (a.ok ? 1 : 0) - (b.ok ? 1 : 0); });
    return items.map(function (it, n) {
      var q = it.q;
      var chosenTxt = it.chosen == null ? "(no answer)" : "ABCD"[it.chosen] + ". " + q.choices[it.chosen];
      return '<details class="list-row" style="display:block">' +
        '<summary style="cursor:pointer;display:flex;justify-content:space-between;gap:10px">' +
          '<span>' + (it.ok ? "✓" : "✗") + " " + esc(q.question.slice(0, 90)) + (q.question.length > 90 ? "…" : "") + '</span>' +
          '<span class="tag">' + esc(q.topic) + '</span></summary>' +
        '<div style="padding:10px 0 4px;font-size:13.5px">' +
          '<div style="color:var(--' + (it.ok ? "good" : "bad") + ')">Your answer: ' + esc(chosenTxt) + '</div>' +
          (it.ok ? "" : '<div style="color:var(--good)">Correct: ' + "ABCD"[q.answer] + ". " + esc(q.choices[q.answer]) + '</div>') +
          '<div class="subtle" style="margin-top:6px">' + esc(q.explanation) + '</div></div>' +
        '</details>';
    }).join("");
  }

  /* ------------------------- START SCREENS ------------------------- */

  function renderAdaptiveStart() {
    var due = countDue(), unseen = BANK.length - countSeen();
    var html = '<div class="card fade-in">' +
      '<div class="section-title"><h2>Adaptive Quiz</h2></div>' +
      '<p class="subtle">The engine picks 20 questions tuned to you: items <b>due for review</b>, your <b>weakest topics</b>, and <b>uncovered material</b> — mixed to mirror the real exam\'s domain weights. Each answer reschedules that question (Leitner spaced repetition), so you spend time where it moves your score most.</p>' +
      '<div class="grid-3" style="margin:14px 0">' +
        statCard(String(due), "Due for review", due ? "warn" : "") +
        statCard(String(unseen), "Not yet seen", "") +
        statCard(pct(SRS.analyze(BANK).readiness) + "%", "Readiness", "") +
      '</div>' +
      '<button class="btn primary block" id="startAdaptive">▶ Start 20-question session</button>' +
      '</div>';
    view.appendChild(el(html));
    document.getElementById("startAdaptive").onclick = function () { startQuiz(adaptiveConfig()); };
  }

  function renderDrillStart() {
    var topicsByDomain = {};
    BANK.forEach(function (q) {
      (topicsByDomain[q.domain] = topicsByDomain[q.domain] || {})[q.topic] = true;
    });
    var domOpts = [1, 2, 3, 4].map(function (d) {
      return '<option value="' + d + '">' + DOMAIN_NAMES[d] + '</option>';
    }).join("");

    var html = '<div class="card fade-in">' +
      '<div class="section-title"><h2>Topic Drills</h2></div>' +
      '<p class="subtle">Target a specific domain or topic. Within your selection the adaptive picker still surfaces your weakest, most due items first.</p>' +
      '<label class="field"><span>Domain</span><select id="drillDomain"><option value="">All domains</option>' + domOpts + '</select></label>' +
      '<label class="field"><span>Topic</span><select id="drillTopic"><option value="">All topics in domain</option></select></label>' +
      '<button class="btn primary block" id="startDrill">▶ Start 15-question drill</button>' +
      '<div style="margin-top:14px"><button class="btn block ghost" id="startMissed">🔁 Drill only questions I\'ve missed</button></div>' +
      '</div>';
    view.appendChild(el(html));

    var domSel = document.getElementById("drillDomain");
    var topSel = document.getElementById("drillTopic");
    function refreshTopics() {
      var d = domSel.value;
      var topics = {};
      BANK.forEach(function (q) { if (!d || String(q.domain) === d) topics[q.topic] = true; });
      topSel.innerHTML = '<option value="">All topics' + (d ? " in domain" : "") + '</option>' +
        Object.keys(topics).sort().map(function (t) { return '<option value="' + esc(t) + '">' + esc(t) + '</option>'; }).join("");
    }
    domSel.onchange = refreshTopics;
    refreshTopics();
    document.getElementById("startDrill").onclick = function () {
      startQuiz(drillConfig(domSel.value ? parseInt(domSel.value, 10) : null, topSel.value || null));
    };
    document.getElementById("startMissed").onclick = function () { startQuiz(missedConfig()); };
  }

  function renderMockStart() {
    var s = Store.load();
    var mocks = s.mocks.slice().reverse();
    var histHtml = mocks.length ? mocks.map(function (m) {
      return '<div class="list-row"><span>' + new Date(m.date).toLocaleDateString() + ' ' +
        new Date(m.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + '</span>' +
        '<span class="' + (m.score >= 72 ? "" : "") + '" style="color:var(--' + (m.score >= 72 ? "good" : "bad") + ');font-weight:700">' +
        m.score + '%</span></div>';
    }).join("") : '<div class="empty">No mock exams yet.</div>';

    var html = '<div class="card fade-in">' +
      '<div class="section-title"><h2>Mock Exam</h2></div>' +
      '<p class="subtle">A full-length, exam-weighted simulation — no feedback until the end, just like test day. The real Series&nbsp;65 is <b>130 scored questions in 180 minutes; 72% to pass</b>. Answers still feed your adaptive schedule.</p>' +
      '<label class="field"><span>Exam length</span><select id="mockLen">' +
        '<option value="130">Full length — 130 questions</option>' +
        '<option value="65">Half length — 65 questions</option>' +
        '<option value="30">Quick check — 30 questions</option>' +
      '</select></label>' +
      '<button class="btn primary block" id="startMock">▶ Begin mock exam</button>' +
      '<div class="faint" style="margin-top:8px">Tip: simulate test conditions — no notes, one sitting.</div>' +
      '</div>' +
      '<div class="card fade-in"><div class="section-title"><h2>Past attempts</h2></div>' + histHtml + '</div>';
    view.appendChild(el('<div>' + html + '</div>'));
    document.getElementById("startMock").onclick = function () {
      var len = parseInt(document.getElementById("mockLen").value, 10);
      startQuiz(mockConfig(len));
    };
  }

  /* --------------------------- FLASHCARDS --------------------------- */

  var flash = null;
  function renderFlashStart() {
    var html = '<div class="card fade-in">' +
      '<div class="section-title"><h2>Flashcards</h2></div>' +
      '<p class="subtle">Rapid recall: read the prompt, flip for the answer + why, then rate yourself. Honest self-grading feeds the same spaced-repetition schedule as the quizzes.</p>' +
      '<button class="btn primary block" id="startFlash">▶ Start flashcards (weak items first)</button>' +
      '</div>';
    view.appendChild(el(html));
    document.getElementById("startFlash").onclick = function () {
      var qs = pickSession({ count: 25 });
      qs.forEach(function (q) { sessionSeen.add(q.id); });
      flash = { qs: qs, i: 0, flipped: false, start: Date.now() };
      attachKeys();
      renderFlash();
    };
  }

  function renderFlash() {
    if (flash.i >= flash.qs.length) {
      detachKeys();
      view.innerHTML = '<div class="card fade-in"><div class="result-hero"><div class="big pass">✓</div>' +
        '<div class="verdict">Flashcard set complete</div>' +
        '<div class="subtle" style="margin-top:6px">Readiness now ' + pct(SRS.analyze(BANK).readiness) + '%.</div></div>' +
        '<div class="btn-row" style="justify-content:center;margin-top:18px">' +
        '<button class="btn primary" id="fAgain">Another set</button><button class="btn" id="fDash">Dashboard</button></div></div>';
      document.getElementById("fAgain").onclick = function () { go("flash"); document.getElementById("startFlash").click(); };
      document.getElementById("fDash").onclick = function () { go("dashboard"); };
      return;
    }
    var q = flash.qs[flash.i];
    var correctTxt = "ABCD"[q.answer] + ". " + q.choices[q.answer];
    var back = flash.flipped ? '<div class="back"><div class="ans">' + esc(correctTxt) + '</div>' +
      '<div style="margin-top:8px">' + esc(q.explanation) + '</div></div>' : '';
    var ratingBtns = flash.flipped ?
      '<div class="btn-row" style="margin-top:16px"><button class="btn danger block" id="fHard">✗ Missed it</button>' +
      '<button class="btn block" style="border-color:var(--good-dim);color:var(--good)" id="fEasy">✓ Knew it</button></div>'
      : '<div class="flash-hint">Tap the card or press <span class="kbd">Space</span> to flip</div>';

    var html = '<div class="card fade-in">' +
      '<div class="quiz-top"><span class="pill d' + q.domain + '">D' + q.domain + ' · ' + esc(q.topic) + '</span>' +
        '<span class="quiz-progress">' + (flash.i + 1) + ' / ' + flash.qs.length + '</span></div>' +
      '<div class="card flash" id="flashCard" style="margin:0"><div class="front">' + esc(q.question) + '</div>' + back + '</div>' +
      ratingBtns +
      '<div class="quiz-actions"><button class="btn ghost sm" id="flashQuit">Quit</button></div></div>';
    view.innerHTML = "";
    view.appendChild(el(html));

    document.getElementById("flashCard").onclick = function () {
      if (!flash.flipped) { flash.flipped = true; renderFlash(); }
    };
    document.getElementById("flashQuit").onclick = function () { detachKeys(); go("dashboard"); };
    if (flash.flipped) {
      document.getElementById("fHard").onclick = function () { gradeFlash(false); };
      document.getElementById("fEasy").onclick = function () { gradeFlash(true); };
    }
  }

  function gradeFlash(correct) {
    var q = flash.qs[flash.i];
    SRS.grade(q.id, correct, 0);
    recordAnswer(correct, 0);
    flash.i++;
    flash.flipped = false;
    updateReadinessChip();
    renderFlash();
  }

  /* ----------------------------- NOTES ----------------------------- */

  function renderNotes() {
    if (!NOTES.length) { view.innerHTML = '<div class="card"><div class="empty">No notes available.</div></div>'; return; }
    var html = NOTES.map(function (dom) {
      var secs = dom.sections.map(function (sec) {
        return '<div class="note-section"><h4>' + esc(sec.h) + '</h4><ul>' +
          sec.points.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join("") + '</ul></div>';
      }).join("");
      return '<div class="card fade-in"><div class="note-domain-head">' +
        '<h2 style="margin:0">' + esc(dom.name) + '</h2><span class="w">' + esc(dom.weight) + ' of exam</span></div>' +
        secs + '</div>';
    }).join("");
    view.appendChild(el('<div><div class="section-title"><h2>Cheat Sheets</h2><span class="faint">high-yield, by domain</span></div>' + html + '</div>'));
  }

  /* ---------------------------- PROGRESS ---------------------------- */

  function renderProgress() {
    var a = SRS.analyze(BANK);
    var s = Store.load();

    // All topics sorted weakest-first.
    var topics = Object.keys(a.byTopic).map(function (k) { return a.byTopic[k]; })
      .sort(function (x, y) { if (x.domain !== y.domain) return x.domain - y.domain; return x.mastery - y.mastery; });

    var topicRows = topics.map(function (t) {
      var label = t.seen === 0 ? "not started" : pct(t.mastery) + "%";
      return '<div class="meter-row"><div class="meter-head"><span class="name">' +
        '<span class="pill d' + t.domain + '" style="margin-right:6px">D' + t.domain + '</span>' + esc(t.topic) + '</span>' +
        '<span class="val">' + label + ' · ' + t.seen + '/' + t.total + '</span></div>' +
        '<div class="bar ' + barClass(t.mastery) + '"><span style="width:' + pct(t.mastery) + '%"></span></div></div>';
    }).join("");

    var mocks = s.mocks.slice().reverse();
    var mockHtml = mocks.length ? mocks.map(function (m) {
      return '<div class="list-row"><span>' + new Date(m.date).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) + '</span>' +
        '<span style="color:var(--' + (m.score >= 72 ? "good" : "bad") + ');font-weight:700">' + m.score + '% (' + m.correct + '/' + m.total + ')</span></div>';
    }).join("") : '<div class="empty">No mock exams logged yet.</div>';

    var v = verdictFor(a.readiness);
    var html = '<div class="card fade-in">' +
      '<div class="section-title"><h2>Predicted readiness</h2></div>' +
      '<div class="meter-head"><span class="name" style="color:var(--' + v.cls + ')">' + v.txt + '</span><span class="val">' + pct(a.readiness) + '% vs 72% pass line</span></div>' +
      '<div class="bar ' + barClass(a.readiness) + '"><span style="width:' + pct(a.readiness) + '%"></span></div>' +
      '<div style="position:relative;height:0"><div style="position:absolute;left:72%;top:-13px;width:2px;height:13px;background:var(--text)"></div></div>' +
      '<div class="faint" style="margin-top:8px">The marker shows the 72% pass threshold.</div>' +
      '</div>' +
      '<div class="card fade-in"><div class="section-title"><h2>Mastery by domain</h2></div>' + domainMeters(a) + '</div>' +
      '<div class="card fade-in"><div class="section-title"><h2>Every topic</h2><span class="faint">weakest first</span></div>' + topicRows + '</div>' +
      '<div class="card fade-in"><div class="section-title"><h2>Mock exam history</h2></div>' + mockHtml + '</div>';
    view.appendChild(el('<div>' + html + '</div>'));
  }

  /* ---------------------------- SETTINGS ---------------------------- */

  function renderSettings() {
    var s = Store.load();
    var html = '<div class="card fade-in">' +
      '<div class="section-title"><h2>Study plan</h2></div>' +
      '<label class="field"><span>Target exam date (optional)</span><input type="date" id="examDate" value="' + (s.settings.examDate || "") + '"></label>' +
      '<label class="field"><span>Daily question goal</span><input type="number" min="5" max="200" id="dailyGoal" value="' + (s.settings.dailyGoal || 30) + '"></label>' +
      '<button class="btn primary" id="saveSettings">Save</button>' +
      '</div>' +

      '<div class="card fade-in">' +
      '<div class="section-title"><h2>Cross-device sync &amp; backup</h2></div>' +
      '<p class="subtle">Your progress is stored locally in this browser. Export a backup file, then import it on another device — progress merges intelligently (your best record per question is kept).</p>' +
      '<div class="btn-row"><button class="btn" id="exportBtn">⬇ Export backup</button>' +
      '<button class="btn" id="importBtn">⬆ Import backup</button>' +
      '<input type="file" id="importFile" accept="application/json,.json" style="display:none"></div>' +
      (s.sync.lastBackup ? '<div class="faint" style="margin-top:8px">Last export: ' + new Date(s.sync.lastBackup).toLocaleString() + '</div>' : '') +
      '</div>' +

      '<div class="card fade-in">' +
      '<div class="section-title"><h2>About this app</h2></div>' +
      '<p class="subtle">' + BANK.length + ' practice questions across the 4 official Series&nbsp;65 domains, with explanations. Adaptive engine = Leitner spaced repetition + weak-area weighting + exam-weighted readiness prediction. 100% offline; no account, no tracking.</p>' +
      '<button class="btn danger" id="resetBtn">Reset all progress</button>' +
      '</div>';
    view.appendChild(el('<div>' + html + '</div>'));

    document.getElementById("saveSettings").onclick = function () {
      s.settings.examDate = document.getElementById("examDate").value || null;
      s.settings.dailyGoal = parseInt(document.getElementById("dailyGoal").value, 10) || 30;
      Store.saveNow();
      toast("Settings saved");
    };
    document.getElementById("exportBtn").onclick = function () {
      var data = Store.exportJSON();
      var blob = new Blob([data], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "series65-backup-" + todayStr() + ".json";
      a.click();
      URL.revokeObjectURL(url);
      toast("Backup downloaded");
    };
    document.getElementById("importBtn").onclick = function () { document.getElementById("importFile").click(); };
    document.getElementById("importFile").onchange = function (e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try { Store.importJSON(reader.result); toast("Backup imported & merged"); updateReadinessChip(); go("dashboard"); }
        catch (err) { toast("Import failed: " + err.message); }
      };
      reader.readAsText(file);
    };
    document.getElementById("resetBtn").onclick = function () {
      if (confirm("Erase ALL progress, stats, and mock history? This cannot be undone.")) {
        Store.resetAll(); sessionSeen = new Set(); toast("Progress reset"); updateReadinessChip(); go("dashboard");
      }
    };
  }

  /* -------------------------- KEYBOARD -------------------------- */

  function keyHandler(e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA") return;
    // Quiz keys
    if (quiz && view.querySelector(".choices")) {
      if (e.key >= "1" && e.key <= "4") {
        var idx = parseInt(e.key, 10) - 1;
        var btn = view.querySelectorAll(".choice")[idx];
        if (btn) { e.preventDefault(); choose(idx); }
        return;
      }
      if (e.key === "Enter" || (e.key === " " && quiz.cfg.immediate && quiz.answered)) {
        var nb = document.getElementById("nextBtn");
        if (nb && !nb.disabled) { e.preventDefault(); advance(); }
        return;
      }
    }
    // Flashcard keys
    if (flash && view.querySelector("#flashCard")) {
      if (e.key === " " || e.key === "Enter") {
        if (!flash.flipped) { e.preventDefault(); flash.flipped = true; renderFlash(); }
        return;
      }
      if (flash.flipped && (e.key === "1" || e.key.toLowerCase() === "j")) { e.preventDefault(); gradeFlash(false); }
      if (flash.flipped && (e.key === "2" || e.key.toLowerCase() === "k")) { e.preventDefault(); gradeFlash(true); }
    }
  }
  function attachKeys() { document.addEventListener("keydown", keyHandler); }
  function detachKeys() { document.removeEventListener("keydown", keyHandler); flash = null; }

  /* ----------------------------- boot ----------------------------- */

  function boot() {
    if (!BANK.length) {
      view.innerHTML = '<div class="card"><div class="empty">Question bank failed to load.</div></div>';
      return;
    }
    Store.load();
    var start = (location.hash || "").replace("#", "");
    go(VIEWS[start] ? start : "dashboard");
  }

  window.addEventListener("hashchange", function () {
    var name = (location.hash || "").replace("#", "");
    if (VIEWS[name] && !quiz && !flash) go(name);
  });

  boot();
})();
