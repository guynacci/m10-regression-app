// Interactive explanations of linear regression,
// random forests, and gradient boosting.
import * as m10 from "./m10.js";

const LABELS = { glucose: "Fasting glucose", sbp: "Blood pressure", fev1: "Lung function (FEV₁)" };
const state = { key: "glucose", person: "P1", values: null };
const $ = (id) => document.getElementById(id);
const fmt = (v, d = 1) => Number(v).toFixed(d);
const signed = (v, d = 1) => (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(d);

function section() {
  const s = location.hash.slice(1);
  return ["linear", "forest", "boosting"].includes(s) ? s : "linear";
}

async function setup() {
  $("dataset").innerHTML = m10.DATASETS.map((k) => `<option value="${k}">${LABELS[k]}</option>`).join("");
  $("dataset").onchange = async (e) => { state.key = e.target.value; state.person = "P1"; await loadPeople(); render(); };
  $("person").onchange = (e) => { state.person = e.target.value; state.values = null; render(); };
  window.onhashchange = render;
  await loadPeople();
  render();
}

async function loadPeople() {
  const b = await m10.loadBundle(state.key);
  $("person").innerHTML = b.people.map((p) => `<option value="${p.id}">${p.label}: ${p.description}</option>`).join("");
  $("person").value = state.person;
  state.values = null;
}

async function render() {
  document.querySelectorAll("nav a").forEach((a) => a.classList.toggle("active", a.hash === "#" + section()));
  const b = await m10.loadBundle(state.key);
  const person = b.people.find((p) => p.id === state.person);
  if (!state.values) state.values = { ...person.values };
  const draw = { linear: renderLinear, forest: renderForest, boosting: renderBoosting }[section()];
  await draw(b, person);
}

function bars(rows,u) {
 const max=Math.max(...rows.map(([n,v])=>Math.abs(v)),1);
 return `<div class="bars">${rows.map(([n,v])=>`<div class="barrow"><span>${n}</span><div class="bartrack"><i style="width:${Math.abs(v)/max*48}%;left:${v<0?50-Math.abs(v)/max*48:50}%;background:${v<0?'#d05d45':'#147d75'}"></i></div><strong>${signed(v)} ${u}</strong></div>`).join('')}</div>`;
}
function lineChart(series,units,label,selected=null) {
 const w=760,h=280,l=72,r=24,t=25,bt=52;
 const all=series.flatMap(s=>s.values);let low=Math.min(...all), high=Math.max(...all); if(low===high) high+=1;
 const count=Math.max(...series.map(s=>s.values.length));
 const x=i=>l+i/(count-1)*(w-l-r), y=v=>h-bt-(v-low)/(high-low)*(h-t-bt);
 return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}"><title>${label}</title>${[0,1,2,3,4].map(i=>{const v=low+(high-low)*i/4;return `<line x1="${l}" x2="${w-r}" y1="${y(v)}" y2="${y(v)}" stroke="#e1e7e5"/><text x="${l-8}" y="${y(v)+4}" text-anchor="end">${fmt(v)}</text>`}).join('')}${series.map(s=>`<path d="${s.values.map((v,i)=>`${i?'L':'M'}${x(i)},${y(v)}`).join(' ')}" fill="none" stroke="${s.color}" stroke-width="2.5"/>`).join('')}${selected===null?'':`<line x1="${x(selected)}" x2="${x(selected)}" y1="${t}" y2="${h-bt}" stroke="#172f35" stroke-dasharray="5 4"/>`}<text x="${l}" y="16">${units}</text><text x="${l}" y="${h-30}">0</text><text x="${w-r}" y="${h-30}" text-anchor="end">${count-1}</text><text x="${w/2}" y="${h-8}" text-anchor="middle">${label}</text></svg>`;
}
const featureLabel = (b, name) => (b.features.find((f) => f.name === name) || { label: name }).label;

