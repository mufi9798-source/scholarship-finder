(function () {
  const $ = (id) => document.getElementById(id);
  const form = $("profile");
  const KEY = "sf.saved.v1", PKEY = "sf.profile.v1";

  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked: ignore */ } };

  let saved = load(KEY, {}); // id -> { date: "YYYY-MM-DD" | "" }

  function el(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === "class") n.className = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v);
    }
    for (const kid of kids) n.append(kid && kid.nodeType ? kid : document.createTextNode(kid ?? ""));
    return n;
  }

  function readProfile() {
    const f = new FormData(form);
    return {
      level: f.get("level"), field: f.get("field"), gender: f.get("gender"), category: f.get("category"),
      income: parseFloat(f.get("income")), marks: parseFloat(f.get("marks")),
      minority: form.minority.checked, disability: form.disability.checked
    };
  }

  function validate(p) {
    if (!(p.income >= 0)) return "Enter your family income in lakh per year (0 or more).";
    if (!(p.marks >= 0 && p.marks <= 100)) return "Marks must be between 0 and 100.";
    return "";
  }

  function card(item, mode) {
    const s = item.s;
    const head = el("div", { class: "card-head" },
      el("div", {}, el("h3", {}, s.name), el("p", { class: "muted" }, s.provider)),
      el("div", { class: "amount" }, s.amountText));
    const why = el("ul", { class: "why" });
    for (const c of item.checks) {
      why.append(el("li", { class: c.ok ? "ok" : "no" },
        el("span", { class: "mark", "aria-hidden": "true" }, c.ok ? "✓" : "✗"),
        el("span", { class: "sr" }, c.ok ? "Met: " : "Not met: "), c.label));
    }
    const isSaved = !!saved[s.id];
    const actions = el("div", { class: "actions" },
      el("a", { class: "btn", href: s.link, target: "_blank", rel: "noopener noreferrer" }, "Official page ↗"),
      el("button", { class: "btn ghost", type: "button", "aria-pressed": String(isSaved), onclick: () => toggleSave(s.id) }, isSaved ? "Saved ✓" : "Save & track"));
    const body = [head];
    if (mode === "almost") body.push(el("p", { class: "gap" }, "Missing: " + item.failed[0].label));
    body.push(why, el("p", { class: "notes" }, s.notes), el("p", { class: "muted" }, "When: " + s.window), actions);
    return el("article", { class: "card scholarship " + mode }, ...body);
  }

  function render(p) {
    const { eligible, almost } = Matcher.match(window.SCHOLARSHIPS, p);
    $("results").hidden = false;
    $("n-eligible").textContent = eligible.length + (eligible.length === 1 ? " scholarship" : " scholarships");
    const total = eligible.reduce((a, x) => a + x.s.amountValue, 0);
    $("summary").textContent = eligible.length
      ? "Up to ₹" + total.toLocaleString("en-IN") + " in combined yearly value across your matches (not all can be held together, so check each scheme's rules)."
      : "No full matches yet. Check the near misses below, and search other state and college schemes too.";
    const ev = $("eligible"); ev.replaceChildren(...eligible.map((i) => card(i, "eligible")));
    if (!eligible.length) ev.append(el("p", { class: "muted" }, "Nothing matched your exact answers."));
    $("almost-wrap").hidden = !almost.length;
    $("n-almost").textContent = "(" + almost.length + ")";
    $("almost").replaceChildren(...almost.map((i) => card(i, "almost")));
    renderSaved();
  }

  function toggleSave(id) {
    if (saved[id]) delete saved[id]; else saved[id] = { date: "" };
    store(KEY, saved);
    render(readProfile());
  }

  function renderSaved() {
    const ids = Object.keys(saved);
    $("saved-wrap").hidden = !ids.length;
    const root = $("saved"); root.replaceChildren();
    for (const id of ids) {
      const s = window.SCHOLARSHIPS.find((x) => x.id === id);
      if (!s) continue;
      const input = el("input", { type: "date", value: saved[id].date || "", "aria-label": "Deadline for " + s.name,
        onchange: (e) => { saved[id].date = e.target.value; store(KEY, saved); renderSaved(); } });
      const days = daysLeft(saved[id].date);
      const status = days == null ? "Set the deadline" : days < 0 ? "Deadline passed" : days === 0 ? "Due today" : days + " days left";
      const dl = el("button", { class: "btn ghost", type: "button", disabled: saved[id].date ? null : "disabled",
        onclick: () => download(s, saved[id].date) }, "Add to calendar");
      if (!saved[id].date) dl.setAttribute("disabled", "");
      else dl.removeAttribute("disabled");
      root.append(el("div", { class: "row" }, el("strong", {}, s.name), input,
        el("span", { class: "chip" + (days != null && days >= 0 && days <= 7 ? " urgent" : "") }, status), dl));
    }
  }

  function daysLeft(d) {
    if (!d) return null;
    const t = new Date(d + "T00:00:00"), n = new Date(); n.setHours(0, 0, 0, 0);
    return Math.round((t - n) / 86400000);
  }

  function download(s, date) {
    const blob = new Blob([Matcher.ics(s.name, date, s.link)], { type: "text/calendar" });
    const a = el("a", { href: URL.createObjectURL(blob), download: s.id + "-deadline.ics" });
    document.body.append(a); a.click(); a.remove();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const p = readProfile(), err = validate(p), box = $("error");
    box.hidden = !err; box.textContent = err;
    if (err) return;
    store(PKEY, p);
    render(p);
    $("results").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Restore previous answers.
  const prev = load(PKEY, null);
  if (prev) {
    for (const [k, v] of Object.entries(prev)) {
      const f = form.elements[k]; if (!f) continue;
      if (f.type === "checkbox") f.checked = !!v; else f.value = v;
    }
  }
  renderSaved();
})();
