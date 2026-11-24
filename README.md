# Scholarship Finder

Built for the JioCoder Hackathon 2026.

**Problem:** students miss scholarships because eligibility rules and deadlines are buried in long PDFs.

**Solution:** answer 8 quick questions and see:
- the scholarships you qualify for, with a ✓/✗ checklist explaining *why*;
- **"One step away"** scholarships, which you miss by exactly one requirement, with the gap highlighted;
- a deadline tracker that exports `.ics` calendar reminders (7 days and 1 day before).

Private by design: there is no backend, no sign-up, and answers stay in your browser's `localStorage`.

## Run it

Open `index.html`, or serve the folder with any static host. No build step or dependencies.

```bash
npx serve .          # or: python3 -m http.server
node test.js         # matcher unit tests
```

## Structure

| File | Purpose |
|---|---|
| `data.js` | Scholarship dataset: structured eligibility rules, amounts, official links |
| `matcher.js` | Pure matching and `.ics` logic, with no DOM, so it is unit-testable |
| `app.js` / `index.html` / `styles.css` | UI |
| `test.js` | Tests for matching, near-miss logic, sorting and `.ics` output |

## Adding a scholarship

Append an object to `data.js`. Every rule is optional, and the matcher and UI explain the rules automatically.

```js
{ id: "x", name: "...", provider: "...", amountText: "₹50,000/yr", amountValue: 50000,
  rules: { levels: ["ug"], fields: ["tech"], gender: "female", maxIncome: 8, minMarks: 60 },
  notes: "...", window: "...", link: "https://..." }
```

## Data accuracy

Rules are summarised from public information and **change every cycle**. Each card links to the official page, and the app tells users to verify there. Re-check `data.js` against official sources before relying on it. Exact deadlines are deliberately not hard-coded; users enter the date from the official notice.

## Ideas for next steps

- State-level scholarships and a state filter
- Importing a verified dataset (for example NSP) on a schedule
- Hindi and other regional-language UI
- A "documents checklist" per scholarship