// ---- Push & Pull -------------------------------------------------------------
function renderLinear(b, person) {
  const u = b.units;
  const ex = m10.linearExplain(b, state.values);
  const groups = b.categorical_groups;
  const grouped = new Set(groups.flatMap((g) => g.levels.filter((lv) => lv.column).map((lv) => lv.column)));
  const numeric = b.features.filter((f) => !grouped.has(f.name));
  const rows = Object.entries(ex.groupedPushes).map(([name, v]) => {
    const g = groups.find((g) => g.name === name);
    const label = g ? `${g.label}: ${m10.categoryOf(b, name, state.values)}` : `${featureLabel(b, name)} = ${fmt(state.values[name], 1)}`;
    return `<tr><td>${label}</td><td class="num ${v >= 0 ? "up" : "down"}">${signed(v)} ${u}</td></tr>`;
  });
  $("section").innerHTML = `
    <h2>Push &amp; Pull: which features push the prediction up or down?</h2>
    
    <p class="lead">Start with the prediction for the training average. Add a signed push for each difference between this person and that average.</p>
    <div class="inputs">
      ${numeric.map((f) => {
        const s = b.feature_stats[f.name];
        return `<label>${f.label} (${f.units})<input type="number" data-f="${f.name}" value="${state.values[f.name]}" min="${s.min}" max="${s.max}" step="any"></label>`;
      }).join("")}
      ${groups.map((g) => `<label>${g.label}<select data-g="${g.name}">${g.levels
        .map((lv) => `<option ${lv.label === m10.categoryOf(b, g.name, state.values) ? "selected" : ""}>${lv.label}</option>`)
        .join("")}</select></label>`).join("")}
    </div>
    <div class="heroresult"><span>Model prediction</span><strong>${fmt(ex.prediction)} ${u}</strong><small>${state.values && Object.keys(person.values).some(k=>state.values[k]!==person.values[k])?'Edited values: the original observed value is no longer a matching outcome.':`Observed outcome: ${fmt(person.observed)} ${u}`}</small></div>
    ${bars(Object.entries(ex.groupedPushes).map(([n,v])=>[groups.find(g=>g.name===n)?.label || featureLabel(b,n),v]),u)}
    <table>
      <tr><td>Starting point (prediction for the training average)</td><td class="num">${fmt(ex.baseline)} ${u}</td></tr>
      ${rows.join("")}
      <tr><th>Prediction</th><th class="num">${fmt(ex.prediction)} ${u}</th></tr>
    </table>
    <div class="equation">${fmt(ex.baseline,3)} ${Object.values(ex.groupedPushes).map(v=>signed(v,3)).join(' ')} = ${fmt(ex.prediction,3)} ${u}<small>Displayed terms are rounded; calculations use full precision.</small></div>
    <details open><summary>Coefficient vs. this person's push</summary><p>A coefficient is the model's change per one feature unit, holding other inputs fixed. For ${numeric[0].label.toLowerCase()}, the coefficient is <b>${fmt(b.linear.coefficients[numeric[0].name],4)} ${u} per ${numeric[0].units}</b>. This person's push is that coefficient times (${fmt(state.values[numeric[0].name],3)} - ${fmt(b.linear.reference[numeric[0].name],3)}) ${numeric[0].units} = <b>${signed(ex.pushes[numeric[0].name],3)} ${u}</b>.</p><p>The largest push for one person is not overall importance. To compare numeric features in general, use coefficient times training standard deviation, which puts effects in the same outcome units:</p>${bars(Object.entries(b.linear.typical_effect_per_sd).map(([n,v])=>[featureLabel(b,n),v]),u)}<p>Category pushes compare with the training mix. Category coefficients compare with the named reference group; neither describes a causal effect.</p></details>
    ${b.target==='fev1' && person.id==='P1'?'<aside>The straight line struggles here: this person is age 9. A single age slope cannot describe both childhood growth and later decline. Compare the predicted and observed values above.</aside>':''}
    <details><summary>Check your understanding</summary><p>Blood pressure, Example person 2: find the longest positive bar. That is the largest upward push for this person. Its coefficient alone would not answer the question, because a push also depends on distance from the training average.</p></details>
    <p class="note">Each push = coefficient × (this value − training average). Starting point + all pushes = prediction.
      Categories (${groups.map((g) => g.label.toLowerCase()).join(", ")}) are compared with the training mix; the model's reference
      group is ${groups.map((g) => g.reference).join(" / ")}. These are associations in the data, not causes.</p>`;
  document.querySelectorAll("[data-f]").forEach((el) =>
    (el.onchange = () => { state.values[el.dataset.f] = Number(el.value); renderLinear(b, person); }));
  document.querySelectorAll("[data-g]").forEach((el) =>
    (el.onchange = () => { Object.assign(state.values, m10.categoryInputs(b, el.dataset.g, el.value)); renderLinear(b, person); }));
}

