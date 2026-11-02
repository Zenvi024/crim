# Crim 1 Midterm Desk (Arts. 1–11, Prof. Gutierrez)

Single-file study site. Build: `python3 site/build.py` → `site/dist/crim1-midterm-desk.html` (validates the data first).
Test: `node site/tests/smoke.js [screenshot-dir]` (Playwright; 400/1280 px, light/dark).

- `data/cases.js` — the 49 syllabus cases (+ Agao): facts, ruling, why, doctrine, recit nitpicks, flags
- `data/codal.js` — verbatim Arts. 1–11 with `[[cloze]]` marks; Reyes elements/requisites lists
- `data/reviewer.js` — reviewer topics (codal → Reyes → doctrines → traps → exam line → drill) and decision gates
- `data/samplex.js` — Mock exam A, San Beda 2019 midterm, past bar problems, MCQs
- `src/` — template, style, app (SRS drills, search, focus mode)
