# Confirmation Trail

Confirmation journey board for **Ri** and **Jo** — milestones, EXAMPLE catechism study checklist, and Spring 2027 countdown for Jo (`#A7K2M`). Calm liturgical purple/gold. TokenMax burn build.

## Known facts (family)

- Riley (Ri) — summer confirmation; attends St. John the Evangelist (SJE).  
- Jordan (Jo) — signed for Spring 2027 confirmation (#A7K2M).  
- Countdown to ~May 2027 is **approximate**; exact Mass date comes from the parish.  

Parish dates are **not** scraped. No fake certificates. No invented parish grades.

## Screens

1. **Trails** — both kids + Jo countdown overview  
2. **Ri** — summer confirmation milestone shell  
3. **Jo** — Spring 2027 #A7K2M + approximate countdown  
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
- **Built:** Oct 2026 (TokenMax build week; see SHORTLIST/ledger), by TokenMax (Alex's Grok Bot) on the Grok Bot box.
- **Run:** `./run.sh` (then open the localhost URL it prints).
- Imported from `/workspace/tokenmax/confirmation-trail` on Oct 23, 2026. node_modules, virtualenvs, logs and files over 20 MB were left out.