// ---- Wisdom of the Forest ----------------------------------------------------
// The slider is drawn once; only the results below it redraw, so dragging works.
function renderForest(b, person) {
  const u = b.units;
  const rf = b.forest;
  const trees = rf.people[person.id].tree_predictions;
  const n = Number(state.nTrees || 10);
  $("section").innerHTML = `
    <h2>Wisdom of the Forest: how do ${rf.n_trees} trees combine?</h2>
    
    <p>${person.label} (${person.description}). Observed: ${fmt(person.observed)} ${u}.</p>
    <p class="lead">Different samples + different questions → different tree guesses → one average.</p>
    <p>First 10 trees' guesses: ${trees.slice(0, 10).map((t) => fmt(t)).join(", ")} ${u}</p>
    <label>Trees included: <input id="ntrees" type="range" min="1" max="${rf.n_trees}" value="${n}"> <span id="ntrees-value">${n}</span></label>
    <div id="forest-results" aria-live="polite"></div>
    <details open><summary>Why averaging can help</summary><p>A bootstrap sample draws training people with replacement: some appear repeatedly, while others are left out. Random feature selection gives trees different questions to choose from. These changes create diverse rules. Averaging can partly cancel individual trees' high and low errors, but correlated mistakes remain. Steadier does not guarantee more accurate.</p><p>Try Glucose → Example person 4, then move the slider from 1 to 100. Wide disagreement means the trees give varied predictions; it is not a calibrated confidence or prediction interval and does not capture all real uncertainty.</p></details>
    <p class="note">Trees differ because each one learns from a different bootstrap sample (about
      ${Math.round((100 * rf.bootstrap_unique_training_rows.reduce((a, c) => a + c, 0)) / rf.bootstrap_unique_training_rows.length / rf.n_training_rows)}%
      of the training people, some repeated) and tries only ${rf.features_tried_per_split} of ${rf.n_features} features at each split.
      The spread is disagreement between trees, not a confidence interval.</p>`;
  const update = (k) => {
    $("ntrees-value").textContent = k;
    $("forest-results").innerHTML = `<div class="heroresult"><span>${k<100?'Partial forest':'Whole forest'} · first ${k} trees</span><strong>${fmt(m10.runningAverage(trees,k))} ${u}</strong></div>${lineChart([{values:trees,color:'#d05d45'},{values:trees.map((v,i)=>m10.runningAverage(trees,i+1)),color:'#147d75'}],u,'Tree index (0 = tree 1)',k-1)}<p class="legend">Orange: each tree's guess · Teal: average through that tree</p><table>
      <tr><td>${k < rf.n_trees ? `Partial forest: average of the first ${k} of ${rf.n_trees} trees` : `Whole forest: average of all ${rf.n_trees} trees`}</td><td class="num">${fmt(m10.runningAverage(trees, k))} ${u}</td></tr>
      <tr><th>Forest prediction (all ${rf.n_trees} trees)</th><th class="num">${fmt(rf.people[person.id].prediction)} ${u}</th></tr>
      <tr><td>Tree disagreement for this person (lowest to highest guess)</td><td class="num">${fmt(Math.min(...trees))} to ${fmt(Math.max(...trees))} ${u}</td></tr>
    </table>`;
  };
  $("ntrees").oninput = (e) => { state.nTrees = Number(e.target.value); update(state.nTrees); };
  update(n);
}

