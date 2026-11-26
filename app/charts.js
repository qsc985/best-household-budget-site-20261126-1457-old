// Hand-drawn inline SVG charts — no chart library, no network, no canvas.
// Each function returns an SVG string the views drop straight into the page.

// A donut of spending by category, built from stroked circles: each slice
// is a circle whose dash pattern covers exactly its share of the ring.
// `slices` is [{ label, value, color }], already sorted by the caller.
export function donutChart(slices, size = 260) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const centre = size / 2;
  const radius = size / 2 - 10;
  const ring = radius * 0.62;
  const circumference = 2 * Math.PI * radius;
  const dollars = (v) => '$' + Math.round(v).toLocaleString('en-US');

  if (total <= 0) {
    return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="No spending yet" class="chart-svg">
      <circle cx="${centre}" cy="${centre}" r="${radius}" fill="none" stroke="#e7e0d0" stroke-width="${ring}"/>
      <text x="${centre}" y="${centre}" text-anchor="middle" class="donut-centre">$0</text>
    </svg>`;
  }

  // Rotate so the first slice starts at the top; each slice is offset by
  // the shares of the slices before it. A small gap keeps neighbours apart.
  let offset = 0.25; // quarter-turn: start at 12 o'clock
  const rings = slices.map((s) => {
    const share = s.value / total;
    const length = Math.max(0, share * circumference - 2);
    const svg = `<circle cx="${centre}" cy="${centre}" r="${radius}" fill="none" stroke="${s.color}"
      stroke-width="${ring}" stroke-dasharray="${length.toFixed(2)} ${circumference.toFixed(2)}"
      stroke-dashoffset="${(-offset * circumference).toFixed(2)}">
      <title>${s.label}: ${dollars(s.value)}</title></circle>`;
    offset += share;
    return svg;
  });

  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category" class="chart-svg">
    ${rings.join('\n    ')}
    <text x="${centre}" y="${centre - 2}" text-anchor="middle" class="donut-centre">${dollars(total)}</text>
    <text x="${centre}" y="${centre + 20}" text-anchor="middle" class="donut-caption">spent in November</text>
  </svg>`;
}

// Paired bars: income beside spending for each month in `months`
// ({ month, income, spending }). The scale tops out at the next $2,000
// step above the biggest bar, with a gridline at every $2,000.
export function trendChart(months, width = 560, height = 260) {
  const left = 54;
  const bottom = 28;
  const top = 14;
  const plotWidth = width - left - 10;
  const plotHeight = height - top - bottom;
  const biggest = Math.max(...months.flatMap((m) => [m.income, m.spending]), 2000);
  const ceiling = Math.ceil(biggest / 2000) * 2000;
  const yFor = (v) => top + plotHeight - (v / ceiling) * plotHeight;

  const lines = [];
  for (let v = 0; v <= ceiling; v += 2000) {
    lines.push(`<line x1="${left}" y1="${yFor(v)}" x2="${width - 10}" y2="${yFor(v)}" class="grid-line"/>
      <text x="${left - 8}" y="${yFor(v) + 4}" text-anchor="end" class="axis-label">$${v / 1000}k</text>`);
  }

  const slot = plotWidth / months.length;
  const barWidth = Math.min(24, slot / 3.6);
  const bars = months.map((m, i) => {
    const middle = left + slot * i + slot / 2;
    const incomeHeight = plotHeight - (yFor(m.income) - top);
    const spendHeight = plotHeight - (yFor(m.spending) - top);
    return `<rect x="${(middle - barWidth - 3).toFixed(1)}" y="${yFor(m.income).toFixed(1)}" width="${barWidth}"
        height="${incomeHeight.toFixed(1)}" rx="3" fill="#0f766e">
        <title>${m.month} income $${m.income.toLocaleString('en-US')}</title></rect>
      <rect x="${(middle + 3).toFixed(1)}" y="${yFor(m.spending).toFixed(1)}" width="${barWidth}"
        height="${spendHeight.toFixed(1)}" rx="3" fill="#ea580c">
        <title>${m.month} spending $${m.spending.toLocaleString('en-US')}</title></rect>
      <text x="${middle.toFixed(1)}" y="${height - 9}" text-anchor="middle" class="axis-label">${m.month}</text>`;
  }).join('\n    ');

  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Monthly income versus spending, June to November" class="chart-svg trend">
    <g class="trend-key" transform="translate(${left}, 0)">
      <rect x="0" y="0" width="10" height="10" rx="2" fill="#0f766e"/><text x="14" y="9">Income</text>
      <rect x="78" y="0" width="10" height="10" rx="2" fill="#ea580c"/><text x="92" y="9">Spending</text>
    </g>
    ${lines.join('\n    ')}
    ${bars}
  </svg>`;
}

// A slim horizontal meter for a budget or a goal. `pct` may run past 100;
// `tone` is "ok" (teal), "tight" (amber) or "over" (red).
export function meterBar(pct, tone) {
  const shown = Math.max(0, Math.min(100, pct));
  return `<div class="meter" role="progressbar" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100">
    <div class="meter-fill meter-${tone}" style="width:${shown}%"></div>
  </div>`;
}
