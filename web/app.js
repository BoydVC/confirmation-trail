(() => {
  const DATA = window.__TRAIL__;
  if (!DATA || !DATA.kids) {
    document.body.innerHTML = "<p style='padding:2rem;font-family:system-ui;color:#f5f0ff;background:#1a0b2e'>Missing trail data. Run build.py.</p>";
    return;
  }

  const STORE_KEY = "confirmation-trail-v1";
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function loadStore() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || "{}") || {};
    } catch {
      return {};
    }
  }

  function saveStore(store) {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }

  let store = loadStore();
  if (!store.milestones) store.milestones = {};
  if (!store.checklist) store.checklist = {};
  if (!store.seeded) {
    DATA.kids.forEach((k) => {
      (k.milestones || []).forEach((m) => {
        const key = `${k.id}:${m.id}`;
        if (store.milestones[key] === undefined && m.doneDefault) {
          store.milestones[key] = true;
        }
      });
    });
    store.seeded = true;
    saveStore(store);
  }

  function milestoneDone(kidId, mid) {
    const key = `${kidId}:${mid}`;
    return !!store.milestones[key];
  }

  function setMilestone(kidId, mid, on) {
    store.milestones[`${kidId}:${mid}`] = !!on;
    saveStore(store);
  }

  function checkDone(id) {
    return !!store.checklist[id];
  }

  function setCheck(id, on) {
    store.checklist[id] = !!on;
    saveStore(store);
  }

  function kidProgress(kid) {
    const ms = kid.milestones || [];
    if (!ms.length) return 0;
    const done = ms.filter((m) => milestoneDone(kid.id, m.id)).length;
    return Math.round((done / ms.length) * 100);
  }

  function checklistProgress() {
    const items = (DATA.checklist && DATA.checklist.items) || [];
    if (!items.length) return 0;
    const done = items.filter((i) => checkDone(i.id)).length;
    return Math.round((done / items.length) * 100);
  }

  function daysUntil(ymd) {
    const [y, m, d] = ymd.split("-").map(Number);
    const target = new Date(y, m - 1, d);
    const now = new Date();
    const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((target - a) / 86400000);
  }

  function countdownParts(ymd) {
    const days = daysUntil(ymd);
    if (days < 0) {
      return { days: 0, weeks: 0, months: 0, past: true, daysRaw: days };
    }
    return {
      days,
      weeks: Math.floor(days / 7),
      months: Math.floor(days / 30.44),
      past: false,
      daysRaw: days,
    };
  }

  function setHash(view) {
    if (location.hash.slice(1) !== view) history.replaceState(null, "", "#" + view);
  }

  function showView(view) {
    $$(".tab").forEach((t) => {
      const on = t.dataset.view === view;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    $$(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + view));
    setHash(view);
    renderAll();
  }

  function renderKidDetail(kid) {
    const pct = kidProgress(kid);
    const ms = (kid.milestones || [])
      .map((m) => {
        const on = milestoneDone(kid.id, m.id);
        return `
        <label class="milestone ${on ? "done" : ""}">
          <input type="checkbox" data-kid="${escapeHtml(kid.id)}" data-mid="${escapeHtml(m.id)}" ${on ? "checked" : ""}>
          <div>
            <div class="mt">${escapeHtml(m.title)}</div>
            <div class="mn">${escapeHtml(m.note || "")}</div>
          </div>
        </label>`;
      })
      .join("");

    let countdownHtml = "";
    if (kid.countdownApprox) {
      const c = countdownParts(kid.countdownApprox);
      countdownHtml = `
        <p class="eyebrow">Countdown</p>
        <p class="lede" style="margin-bottom:0.4rem">${escapeHtml(kid.countdownLabel || "Approximate")}</p>
        ${
          c.past
            ? `<p class="fine">Approximate window has passed — confirm actual Mass date with the parish.</p>`
            : `<div class="countdown">
                <div class="cd-chip"><div class="n">${c.days}</div><div class="l">days</div></div>
                <div class="cd-chip"><div class="n">${c.weeks}</div><div class="l">weeks</div></div>
                <div class="cd-chip"><div class="n">${c.months}</div><div class="l">~months</div></div>
              </div>`
        }
        ${kid.registrationId ? `<span class="badge">#${escapeHtml(kid.registrationId)}</span>` : ""}`;
    }

    return `
      <div class="panel">
        <p class="eyebrow">${escapeHtml(kid.short)} · ${escapeHtml(kid.parish || "")}</p>
        <h2 class="view-title">${escapeHtml(kid.name)}</h2>
        <p class="track" style="color:var(--accent);font-weight:650;margin:0 0 0.5rem">${escapeHtml(kid.statusLabel)}</p>
        <p class="lede">${escapeHtml(kid.statusNote || "")}</p>
        <div class="progress-bar" aria-hidden="true"><span style="width:${pct}%"></span></div>
        <p class="fine">${pct}% milestones marked · family-tracked only</p>
        ${countdownHtml}
      </div>
      <div class="panel">
        <h3 class="view-title" style="font-size:1.05rem">Milestones</h3>
        <p class="lede">Tap to mark. No certificates are generated here.</p>
        ${ms}
      </div>`;
  }

  function renderTrails() {
    const cards = DATA.kids
      .map((k) => {
        const pct = kidProgress(k);
        return `
        <div class="kid-card" data-goto="${escapeHtml(k.id)}" role="button" tabindex="0">
          <h3>${escapeHtml(k.name)} <span style="font-weight:500;color:var(--muted)">(${escapeHtml(k.short)})</span></h3>
          <div class="track">${escapeHtml(k.statusLabel)}</div>
          <p class="fine">${escapeHtml(k.parish || "")}</p>
          <div class="progress-bar"><span style="width:${pct}%"></span></div>
          <p class="fine">${pct}% · open ${escapeHtml(k.short)} trail →</p>
        </div>`;
      })
      .join("");

    const vic = DATA.kids.find((k) => k.id === "vic");
    let heroCd = "";
    if (vic && vic.countdownApprox) {
      const c = countdownParts(vic.countdownApprox);
      heroCd = c.past
        ? ""
        : `<div class="panel">
            <p class="eyebrow">Vic · Spring 2027</p>
            <h2 class="view-title">~${c.days} days to approximate May 2027</h2>
            <p class="lede">Registration <span class="badge">#${escapeHtml(vic.registrationId || "D5XC8")}</span> · exact Mass date from parish / family.</p>
            <div class="countdown">
              <div class="cd-chip"><div class="n">${c.days}</div><div class="l">days</div></div>
              <div class="cd-chip"><div class="n">${c.weeks}</div><div class="l">weeks</div></div>
              <div class="cd-chip"><div class="n">${c.months}</div><div class="l">~months</div></div>
            </div>
          </div>`;
    }

    $("#view-trails").innerHTML = `
      ${heroCd}
      <div class="panel">
        <h2 class="view-title">Both trails</h2>
        <p class="lede">Char’s summer confirmation shell and Vic’s Spring 2027 path. Parish details stay generic unless the family adds them.</p>
        <div class="trail-grid">${cards}</div>
      </div>`;

    $$("[data-goto]").forEach((el) => {
      const go = () => showView(el.getAttribute("data-goto"));
      el.addEventListener("click", go);
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go();
        }
      });
    });
  }

  function renderChecklist() {
    const cl = DATA.checklist || {};
    const items = (cl.items || [])
      .map((it) => {
        const on = checkDone(it.id);
        return `
        <label class="check-item ${on ? "done" : ""}">
          <input type="checkbox" data-check="${escapeHtml(it.id)}" ${on ? "checked" : ""}>
          <div>
            <div class="ct">${escapeHtml(it.topic)}</div>
            <div class="ch">${escapeHtml(it.hint || "")}</div>
          </div>
        </label>`;
      })
      .join("");
    const pct = checklistProgress();
    $("#view-checklist").innerHTML = `
      <div class="panel">
        <h2 class="view-title"><span class="example-tag">EXAMPLE</span>${escapeHtml(cl.label || "Study checklist")}</h2>
        <p class="lede">${escapeHtml(cl.disclaimer || "")}</p>
        <div class="progress-bar"><span style="width:${pct}%"></span></div>
        <p class="fine">${pct}% checked · saved on this device</p>
      </div>
      <div class="panel">${items}</div>`;
  }

  function wireChecks() {
    $$("input[data-mid]").forEach((inp) => {
      inp.addEventListener("change", () => {
        setMilestone(inp.dataset.kid, inp.dataset.mid, inp.checked);
        renderAll();
      });
    });
    $$("input[data-check]").forEach((inp) => {
      inp.addEventListener("change", () => {
        setCheck(inp.dataset.check, inp.checked);
        renderAll();
      });
    });
  }

  function renderAboutFacts() {
    const facts = DATA.meta.knownFacts || [];
    $("#aboutFacts").innerHTML = facts.map((f) => `<li>${escapeHtml(f)}</li>`).join("");
  }

  function updatePills() {
    $("#progressPill").textContent = `Checklist ${checklistProgress()}%`;
    const vic = DATA.kids.find((k) => k.id === "vic");
    if (vic && vic.countdownApprox) {
      const c = countdownParts(vic.countdownApprox);
      $("#vicPill").textContent = c.past
        ? "Vic · Spring 2027"
        : `Vic · ~${c.days}d · #${vic.registrationId || "D5XC8"}`;
    }
  }

  function renderAll() {
    renderTrails();
    const char = DATA.kids.find((k) => k.id === "char");
    const vic = DATA.kids.find((k) => k.id === "vic");
    if (char) $("#view-char").innerHTML = renderKidDetail(char);
    if (vic) $("#view-vic").innerHTML = renderKidDetail(vic);
    renderChecklist();
    renderAboutFacts();
    updatePills();
    wireChecks();
  }

  $("#btnExport")?.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "confirmation-trail-progress.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  $("#btnReset")?.addEventListener("click", () => {
    if (!confirm("Reset all milestone and checklist progress on this device?")) return;
    store = { milestones: {}, checklist: {}, seeded: false };
    saveStore(store);
    // re-seed defaults
    DATA.kids.forEach((k) => {
      (k.milestones || []).forEach((m) => {
        if (m.doneDefault) store.milestones[`${k.id}:${m.id}`] = true;
      });
    });
    store.seeded = true;
    saveStore(store);
    renderAll();
  });

  $$(".tab").forEach((t) => t.addEventListener("click", () => showView(t.dataset.view)));
  window.addEventListener("hashchange", () => {
    const v = (location.hash || "#trails").slice(1) || "trails";
    if (["trails", "char", "vic", "checklist", "about"].includes(v)) showView(v);
  });

  const initial = (location.hash || "#trails").slice(1) || "trails";
  showView(["trails", "char", "vic", "checklist", "about"].includes(initial) ? initial : "trails");
})();