// ---- One Correction at a Time -----------------------------------------------
function renderBoosting(b, person) {
  const u = b.units;
  const gb = b.boosting;
  const p = gb.people[person.id];
  const r = Number(state.round ?? 1);
  $("section").innerHTML = `
    <h2>One Correction at a Time: how does each tree improve the model?</h2>
    
    <p>${person.label} (${person.description}). Observed: ${fmt(person.observed)} ${u}.</p>
    <label>Round: <input id="round" type="range" min="0" max="${p.corrections.length}" value="${r}"> <span id="round-value">${r}</span></label>
    <button id="best-round" type="button">Use lowest-validation-error round</button>
    <div id="boosting-results" aria-live="polite"></div>
    <details open><summary>Why stop before the training error bottoms out?</summary><p>A residual is actual minus predicted. Each new tree learns patterns in the <b>training residuals</b>, and a small part of its suggested correction is added. Later rounds can fit noise specific to training people. Validation error checks performance on different people and can start rising while training error keeps falling.</p><p>Use the round with the lowest validation RMSE to choose where to stop. Since validation data helped make that choice, this is a validation-based choice, not an independent test result. For glucose, compare the chosen best round with round 500.</p><p>The supplied corrections already include the learning rate of 0.1. The app adds each correction exactly once.</p></details>
    <p class="note">Each new tree is fitted to the training errors (residuals) left by the rounds before it.
      The stopping round is chosen with validation data, so its error is not an independent test result.</p>`;
  const update = (k) => {
    $("round-value").textContent = k;
    $("boosting-results").innerHTML = `<table>
      ${k === 0
        ? `<tr><th>Round 0: average outcome in the training rows</th><th class="num">${fmt(gb.init)} ${u}</th></tr>`
        : `<tr><td>Prediction after round ${k - 1}</td><td class="num">${fmt(p.staged[k - 1])} ${u}</td></tr>
           <tr><td>Correction from tree ${k} (already scaled by the learning rate)</td><td class="num ${p.corrections[k - 1] >= 0 ? "up" : "down"}">${signed(p.corrections[k - 1], 2)} ${u}</td></tr>
           <tr><th>Prediction after round ${k}</th><th class="num">${fmt(p.staged[k])} ${u}</th></tr>`}
    </table>
    ${lineChart([{values:gb.rmse.train,color:'#879390'},{values:gb.rmse.validation,color:'#147d75'}],`RMSE (${u})`,'Boosting round',k)}<p class="legend">Grey: training RMSE · Teal: validation RMSE · Dashed line: your stopping round</p>
    <p>If you stop at round ${k}: validation RMSE ${fmt(gb.rmse.validation[k])} ${u} (training ${fmt(gb.rmse.train[k])} ${u}).
      Lowest validation RMSE: ${fmt(gb.best_validation_rmse)} ${u} at round ${gb.best_validation_round}.</p>`;
  };
  $("best-round").onclick = () => { state.round=gb.best_validation_round; $("round").value=state.round; update(state.round); };
  $("round").oninput = (e) => { state.round = Number(e.target.value); update(state.round); };
  update(r);
}

function rmseChart(gb, round, u) {
  const W = 600, H = 220, pad = 40;
  const tr = gb.rmse.train, va = gb.rmse.validation;
  const lo = Math.min(...tr, ...va), hi = Math.max(...tr, ...va);
  const x = (i) => pad + (i / (tr.length - 1)) * (W - 2 * pad);
  const y = (v) => H - pad - ((v - lo) / (hi - lo)) * (H - 2 * pad);
  const line = (arr) => arr.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Training and validation RMSE by round">
    <path d="${line(tr)}" fill="none" stroke="var(--muted)" stroke-width="2"/>
    <path d="${line(va)}" fill="none" stroke="var(--accent)" stroke-width="2"/>
    <line x1="${x(round)}" x2="${x(round)}" y1="${pad}" y2="${H - pad}" stroke="var(--fg)" stroke-dasharray="4 3"/>
    <circle cx="${x(gb.best_validation_round)}" cy="${y(gb.best_validation_rmse)}" r="4" fill="var(--accent)"/>
    <text x="${pad}" y="${H - 10}" fill="var(--muted)" font-size="12">Round (0 to ${tr.length - 1})</text>
    <text x="4" y="${pad - 12}" fill="var(--muted)" font-size="12">RMSE (${u}): grey = training, blue = validation, dot = lowest validation</text>
    <text x="${pad - 4}" y="${y(hi) + 4}" fill="var(--muted)" font-size="11" text-anchor="end">${hi.toFixed(0)}</text>
    <text x="${pad - 4}" y="${y(lo) + 4}" fill="var(--muted)" font-size="11" text-anchor="end">${lo.toFixed(0)}</text>
  </svg>`;
}

setup().catch(e => { $("section").textContent = "Unable to load model outputs: " + e.message; });
