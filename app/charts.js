// Inline SVG charts, drawn by hand — no chart library, no network.
// Both functions return an SVG string ready to drop into the page.

// A donut chart of spending by category. `segments` is an array of
// { label, value, color }. Slices under 2% are folded into "Other" by the
// caller; this function just draws what it is given.
export function donutChart(segments, size = 260) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const outer = size / 2 - 6;
  const inner = outer * 0.62;
  const label = (v) => `$${Math.round(v).toLocaleString('en-US')}`;

  if (total <= 0) {
    return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="No spending yet" class="chart-svg">
      <circle cx="${cx}" cy="${cy}" r="${(outer + inner) / 2}" fill="none" stroke="#e3ddd0" stroke-width="${outer - inner}"/>
      <text x="${cx}" y="${cy}" text-anchor="middle" class="donut-center">$0</text></svg>`;
  }

  let angle = -Math.PI / 2;
  const paths = segments.map((s) => {
    const frac = s.value / total;
    const sweep = frac * Math.PI * 2;
    const large = sweep > Math.PI ? 1 : 0;
    angle += sweep;
    // A 1.5-degree gap between slices keeps the ring readable.
    const gap = 0.026;
    const gx1 = cx + outer * Math.cos(angle - sweep + gap);
    const gy1 = cy + outer * Math.sin(angle - sweep + gap);
    const gx2 = cx + outer * Math.cos(angle - gap);
    const gy2 = cy + outer * Math.sin(angle - gap);
    const gx3 = cx + inner * Math.cos(angle - gap);
    const gy3 = cy + inner * Math.sin(angle - gap);
    const gx4 = cx + inner * Math.cos(angle - sweep + gap);
    const gy4 = cy + inner * Math.sin(angle - sweep + gap);
    const d =
      frac >= 0.999
        ? `M ${cx - outer} ${cy} a ${outer} ${outer} 0 1 0 ${outer * 2} 0 a ${outer} ${outer} 0 1 0 ${-outer * 2} 0 ` +
          `M ${cx - inner} ${cy} a ${inner} ${inner} 0 1 1 ${inner * 2} 0 a ${inner} ${inner} 0 1 1 ${-inner * 2} 0`
        : `M ${gx1} ${gy1} A ${outer} ${outer} 0 ${large} 1 ${gx2} ${gy2} L ${gx3} ${gy3} A ${inner} ${inner} 0 ${large} 0 ${gx4} ${gy4} Z`;
    return `<path d="${d}" fill="${s.color}"><title>${s.label}: ${label(s.value)}</title></path>`;
  });

  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category" class="chart-svg">
    ${paths.join('\n    ')}
    <text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-center">${label(total)}</text>
    <text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-sub">spent in Nov</text></svg>`;
}

// A grouped bar chart: income vs spending for each month in `months`
// ({ month, income, spending }). November is appended by the caller with
// live figures. Bars are drawn to a shared scale with a $2,000 gridline step.
export function trendChart(months, width = 560, height = 260) {
  const padLeft = 52;
  const padBottom = 26;
  const padTop = 12;
  const plotW = width - padLeft - 8;
  const plotH = height - padTop - padBottom;
  const maxVal = Math.max(...months.flatMap((m) => [m.income, m.spending]), 2000);
  const scaleMax = Math.ceil(maxVal / 2000) * 2000;
  const y = (v) => padTop + plotH - (v / scaleMax) * plotH;

  const gridlines = [];
  for (let v = 0; v <= scaleMax; v += 2000) {
    gridlines.push(
      `<line x1="${padLeft}" y1="${y(v)}" x2="${width - 8}" y2="${y(v)}" class="grid-line"/>
      <text x="${padLeft - 8}" y="${y(v) + 4}" text-anchor="end" class="axis-label">$${(v / 1000).toFixed(0)}k</text>`,
    );
  }

  const slot = plotW / months.length;
  const barW = Math.min(26, slot / 3.4);
  const bars = months
    .map((m, i) => {
      const cx = padLeft + slot * i + slot / 2;
      return `<rect x="${(cx - barW - 3).toFixed(1)}" y="${y(m.income).toFixed(1)}" width="${barW}" height="${(plotH - (y(m.income) - padTop)).toFixed(1)}" rx="3" fill="#2e7d5b"><title>${m.month} income $${m.income.toLocaleString('en-US')}</title></rect>
      <rect x="${(cx + 3).toFixed(1)}" y="${y(m.spending).toFixed(1)}" width="${barW}" height="${(plotH - (y(m.spending) - padTop)).toFixed(1)}" rx="3" fill="#d97706"><title>${m.month} spending $${m.spending.toLocaleString('en-US')}</title></rect>
      <text x="${cx.toFixed(1)}" y="${height - 8}" text-anchor="middle" class="axis-label">${m.month}</text>`;
    })
    .join('\n    ');

  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Monthly income versus spending, June to November" class="chart-svg trend">
    ${gridlines.join('\n    ')}
    ${bars}
    <g class="trend-legend" transform="translate(${padLeft}, 2)">
      <rect x="0" y="0" width="10" height="10" rx="2" fill="#2e7d5b"/><text x="14" y="9">Income</text>
      <rect x="76" y="0" width="10" height="10" rx="2" fill="#d97706"/><text x="90" y="9">Spending</text>
    </g></svg>`;
}

// A thin horizontal progress bar (used for budgets and goals). `pct` is 0–100+
// and `tone` picks the colour: "good" green, "warn" amber, "over" red.
export function progressBar(pct, tone) {
  const clamped = Math.max(0, Math.min(100, pct));
  return `<div class="bar" role="progressbar" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100">
    <div class="bar-fill bar-${tone}" style="width:${clamped}%"></div></div>`;
}
