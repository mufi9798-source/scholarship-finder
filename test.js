// Run: node test.js
const assert = require("assert");
global.window = {};
require("./data.js");
const M = require("./matcher.js");
const S = window.SCHOLARSHIPS;
const ids = (r) => r.eligible.map((x) => x.s.id);
const base = { level: "ug", field: "tech", gender: "male", category: "General", income: 3, marks: 75, minority: false, disability: false };

// Unique ids, sane data
assert.strictEqual(new Set(S.map((s) => s.id)).size, S.length);
S.forEach((s) => assert(s.name && s.link.startsWith("https://") && s.amountValue > 0));

// Male General UG tech, 3 lakh, 75%: only income/marks-based general schemes
let r = M.match(S, base);
assert(ids(r).includes("reliance-ug") && ids(r).includes("ongc") && !ids(r).includes("hdfc-ecss"));
assert(r.almost.some((x) => x.s.id === "hdfc-ecss" && x.failed[0].key === "income"));
assert(!ids(r).includes("aicte-pragati") && !ids(r).includes("pms-sc"));

// Girl in tech, income 6 lakh -> Pragati fails on income only (8 lakh limit passes) => eligible
r = M.match(S, { ...base, gender: "female", income: 6 });
assert(ids(r).includes("aicte-pragati") && ids(r).includes("kotak-kanya"));

// Income too high for Pragati: should appear in "almost"
r = M.match(S, { ...base, gender: "female", income: 9 });
assert(!ids(r).includes("aicte-pragati"));
assert(r.almost.some((x) => x.s.id === "aicte-pragati" && x.failed[0].key === "income"));

// SC student
r = M.match(S, { ...base, category: "SC", income: 2 });
assert(ids(r).includes("pms-sc") && !ids(r).includes("pms-st"));

// Wrong level is never a "near miss"
r = M.match(S, { ...base, level: "phd" });
assert(!r.almost.some((x) => x.failed[0].key === "level"));

// Sorted by amount desc
r = M.match(S, { ...base, income: 2, marks: 90 });
const v = r.eligible.map((x) => x.s.amountValue);
assert.deepStrictEqual(v, [...v].sort((a, b) => b - a));

// ICS output is well-formed and escapes special chars
const ics = M.ics("A, B", "2026-12-15", "https://x.test");
assert(ics.includes("DTSTART;VALUE=DATE:20261215") && ics.includes("SUMMARY:Deadline: A\\, B") && ics.startsWith("BEGIN:VCALENDAR"));
console.log("all tests passed");
