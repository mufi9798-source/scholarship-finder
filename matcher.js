// Pure matching logic: no DOM, runs in the browser and in Node (for tests).
(function (root) {
  const LEVEL_LABEL = { school: "Class 11–12", diploma: "Diploma", ug: "Undergraduate", pg: "Postgraduate", phd: "PhD" };
  const FIELD_LABEL = { tech: "Engineering / Technology", medical: "Medical / Health", science: "Pure sciences", other: "Arts / Commerce / Other" };

  function list(a, labels) { return a.map((x) => (labels && labels[x]) || x).join(", "); }

  // Returns an array of checks: { key, ok, label } describing each rule vs. the profile.
  function checks(s, p) {
    const r = s.rules, out = [];
    if (r.levels) out.push({ key: "level", ok: r.levels.includes(p.level), label: "Level of study: " + list(r.levels, LEVEL_LABEL) });
    if (r.fields) out.push({ key: "field", ok: r.fields.includes(p.field), label: "Field: " + list(r.fields, FIELD_LABEL) });
    if (r.gender === "female") out.push({ key: "gender", ok: p.gender === "female", label: "Open to female students" });
    if (r.categories) out.push({ key: "category", ok: r.categories.includes(p.category), label: "Category: " + r.categories.join(", ") });
    if (r.minority) out.push({ key: "minority", ok: !!p.minority, label: "Notified minority community" });
    if (r.disability) out.push({ key: "disability", ok: !!p.disability, label: "Disability of 40% or more" });
    if (r.maxIncome != null) out.push({ key: "income", ok: p.income <= r.maxIncome, label: "Family income up to ₹" + r.maxIncome + " lakh/yr" });
    if (r.minMarks != null) out.push({ key: "marks", ok: p.marks >= r.minMarks, label: "Marks of " + r.minMarks + "% or more" });
    return out;
  }

  function match(scholarships, p) {
    const eligible = [], almost = [];
    for (const s of scholarships) {
      const c = checks(s, p);
      const failed = c.filter((x) => !x.ok);
      const item = { s, checks: c, failed };
      if (failed.length === 0) eligible.push(item);
      else if (failed.length === 1 && failed[0].key !== "level") almost.push(item);
    }
    const byAmount = (a, b) => b.s.amountValue - a.s.amountValue;
    eligible.sort(byAmount);
    almost.sort(byAmount);
    return { eligible, almost };
  }

  // Minimal iCalendar file for an all-day deadline reminder (7 days and 1 day before).
  function ics(name, dateISO, link) {
    const d = dateISO.replace(/-/g, "");
    const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const esc = (t) => String(t).replace(/([,;\\])/g, "\\$1");
    return [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Scholarship Finder//EN", "BEGIN:VEVENT",
      "UID:" + d + "-" + Math.abs(hash(name)) + "@scholarship-finder",
      "DTSTAMP:" + stamp, "DTSTART;VALUE=DATE:" + d,
      "SUMMARY:" + esc("Deadline: " + name), "DESCRIPTION:" + esc("Apply at " + link),
      "BEGIN:VALARM", "TRIGGER:-P7D", "ACTION:DISPLAY", "DESCRIPTION:Scholarship deadline in 7 days", "END:VALARM",
      "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:Scholarship deadline tomorrow", "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
  }
  function hash(s) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return h; }

  const api = { checks, match, ics, LEVEL_LABEL, FIELD_LABEL };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Matcher = api;
})(typeof window !== "undefined" ? window : globalThis);
