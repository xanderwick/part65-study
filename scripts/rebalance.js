/* rebalance.js — one-shot maintenance script.
 * Shuffles each question's choices so the correct-answer position is evenly
 * distributed across A/B/C/D (the generated bank was heavily skewed to B).
 * Re-run safe: it re-randomizes positions each time. Run: node scripts/rebalance.js
 */
const fs = require("fs");
const path = require("path");

const FILES = [
  { file: "data/q-domain1.js", header: "// Domain 1 — Economic Factors and Business Information" },
  { file: "data/q-domain2.js", header: "// Domain 2 — Investment Vehicle Characteristics" },
  { file: "data/q-domain3.js", header: "// Domain 3 — Client Investment Recommendations and Strategies" },
  { file: "data/q-domain4.js", header: "// Domain 4 — Laws, Regulations, and Guidelines (incl. Unethical Business Practices)" }
];

function loadOne(file) {
  const g = { window: {} };
  const code = fs.readFileSync(path.resolve(file), "utf8");
  new Function("window", code)(g.window);
  return g.window.QUESTION_BANK;
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Balanced target-position generator: cycles through shuffled [0,1,2,3].
function makeTargets(n) {
  const out = [];
  while (out.length < n) shuffle([0, 1, 2, 3]).forEach((p) => out.push(p));
  return out.slice(0, n);
}

function serialize(q) {
  const f = (v) => JSON.stringify(v);
  const choices = q.choices.map((c) => "      " + f(c)).join(",\n");
  return [
    "  {",
    "    id: " + f(q.id) + ",",
    "    domain: " + q.domain + ",",
    "    domainName: " + f(q.domainName) + ",",
    "    topic: " + f(q.topic) + ",",
    "    difficulty: " + q.difficulty + ",",
    "    question: " + f(q.question) + ",",
    "    choices: [\n" + choices + "\n    ],",
    "    answer: " + q.answer + ",",
    "    explanation: " + f(q.explanation),
    "  }"
  ].join("\n");
}

let grand = { 0: 0, 1: 0, 2: 0, 3: 0 };

FILES.forEach(({ file, header }) => {
  const bank = loadOne(file);
  const targets = makeTargets(bank.length);
  bank.forEach((q, i) => {
    const correctText = q.choices[q.answer];
    const distractors = q.choices.filter((_, idx) => idx !== q.answer);
    shuffle(distractors);
    const target = targets[i];
    const newChoices = [];
    let di = 0;
    for (let p = 0; p < 4; p++) {
      newChoices[p] = p === target ? correctText : distractors[di++];
    }
    q.choices = newChoices;
    q.answer = target;
    grand[target]++;
  });
  const body = bank.map(serialize).join(",\n");
  const out = header + "\nwindow.QUESTION_BANK = (window.QUESTION_BANK || []).concat([\n" + body + "\n]);\n";
  fs.writeFileSync(path.resolve(file), out, "utf8");
  console.log("rewrote", file, "(" + bank.length + " questions)");
});

console.log("new global answer distribution:", JSON.stringify(grand));
