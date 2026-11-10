(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
  const mean = (values) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const coefficientOfVariation = (values, average = mean(values)) => {
    if (values.length < 2 || !Number.isFinite(average) || average <= 0) return 0.25;
    const sumSquares = values.reduce((sum, value) => sum + (value - average) ** 2, 0);
    return Math.sqrt(sumSquares / (values.length - 1)) / average;
  };
  const percentile = (values, p) => {
    if (!values.length) return 0;
    const sorted = values.slice().sort((a, b) => a - b);
    const at = (sorted.length - 1) * p;
    const lower = Math.floor(at);
    const upper = Math.ceil(at);
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (at - lower);
  };
  const fmt = (n, digits = 1) => Number.isFinite(n) ? `${n.toFixed(digits)} min` : "—";
  const fmtNum = (n, digits = 1) => Number.isFinite(n) ? n.toFixed(digits) : "—";
  const fmtDelta = (n, unit = "min") => {
    if (!Number.isFinite(n)) return "—";
    const v = Math.abs(n) < 0.05 ? 0 : n;
    return `${v > 0 ? "+" : ""}${v.toFixed(1)} ${unit}`;
  };
  const makeRng = (seed) => {
    let state = seed >>> 0;
    return () => {
      state = (Math.imul(1664525, state) + 1013904223) >>> 0;
      return state / 4294967296;
    };
  };
  const normalDraw = (rng) => {
    const u = Math.max(rng(), 1e-12);
    const v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const lognormal = (targetMean, cv, rng) => {
    const sigma2 = Math.log(1 + cv * cv);
    const mu = Math.log(Math.max(0.1, targetMean)) - sigma2 / 2;
    return Math.max(0.2, Math.exp(mu + Math.sqrt(sigma2) * normalDraw(rng)));
  };
  const defaults = {
    shepDemand: 100, shepReceptionists: 1, shepStaff: 2, shepSeats: 5, shepBooking: 65, shepService: 7.5,
    finchDemand: 120, finchReceptionists: 1, finchStaff: 3, finchSeats: 12, finchBooking: 65, finchService: 7.5,
    openHours: 8, intakeTime: 2, intakeCv: 0.25, procedureCv: 0.42, replications: 40, redirectShare: 15, travelTime: 10, bookedPattern: "morning", useObservedArrivals: false, extraStaff: false
  };
  let latestResults = null;
  let observedRows = [];
  let observedStats = null;

  function readConfig() {
    const get = (id, fallback) => {
      const el = document.getElementById(id);
      const v = Number(el.value);
      return Number.isFinite(v) ? v : fallback;
    };
    const cfg = {
      shepDemand: clamp(Math.round(get("shep-demand", defaults.shepDemand)), 1, 500),
      shepReceptionists: clamp(Math.round(get("shep-receptionists", defaults.shepReceptionists)), 1, 6),
      shepStaff: clamp(Math.round(get("shep-staff", defaults.shepStaff)), 1, 12),
      shepSeats: clamp(Math.round(get("shep-seats", defaults.shepSeats)), 1, 100),
      shepBooking: clamp(get("shep-booking", defaults.shepBooking), 0, 100),
      shepService: clamp(get("shep-service", defaults.shepService), 2, 40),
      finchDemand: clamp(Math.round(get("finch-demand", defaults.finchDemand)), 1, 500),
      finchReceptionists: clamp(Math.round(get("finch-receptionists", defaults.finchReceptionists)), 1, 6),
      finchStaff: clamp(Math.round(get("finch-staff", defaults.finchStaff)), 1, 12),
      finchSeats: clamp(Math.round(get("finch-seats", defaults.finchSeats)), 1, 100),
      finchBooking: clamp(get("finch-booking", defaults.finchBooking), 0, 100),
      finchService: clamp(get("finch-service", defaults.finchService), 2, 40),
      openHours: clamp(get("open-hours", defaults.openHours), 4, 14),
      intakeTime: clamp(get("intake-time", defaults.intakeTime), 0.5, 15),
      intakeCv: clamp(get("intake-cv", defaults.intakeCv), 0.05, 1.5),
      procedureCv: clamp(get("procedure-cv", defaults.procedureCv), 0.1, 1.5),
      replications: clamp(Math.round(get("replications", defaults.replications)), 10, 150),
      redirectShare: clamp(get("redirect-share", defaults.redirectShare), 0, 40),
      travelTime: clamp(get("travel-time", defaults.travelTime), 0, 60),
      bookedPattern: $("#booked-pattern").value || defaults.bookedPattern,
      useObservedArrivals: $("#use-observed-arrivals").checked,
      extraStaff: $("#extra-staff").checked
    };
    return cfg;
  }

  function setFormValues(cfg) {
    const map = {
      shepDemand: "shep-demand", shepReceptionists: "shep-receptionists", shepStaff: "shep-staff", shepSeats: "shep-seats", shepBooking: "shep-booking", shepService: "shep-service",
      finchDemand: "finch-demand", finchReceptionists: "finch-receptionists", finchStaff: "finch-staff", finchSeats: "finch-seats", finchBooking: "finch-booking", finchService: "finch-service",
      openHours: "open-hours", intakeTime: "intake-time", intakeCv: "intake-cv", procedureCv: "procedure-cv", replications: "replications", redirectShare: "redirect-share", travelTime: "travel-time", bookedPattern: "booked-pattern"
    };
    for (const [key, id] of Object.entries(map)) document.getElementById(id).value = cfg[key];
    $("#extra-staff").checked = Boolean(cfg.extraStaff);
    $("#use-observed-arrivals").checked = Boolean(cfg.useObservedArrivals);
  }

  const profileWeights = [1.9, 1.6, 1.3, 1.05, 0.9, 0.78, 0.68, 0.58, 0.52, 0.5, 0.5, 0.5, 0.5, 0.5];
  function weightedWalkInMinute(openMinutes, rng) {
    const hours = Math.ceil(openMinutes / 60);
    const weights = Array.from({length: hours}, (_, i) => profileWeights[Math.min(i, profileWeights.length - 1)]);
    const total = weights.reduce((a, b) => a + b, 0);
    let draw = rng() * total;
    let hour = 0;
    for (; hour < weights.length - 1; hour++) {
      draw -= weights[hour];
      if (draw <= 0) break;
    }
    return Math.min(openMinutes - 0.01, hour * 60 + rng() * Math.min(60, openMinutes - hour * 60));
  }

  function observedArrivalProfile(site, mode, openMinutes) {
    const siteRows = observedRows.filter(row => row.site === site && row.arrival >= 0 && row.arrival < openMinutes);
    if (siteRows.length < 30) return null;
    const modeRows = mode ? siteRows.filter(row => row.mode === mode) : [];
    const rows = modeRows.length >= 10 ? modeRows : siteRows;
    const binMinutes = 30;
    const weights = Array(Math.ceil(openMinutes / binMinutes)).fill(0);
    for (const row of rows) {
      const index = clamp(Math.floor(row.arrival / binMinutes), 0, weights.length - 1);
      weights[index]++;
    }
    return { weights, sampleSize: rows.length, binMinutes };
  }

  function buildObservedArrivalProfiles(site, openMinutes) {
    const all = observedArrivalProfile(site, null, openMinutes);
    if (!all) return null;
    return {
      all,
      booked: observedArrivalProfile(site, "Booked", openMinutes) || all,
      walkIn: observedArrivalProfile(site, "Walk-in", openMinutes) || all
    };
  }

  function weightedObservedMinute(profile, openMinutes, rng) {
    const weights = profile.weights.map(weight => weight + 0.5);
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let draw = rng() * total;
    let bin = 0;
    for (; bin < weights.length - 1; bin++) {
      draw -= weights[bin];
      if (draw <= 0) break;
    }
    const start = bin * profile.binMinutes;
    return Math.min(openMinutes - 0.01, start + rng() * Math.max(0.01, Math.min(profile.binMinutes, openMinutes - start)));
  }

  function generatePatients(site, demand, bookingShare, openMinutes, rng, bookedPattern, arrivalProfiles = null) {
    const n = Math.round(demand);
    const bookedCount = clamp(Math.round(n * bookingShare / 100), 0, n);
    const walkInCount = n - bookedCount;
    const patients = [];
    const morningWindow = Math.min(180, openMinutes);
    const morningBooked = bookedPattern === "morning" && openMinutes > 180 ? Math.round(bookedCount * 0.6) : bookedCount;
    const laterBooked = bookedCount - morningBooked;
    for (let i = 0; i < bookedCount; i++) {
      let arrival;
      if (arrivalProfiles && arrivalProfiles.booked) {
        arrival = weightedObservedMinute(arrivalProfiles.booked, openMinutes, rng);
      } else {
        let center;
        if (i < morningBooked) center = ((i + 0.5) / Math.max(1, morningBooked)) * morningWindow;
        else center = morningWindow + ((i - morningBooked + 0.5) / Math.max(1, laterBooked)) * Math.max(0.1, openMinutes - morningWindow);
        arrival = clamp(center + (rng() - 0.5) * 4, 0, openMinutes - 0.01);
      }
      patients.push({ id: `${site}-b-${i}`, site, mode: "Booked", arrival, originArrival: arrival, originSite: site });
    }
    for (let i = 0; i < walkInCount; i++) {
      const arrival = arrivalProfiles && arrivalProfiles.walkIn ? weightedObservedMinute(arrivalProfiles.walkIn, openMinutes, rng) : weightedWalkInMinute(openMinutes, rng);
      patients.push({ id: `${site}-w-${i}`, site, mode: "Walk-in", arrival, originArrival: arrival, originSite: site });
    }
    patients.sort((a, b) => a.arrival - b.arrival);
    return patients;
  }

  function simulateSite(patients, siteCfg, intakeMean, intakeCv, openMinutes, seed) {
    const rng = makeRng(seed);
    const receptionFree = Array(Math.max(1, Math.round(siteCfg.receptionists || 1))).fill(0);
    const staffFree = Array(siteCfg.staff).fill(0);
    const processed = [];
    let intakeBusyDuringOpen = 0;
    let procedureBusyDuringOpen = 0;
    for (const original of patients.slice().sort((a, b) => a.arrival - b.arrival)) {
      const arrival = original.arrival;
      let receptionIndex = 0;
      for (let i = 1; i < receptionFree.length; i++) if (receptionFree[i] < receptionFree[receptionIndex]) receptionIndex = i;
      const intakeStart = Math.max(arrival, receptionFree[receptionIndex]);
      const intakeDuration = lognormal(intakeMean, intakeCv, rng);
      const intakeEnd = intakeStart + intakeDuration;
      receptionFree[receptionIndex] = intakeEnd;
      intakeBusyDuringOpen += Math.max(0, Math.min(intakeEnd, openMinutes) - Math.max(intakeStart, 0));
      let staffIndex = 0;
      for (let i = 1; i < staffFree.length; i++) if (staffFree[i] < staffFree[staffIndex]) staffIndex = i;
      const procedureStart = Math.max(intakeEnd, staffFree[staffIndex]);
      const procedureDuration = lognormal(siteCfg.serviceMean, siteCfg.serviceCv ?? 0.42, rng);
      const completion = procedureStart + procedureDuration;
      staffFree[staffIndex] = completion;
      procedureBusyDuringOpen += Math.max(0, Math.min(completion, openMinutes) - Math.max(procedureStart, 0));
      const queueWait = Math.max(0, intakeStart - arrival) + Math.max(0, procedureStart - intakeEnd);
      processed.push({
        ...original, arrival, intakeStart, intakeEnd, procedureStart, completion,
        intakeDuration, procedureDuration, queueWait,
        waitToProcedure: Math.max(0, procedureStart - arrival),
        elapsedToProcedure: Math.max(0, procedureStart - (original.originArrival ?? arrival)),
        elapsedToCompletion: Math.max(0, completion - (original.originArrival ?? arrival))
      });
    }
    let peakWaiting = 0;
    let overflowMinutes = 0;
    let waitersTotalByMinute = 0;
    const minuteCount = Math.ceil(openMinutes);
    const presenceDelta = Array(minuteCount + 1).fill(0);
    const intakeDelta = Array(minuteCount + 1).fill(0);
    const procedureDelta = Array(minuteCount + 1).fill(0);
    const addInterval = (delta, start, end) => {
      const first = clamp(Math.ceil(start), 0, minuteCount);
      const afterLast = clamp(Math.ceil(end), 0, minuteCount);
      if (afterLast > first) { delta[first]++; delta[afterLast]--; }
    };
    for (const p of processed) {
      addInterval(presenceDelta, p.arrival, p.completion);
      addInterval(intakeDelta, p.intakeStart, p.intakeEnd);
      addInterval(procedureDelta, p.procedureStart, p.completion);
    }
    let present = 0; let inIntake = 0; let inProcedure = 0;
    for (let t = 0; t < minuteCount; t++) {
      present += presenceDelta[t];
      inIntake += intakeDelta[t];
      inProcedure += procedureDelta[t];
      const waiting = Math.max(0, present - inIntake - inProcedure);
      peakWaiting = Math.max(peakWaiting, waiting);
      waitersTotalByMinute += waiting;
      if (t < openMinutes && waiting > siteCfg.seats) overflowMinutes++;
    }
    const utilization = procedureBusyDuringOpen / Math.max(1, siteCfg.staff * openMinutes) * 100;
    const receptionUtilization = intakeBusyDuringOpen / Math.max(1, receptionFree.length * openMinutes) * 100;
    return {
      patients: processed,
      peakWaiting,
      overflowMinutes,
      overflowPct: overflowMinutes / Math.max(1, openMinutes) * 100,
      meanWaitingPeople: waitersTotalByMinute / Math.max(1, openMinutes),
      utilization,
      receptionUtilization,
      completedByClose: processed.filter(p => p.completion <= openMinutes).length,
      patientsCount: processed.length
    };
  }

  function summarizeSite(repSiteResults) {
    const patientRows = repSiteResults.flatMap(r => r.patients);
    const queueWaits = patientRows.map(p => p.queueWait);
    const elapsed = patientRows.map(p => p.elapsedToProcedure);
    return {
      patients: patientRows,
      count: mean(repSiteResults.map(r => r.patientsCount)),
      averageQueueWait: mean(queueWaits),
      p90QueueWait: percentile(queueWaits, 0.9),
      averageElapsedToProcedure: mean(elapsed),
      p90ElapsedToProcedure: percentile(elapsed, 0.9),
      peakWaiting: mean(repSiteResults.map(r => r.peakWaiting)),
      overflowMinutes: mean(repSiteResults.map(r => r.overflowMinutes)),
      overflowPct: mean(repSiteResults.map(r => r.overflowPct)),
      meanWaitingPeople: mean(repSiteResults.map(r => r.meanWaitingPeople)),
      utilization: mean(repSiteResults.map(r => r.utilization)),
      receptionUtilization: mean(repSiteResults.map(r => r.receptionUtilization)),
      completedByClose: mean(repSiteResults.map(r => r.completedByClose))
    };
  }

  function summarizeNetwork(shepSummary, finchSummary, openMinutes) {
    const patients = shepSummary.patients.concat(finchSummary.patients);
    const waits = patients.map(p => p.queueWait);
    const elapsed = patients.map(p => p.elapsedToProcedure);
    const hourBuckets = Array.from({length: Math.ceil(openMinutes / 60)}, () => []);
    for (const p of patients) {
      const hour = clamp(Math.floor(p.arrival / 60), 0, hourBuckets.length - 1);
      hourBuckets[hour].push(p.queueWait);
    }
    return {
      patients,
      totalPatientsPerDay: shepSummary.count + finchSummary.count,
      averageQueueWait: mean(waits),
      p90QueueWait: percentile(waits, 0.9),
      averageElapsedToProcedure: mean(elapsed),
      p90ElapsedToProcedure: percentile(elapsed, 0.9),
      peakWaiting: Math.max(shepSummary.peakWaiting, finchSummary.peakWaiting),
      overflowMinutes: shepSummary.overflowMinutes + finchSummary.overflowMinutes,
      overflowPct: (shepSummary.overflowPct + finchSummary.overflowPct) / 2,
      completedByClose: shepSummary.completedByClose + finchSummary.completedByClose,
      hourlyWait: hourBuckets.map(mean)
    };
  }

  function simulateNetwork(cfg, routePct, extraStaff, reps) {
    const openMinutes = cfg.openHours * 60;
    const baseShepRep = [];
    const baseFinchRep = [];
    const scnShepRep = [];
    const scnFinchRep = [];
    for (let rep = 0; rep < reps; rep++) {
      const seedBase = 8137 + rep * 7919;
      const shepArrivalProfiles = cfg.useObservedArrivals ? buildObservedArrivalProfiles("Sheppard", openMinutes) : null;
      const finchArrivalProfiles = cfg.useObservedArrivals ? buildObservedArrivalProfiles("Finch", openMinutes) : null;
      const arrivalsShep = generatePatients("Sheppard", cfg.shepDemand, cfg.shepBooking, openMinutes, makeRng(seedBase + 11), cfg.bookedPattern, shepArrivalProfiles);
      const arrivalsFinch = generatePatients("Finch", cfg.finchDemand, cfg.finchBooking, openMinutes, makeRng(seedBase + 29), cfg.bookedPattern, finchArrivalProfiles);
      const shepBase = simulateSite(arrivalsShep, { staff: cfg.shepStaff, receptionists: cfg.shepReceptionists, seats: cfg.shepSeats, serviceMean: cfg.shepService, serviceCv: cfg.procedureCv }, cfg.intakeTime, cfg.intakeCv, openMinutes, seedBase + 101);
      const finchBase = simulateSite(arrivalsFinch, { staff: cfg.finchStaff, receptionists: cfg.finchReceptionists, seats: cfg.finchSeats, serviceMean: cfg.finchService, serviceCv: cfg.procedureCv }, cfg.intakeTime, cfg.intakeCv, openMinutes, seedBase + 203);
      baseShepRep.push(shepBase);
      baseFinchRep.push(finchBase);

      const candidates = arrivalsShep.filter(p => p.mode === "Walk-in" && p.arrival + cfg.travelTime < openMinutes);
      const selectionRng = makeRng(seedBase + 307);
      const chosenIds = new Set(candidates.filter(() => selectionRng() < routePct / 100).map(p => p.id));
      const routedToFinch = [];
      const stayAtSheppard = [];
      for (const p of arrivalsShep) {
        if (chosenIds.has(p.id)) {
          const travel = cfg.travelTime;
          routedToFinch.push({ ...p, site: "Finch", arrival: p.arrival + travel, originArrival: p.originArrival, originSite: "Sheppard", redirected: true, travelTime: travel });
        } else {
          stayAtSheppard.push({ ...p, redirected: false, travelTime: 0 });
        }
      }
      const scenarioFinchArrivals = arrivalsFinch.concat(routedToFinch).sort((a, b) => a.arrival - b.arrival);
      const shepScn = simulateSite(stayAtSheppard, { staff: cfg.shepStaff + (extraStaff ? 1 : 0), receptionists: cfg.shepReceptionists, seats: cfg.shepSeats, serviceMean: cfg.shepService, serviceCv: cfg.procedureCv }, cfg.intakeTime, cfg.intakeCv, openMinutes, seedBase + 101);
      const finchScn = simulateSite(scenarioFinchArrivals, { staff: cfg.finchStaff, receptionists: cfg.finchReceptionists, seats: cfg.finchSeats, serviceMean: cfg.finchService, serviceCv: cfg.procedureCv }, cfg.intakeTime, cfg.intakeCv, openMinutes, seedBase + 203);
      scnShepRep.push(shepScn);
      scnFinchRep.push(finchScn);
    }
    const baselineShep = summarizeSite(baseShepRep);
    const baselineFinch = summarizeSite(baseFinchRep);
    const scenarioShep = summarizeSite(scnShepRep);
    const scenarioFinch = summarizeSite(scnFinchRep);
    return {
      cfg, routePct, extraStaff, reps, openMinutes,
      baseline: { shep: baselineShep, finch: baselineFinch, network: summarizeNetwork(baselineShep, baselineFinch, openMinutes) },
      scenario: { shep: scenarioShep, finch: scenarioFinch, network: summarizeNetwork(scenarioShep, scenarioFinch, openMinutes) }
    };
  }

  function siteCard(title, note, base, scn) {
    return `<article class="site-card"><h3>${title}</h3><p class="site-subtitle">${note}</p><dl class="metrics-list">
      <dt>Before changes: average wait</dt><dd>${fmt(base.averageQueueWait)}</dd>
      <dt>With changes: average wait</dt><dd>${fmt(scn.averageQueueWait)}</dd>
      <dt>Longer-wait estimate</dt><dd>${fmt(scn.p90QueueWait)}</dd>
      <dt>Procedure staff use</dt><dd>${fmtNum(scn.utilization, 0)}%</dd>
      <dt>Reception staff use</dt><dd>${fmtNum(scn.receptionUtilization, 0)}%</dd>
      <dt>Peak people waiting</dt><dd>${fmtNum(scn.peakWaiting, 1)}</dd>
      <dt>Minutes with more people waiting than seats</dt><dd>${fmtNum(scn.overflowMinutes, 0)}</dd>
    </dl></article>`;
  }

  function renderHourly(net, openHours) {
    const bucketCount = net.hourlyWait.length;
    const max = Math.max(1, ...net.hourlyWait);
    const rows = net.hourlyWait.map((w, i) => {
      const label = `Hour ${i + 1}`;
      const width = Math.max(0, w / max * 100);
      return `<li class="chart-row"><span class="chart-label">${label}</span><span class="bar-track" aria-hidden="true"><span class="bar-fill" style="width:${width}%"></span></span><span class="chart-value">${w.toFixed(1)} min</span></li>`;
    }).join("");
    $("#hourly-chart").innerHTML = `<ol class="chart-list" aria-label="Typical wait by hour">${rows}</ol><p class="muted small" style="margin:14px 0 0">${bucketCount} arrival periods shown. The busiest period depends on the configured demand and arrival pattern.</p>`;
  }

  function renderCoordination(results) {
    const b = results.baseline.network;
    const s = results.scenario.network;
    $("#coord-base-elapsed").textContent = fmt(b.averageElapsedToProcedure);
    $("#coord-scenario-elapsed").textContent = fmt(s.averageElapsedToProcedure);
    const elapsedDelta = s.averageElapsedToProcedure - b.averageElapsedToProcedure;
    $("#coord-elapsed-delta").textContent = `${fmtDelta(elapsedDelta)} versus baseline`;
    $("#coord-wait-delta").textContent = fmtDelta(s.averageQueueWait - b.averageQueueWait);
    $("#coord-overflow").textContent = `${fmtNum(s.overflowMinutes, 0)} min`;
    $("#coord-overflow-delta").textContent = `${fmtDelta(s.overflowMinutes - b.overflowMinutes)} versus baseline`;
    const rows = [];
    for (const [name, key] of [["Bathurst–Sheppard", "shep"], ["Bathurst–Finch", "finch"]]) {
      const bm = results.baseline[key]; const sm = results.scenario[key];
      rows.push([`${name} — mean queue wait`, bm.averageQueueWait, sm.averageQueueWait, sm.averageQueueWait - bm.averageQueueWait, "min"]);
      rows.push([`${name} — 90th percentile queue wait`, bm.p90QueueWait, sm.p90QueueWait, sm.p90QueueWait - bm.p90QueueWait, "min"]);
      rows.push([`${name} — peak people waiting`, bm.peakWaiting, sm.peakWaiting, sm.peakWaiting - bm.peakWaiting, "people"]);
      rows.push([`${name} — minutes above seat capacity`, bm.overflowMinutes, sm.overflowMinutes, sm.overflowMinutes - bm.overflowMinutes, "min"]);
    }
    rows.push(["Network — average time to procedure", b.averageElapsedToProcedure, s.averageElapsedToProcedure, s.averageElapsedToProcedure - b.averageElapsedToProcedure, "min"]);
    $("#coord-table-body").innerHTML = rows.map(r => `<tr><td>${r[0]}</td><td class="num">${r[1].toFixed(1)} ${r[4]}</td><td class="num">${r[2].toFixed(1)} ${r[4]}</td><td class="num">${fmtDelta(r[3], r[4])}</td></tr>`).join("");
  }

  function renderExperience(results) {
    const net = results.scenario.network;
    const avgWait = net.averageQueueWait;
    const uncertainty = Number($("#updates").value);
    const visibleEstimate = $("#estimate-visible").checked;
    const explained = $("#queue-explained").checked;
    const occupied = $("#occupied-time").checked;
    const privacy = $("#privacy-practice").checked;
    const waitPoints = 45 * clamp(avgWait / 60, 0, 1);
    const uncertaintyPoints = 25 * (uncertainty === 0 ? 1 : uncertainty === 1 ? 0.5 : 0.15) * (visibleEstimate ? 0.65 : 1);
    const crowdingPoints = 20 * clamp(net.overflowPct / 40, 0, 1);
    const clarityPoints = (explained ? 0 : 7) + (occupied ? 0 : 3);
    const privacyPoints = privacy ? 0 : 3;
    const score = clamp(waitPoints + uncertaintyPoints + crowdingPoints + clarityPoints + privacyPoints, 0, 100);
    $("#experience-score").textContent = Math.round(score);
    $("#experience-fill").style.width = `${score}%`;
    $("#experience-level").textContent = score < 25 ? "Lower modeled friction" : score < 55 ? "Moderate modeled friction" : "Higher modeled friction";
    const recommendations = [];
    if (avgWait > 20) recommendations.push(["Address the underlying queue", `The scenario estimates ${avgWait.toFixed(1)} minutes of average queue waiting. Test peak-period slot spacing, staffing coverage, intake duration, and procedure-time variation before relying on communication alone.`]);
    if (net.overflowPct > 5) recommendations.push(["Plan for seat pressure", `Waiting exceeds configured seat capacity for an estimated ${net.overflowPct.toFixed(1)}% of operating minutes across the two sites on average. Review accessibility seating, safe circulation, and whether people are asked to wait elsewhere.`]);
    if (uncertainty < 2 || !visibleEstimate) recommendations.push(["Make updates predictable", "Provide a current wait range and a stated update cadence. Explain delays promptly; do not present uncertain estimates as guarantees."]);
    if (!explained) recommendations.push(["Explain the queue order", "Describe how appointment and walk-in arrivals are handled, and how legitimate clinical exceptions work. Keep the explanation brief and consistent."]);
    if (!occupied) recommendations.push(["Offer optional occupied time", "Provide useful preparation information or other low-effort, accessible activities. Treat this as an experience improvement, not a capacity intervention."]);
    if (!privacy) recommendations.push(["Review privacy at intake", "Use discreet identity checks and patient calling practices, and avoid announcing sensitive details in a shared waiting area."]);
    if (privacy && explained && occupied && uncertainty === 2 && visibleEstimate && avgWait <= 20 && net.overflowPct <= 5) recommendations.push(["Validate what is working", "The current assumptions and experience choices show lower modeled friction. Validate this with short patient surveys and observed timestamps before adopting it."]);
    $("#experience-recommendations").innerHTML = recommendations.map(([title, body]) => `<div class="recommendation"><h4>${title}</h4><p>${body}</p></div>`).join("");
  }

  function renderResults(results) {
    latestResults = results;
    const b = results.baseline.network;
    const s = results.scenario.network;
    $("#kpi-avg").textContent = fmt(s.averageQueueWait);
    $("#kpi-avg-delta").textContent = `${fmtDelta(s.averageQueueWait - b.averageQueueWait)} change from current setup`;
    $("#kpi-p90").textContent = fmt(s.p90QueueWait);
    $("#kpi-elapsed").textContent = fmt(s.averageElapsedToProcedure);
    $("#kpi-peak").textContent = `${fmtNum(s.peakWaiting, 1)} people`;
    $("#kpi-overflow").textContent = `${fmtNum(s.overflowMinutes, 0)} minutes per day with more people waiting than seats across both sites`;
    $("#site-cards").innerHTML = siteCard("Bathurst–Sheppard", `${results.cfg.shepDemand} assumed arrivals/day; ${results.cfg.shepReceptionists} reception staff; ${results.cfg.shepStaff + (results.extraStaff ? 1 : 0)} procedure staff in scenario`, results.baseline.shep, results.scenario.shep)
      + siteCard("Bathurst–Finch", `${results.cfg.finchDemand} assumed arrivals/day; ${results.cfg.finchReceptionists} reception staff; staffing and demand require validation`, results.baseline.finch, results.scenario.finch);
    renderHourly(s, results.cfg.openHours);
    renderCoordination(results);
    renderExperience(results);
    const cfg = results.cfg;
    const routeText = results.routePct === 0 ? "No walk-ins rerouted" : `${results.routePct}% of eligible Sheppard walk-ins modeled as choosing Finch`;
    const staffText = results.extraStaff ? "one additional Sheppard procedure staff member in scenario" : "no added Sheppard staff in scenario";
    const bookingText = cfg.bookedPattern === "morning" ? "60% of booked arrivals in first 3 hours" : "booked arrivals evenly spaced across day";
    const shepProfileReady = cfg.useObservedArrivals ? Boolean(buildObservedArrivalProfiles("Sheppard", results.openMinutes)) : false;
    const finchProfileReady = cfg.useObservedArrivals ? Boolean(buildObservedArrivalProfiles("Finch", results.openMinutes)) : false;
    const arrivalText = cfg.useObservedArrivals && shepProfileReady && finchProfileReady ? "site-specific arrival profiles pooled across imported rows" : cfg.useObservedArrivals ? "selected pattern retained where observed sample is too small" : "modelled arrival pattern; not calibrated to timestamps";
    $("#assumption-summary").innerHTML = `<span><strong>Daily arrivals:</strong> ${cfg.shepDemand} at Sheppard; ${cfg.finchDemand} at Finch (assumed)</span><span><strong>Reception staff:</strong> ${cfg.shepReceptionists} at Sheppard; ${cfg.finchReceptionists} at Finch</span><span><strong>Procedure staff:</strong> ${cfg.shepStaff} at Sheppard; ${cfg.finchStaff} at Finch (assumed)</span><span><strong>Booking pattern:</strong> ${bookingText}</span><span><strong>Arrival data:</strong> ${arrivalText}</span><span><strong>Routing:</strong> ${routeText}</span><span><strong>Scenario:</strong> ${staffText}</span><span><strong>Replications:</strong> ${results.reps} per scenario</span>`;
    $("#overview-status").textContent = `Estimates refreshed across ${results.reps} simulated days. These are planning estimates, not live wait times.`;
  }

  function runModel(statusTarget = "#simulation-status") {
    const btns = [$("#run-simulation"), $("#run-overview"), $("#find-routing")];
    btns.forEach(b => { if (b) b.disabled = true; });
    const status = $(statusTarget);
    if (status) status.textContent = "Running simulation…";
    try {
      const cfg = readConfig();
      const results = simulateNetwork(cfg, cfg.redirectShare, cfg.extraStaff, cfg.replications);
      renderResults(results);
      const arrivalDataReady = !cfg.useObservedArrivals || (buildObservedArrivalProfiles("Sheppard", cfg.openHours * 60) && buildObservedArrivalProfiles("Finch", cfg.openHours * 60));
      if (status) status.textContent = `Complete: ${cfg.replications} replications per baseline and selected scenario.${cfg.useObservedArrivals ? arrivalDataReady ? " Pooled observed arrival profiles were used." : " At least 30 arrival records per site are required; the model used its standard arrival pattern where data were insufficient." : ""}`;
      $("#overview-status").textContent = `Estimates refreshed across ${cfg.replications} simulated days. These are planning estimates, not live wait times.`;
    } catch (error) {
      if (status) status.textContent = `The model could not run: ${error.message}`;
    } finally {
      btns.forEach(b => { if (b) b.disabled = false; });
    }
  }

  function findRoutingShare() {
    const cfg = readConfig();
    const status = $("#routing-status");
    const button = $("#find-routing");
    button.disabled = true;
    status.textContent = "Testing candidate routing shares…";
    const candidates = [0, 10, 20, 30, 40];
    const reps = Math.max(10, Math.min(15, cfg.replications));
    let best = null;
    for (const pct of candidates) {
      const result = simulateNetwork(cfg, pct, cfg.extraStaff, reps);
      const net = result.scenario.network;
      const objective = net.averageElapsedToProcedure + net.overflowPct * 0.25;
      if (!best || objective < best.objective) best = { pct, objective, result };
    }
    $("#redirect-share").value = best.pct;
    runModel("#routing-status");
    status.textContent = `Candidate: ${best.pct}% of Sheppard walk-ins. Search objective = mean time to procedure + 0.25 minutes per seat-overflow percentage point; tested ${candidates.map(v => `${v}%`).join(", ")} using ${reps} replications each. Validate with observed data before using.`;
    button.disabled = false;
  }

  function exportResults() {
    if (!latestResults) { $("#overview-status").textContent = "Run the model before exporting results."; return; }
    const rows = [["scenario", "site", "measure", "value", "unit"]];
    for (const [scenarioName, group] of [["baseline", latestResults.baseline], ["selected_scenario", latestResults.scenario]]) {
      for (const [siteName, metrics] of [["Bathurst-Sheppard", group.shep], ["Bathurst-Finch", group.finch], ["network", group.network]]) {
        rows.push([scenarioName, siteName, "average_queue_wait", metrics.averageQueueWait.toFixed(2), "minutes"]);
        rows.push([scenarioName, siteName, "p90_queue_wait", metrics.p90QueueWait.toFixed(2), "minutes"]);
        rows.push([scenarioName, siteName, "average_time_to_procedure", metrics.averageElapsedToProcedure.toFixed(2), "minutes"]);
        rows.push([scenarioName, siteName, "peak_waiting_people", metrics.peakWaiting.toFixed(2), "people"]);
        rows.push([scenarioName, siteName, "seat_overflow_minutes", metrics.overflowMinutes.toFixed(2), "minutes"]);
      }
    }
    const csv = rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "north-york-patient-flow-results.csv"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    $("#overview-status").textContent = "Results CSV exported from this browser.";
  }

  function parseCsv(text) {
    const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) throw new Error("The CSV needs a header and at least one data row.");
    const parseLine = (line) => {
      const fields = []; let field = ""; let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"' && inQuotes && line[i + 1] === '"') { field += '"'; i++; }
        else if (ch === '"') inQuotes = !inQuotes;
        else if (ch === "," && !inQuotes) { fields.push(field.trim()); field = ""; }
        else field += ch;
      }
      fields.push(field.trim());
      return fields;
    };
    const headers = parseLine(lines[0]).map(h => h.toLowerCase());
    const required = ["site", "arrival_min", "intake_start_min", "intake_end_min", "procedure_start_min", "completion_min"];
    const missing = required.filter(h => !headers.includes(h));
    if (missing.length) throw new Error(`Missing required columns: ${missing.join(", ")}.`);
    const values = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = parseLine(lines[i]);
      if (parts.every(p => p === "")) continue;
      const row = {};
      headers.forEach((h, j) => row[h] = parts[j] ?? "");
      const siteText = String(row.site).toLowerCase();
      const site = siteText.includes("sheppard") ? "Sheppard" : siteText.includes("finch") ? "Finch" : null;
      if (!site) throw new Error(`Row ${i + 1}: site must contain “Sheppard” or “Finch”.`);
      const numeric = {};
      for (const key of required.slice(1)) {
        const n = Number(row[key]);
        if (row[key] === "" || !Number.isFinite(n) || n < 0) throw new Error(`Row ${i + 1}: ${key} must be a non-negative number.`);
        numeric[key] = n;
      }
      if (!(numeric.arrival_min <= numeric.intake_start_min && numeric.intake_start_min <= numeric.intake_end_min && numeric.intake_end_min <= numeric.procedure_start_min && numeric.procedure_start_min <= numeric.completion_min)) {
        throw new Error(`Row ${i + 1}: timestamps must be in chronological order.`);
      }
      const rawMode = String(row.mode || "").toLowerCase();
      const mode = /walk/.test(rawMode) ? "Walk-in" : /(book|appoint|scheduled)/.test(rawMode) ? "Booked" : "Unknown";
      values.push({ site, mode, arrival: numeric.arrival_min, intakeStart: numeric.intake_start_min, intakeEnd: numeric.intake_end_min, procedureStart: numeric.procedure_start_min, completion: numeric.completion_min, queueWait: (numeric.intake_start_min - numeric.arrival_min) + (numeric.procedure_start_min - numeric.intake_end_min), elapsed: numeric.procedure_start_min - numeric.arrival_min, intakeDuration: numeric.intake_end_min - numeric.intake_start_min, procedureDuration: numeric.completion_min - numeric.procedure_start_min });
    }
    if (!values.length) throw new Error("No usable data rows were found.");
    return values;
  }

  function renderObserved() {
    const grouped = { Sheppard: observedRows.filter(r => r.site === "Sheppard"), Finch: observedRows.filter(r => r.site === "Finch") };
    const summaries = {};
    for (const [site, rows] of Object.entries(grouped)) {
      if (!rows.length) continue;
      summaries[site] = {
        n: rows.length,
        meanQueue: mean(rows.map(r => r.queueWait)),
        medianQueue: percentile(rows.map(r => r.queueWait), 0.5),
        p90Queue: percentile(rows.map(r => r.queueWait), 0.9),
        meanElapsed: mean(rows.map(r => r.elapsed)),
        meanIntake: mean(rows.map(r => r.intakeDuration)),
        meanProcedure: mean(rows.map(r => r.procedureDuration))
      };
    }
    observedStats = summaries;
    const rowsHtml = Object.entries(summaries).map(([site, s]) => `<tr><th scope="row">Bathurst–${site}</th><td class="num">${s.n}</td><td class="num">${fmt(s.meanQueue)}</td><td class="num">${fmt(s.medianQueue)}</td><td class="num">${fmt(s.p90Queue)}</td><td class="num">${fmt(s.meanProcedure)}</td></tr>`).join("");
    $("#observed-summary").innerHTML = `<div class="table-wrap"><table><caption class="sr-only">Observed wait summaries from the loaded anonymized CSV.</caption><thead><tr><th scope="col">Site</th><th scope="col" class="num">Rows</th><th scope="col" class="num">Mean queue wait</th><th scope="col" class="num">Median wait</th><th scope="col" class="num">90th percentile</th><th scope="col" class="num">Mean procedure time</th></tr></thead><tbody>${rowsHtml}</tbody></table></div><p class="muted small" style="margin-top:12px">Queue wait is time waiting before intake plus time waiting after intake, excluding intake and procedure service. “Time to procedure” includes intake handling but excludes any travel not represented in the file.</p>`;
    $("#calibration-actions").style.display = "flex";
  }

  function loadCsvFile(file) {
    const status = $("#csv-status");
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { status.textContent = "File is larger than 5 MB. Export a smaller, anonymized sample."; return; }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        observedRows = parseCsv(String(reader.result));
        renderObserved();
        status.textContent = `Loaded ${observedRows.length} anonymized rows in this browser. No upload was made.`;
      } catch (err) {
        observedRows = []; observedStats = null;
        $("#observed-summary").innerHTML = `<p class="muted">No valid data loaded.</p>`;
        $("#calibration-actions").style.display = "none";
        status.textContent = `Could not read the CSV: ${err.message}`;
      }
    };
    reader.onerror = () => { status.textContent = "Could not read this file in the browser."; };
    reader.readAsText(file);
  }

  function downloadCsv(name, csv) {
    const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  function applyObservedService() {
    if (!observedStats) return;
    const cfg = readConfig();
    if (observedStats.Sheppard) cfg.shepService = clamp(observedStats.Sheppard.meanProcedure, 2, 40);
    if (observedStats.Finch) cfg.finchService = clamp(observedStats.Finch.meanProcedure, 2, 40);
    const allRows = observedRows;
    const intakeDurations = allRows.map(r => r.intakeDuration);
    const procedureDurations = allRows.map(r => r.procedureDuration);
    cfg.intakeTime = clamp(mean(intakeDurations), 0.5, 15);
    cfg.intakeCv = clamp(coefficientOfVariation(intakeDurations, cfg.intakeTime), 0.05, 1.5);
    cfg.procedureCv = clamp(coefficientOfVariation(procedureDurations, mean(procedureDurations)), 0.1, 1.5);
    setFormValues(cfg);
    $("#csv-status").textContent = "Observed mean service times and variability applied. To use observed arrival timing too, enable the arrival-profile option in Simulation. Daily volume and staffing remain editable.";
    runModel("#simulation-status");
  }

  function clearObserved() {
    observedRows = []; observedStats = null;
    $("#csv-file").value = "";
    $("#observed-summary").innerHTML = `<p class="muted">Load an anonymized CSV to calculate actual wait and service-time summaries. No patient-level data will be retained after you refresh the page.</p>`;
    $("#calibration-actions").style.display = "none";
    $("#csv-status").textContent = "Imported data cleared from this browser session.";
  }

  function applyFontSize(size) {
    const allowed = ["small", "medium", "large"];
    const selected = allowed.includes(size) ? size : "medium";
    document.documentElement.dataset.fontSize = selected;
    $$(".font-size-option").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.fontOption === selected)));
  }

  function applyTheme(theme) {
    const selected = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = selected;
    const button = $("#theme-toggle");
    button.textContent = selected === "dark" ? "Light mode" : "Dark mode";
    button.setAttribute("aria-pressed", String(selected === "dark"));
    button.setAttribute("aria-label", selected === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }

  function setActiveView(viewName) {
    $$(".nav-tabs button").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.view === viewName)));
    const insightViews = ["view-insights", "view-coordination", "view-data"];
    $$(".view").forEach(section => {
      const shouldShow = viewName === "insights" ? insightViews.includes(section.id) : section.id === `view-${viewName}`;
      section.classList.toggle("active", shouldShow);
    });
    const section = document.getElementById(viewName === "insights" ? "view-insights" : `view-${viewName}`);
    if (section) section.focus({preventScroll:true});
  }

  $$(".nav-tabs button").forEach(button => button.addEventListener("click", () => setActiveView(button.dataset.view)));
  $$(".font-size-option").forEach(button => button.addEventListener("click", () => applyFontSize(button.dataset.fontOption)));
  $("#theme-toggle").addEventListener("click", () => applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
  $("#run-simulation").addEventListener("click", () => runModel("#simulation-status"));
  $("#run-overview").addEventListener("click", () => runModel("#overview-status"));
  $("#export-results").addEventListener("click", exportResults);
  $("#find-routing").addEventListener("click", findRoutingShare);
  $("#reset-defaults").addEventListener("click", () => { setFormValues(defaults); runModel("#simulation-status"); });
  $("#csv-file").addEventListener("change", event => loadCsvFile(event.target.files && event.target.files[0]));
  $("#apply-observed-service").addEventListener("click", applyObservedService);
  $("#clear-observed").addEventListener("click", clearObserved);
  $("#download-template").addEventListener("click", () => {
    const sample = [
      "site,arrival_min,intake_start_min,intake_end_min,procedure_start_min,completion_min,mode",
      "Sheppard,24,30,32,47,54,walk-in",
      "Sheppard,35,35,37,51,58,booked",
      "Finch,41,41,43,49,57,booked",
      "Finch,52,55,57,68,76,walk-in"
    ].join("\r\n");
    downloadCsv("north-york-lab-observed-data-template.csv", sample);
  });
  ["updates", "estimate-visible", "queue-explained", "occupied-time", "privacy-practice"].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener("change", () => { if (latestResults) renderExperience(latestResults); });
  });

  runModel("#overview-status");
})();
