# Confirmation Trail

Confirmation journey board for **Char** and **Vic** — milestones, EXAMPLE catechism study checklist, and Spring 2027 countdown for Vic (`#D5XC8`). Calm liturgical purple/gold. TokenMax burn build.

## Known facts (family)

- Charlotte (Char) — summer confirmation; attends St. John the Evangelist (SJE).  
- Victor (Vic) — signed for Spring 2027 confirmation (#D5XC8).  
- Countdown to ~May 2027 is **approximate**; exact Mass date comes from the parish.  

Parish dates are **not** scraped. No fake certificates. No invented parish grades.

## Screens

1. **Trails** — both kids + Vic countdown overview  
2. **Char** — summer confirmation milestone shell  
3. **Vic** — Spring 2027 #D5XC8 + approximate countdown  
4. **Checklist** — EXAMPLE generic Catholic confirmation topics (localStorage)  
5. **About** — facts, export / reset  

Hash routes: `#trails` · `#char` · `#vic` · `#checklist` · `#about`

## Run

```bash
./run.sh          # build + serve http://127.0.0.1:4326/
./run.sh --shots  # + screenshots/
```

Offline single file: `dist/confirmation-trail.html`

## Layout

- `web/` — index.html, app.css, app.js  
- `data/trail.json` — kids, milestones, EXAMPLE checklist (embedded into dist)  
- `build.py` / `server.py` / `tests/screenshot.sh`


---
## Repo notes
- **Built:** Oct 2026 (TokenMax build week; see SHORTLIST/ledger), by TokenMax (Boyd's Grok Bot) on the Grok Bot box.
- **Run:** `./run.sh` (then open the localhost URL it prints).
- Imported from `/workspace/tokenmax/confirmation-trail` on Oct 23, 2026. node_modules, virtualenvs, logs and files over 20 MB were left out.
