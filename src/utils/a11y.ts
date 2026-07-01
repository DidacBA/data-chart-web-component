export type ValueSeries = {
  name: string;
  points: { label: string; value: number }[];
};

export type ScatterSeries = {
  name: string;
  points: { label: string; x: number; y: number }[];
};

export type PieSeries = {
  name: string;
  points: { label: string; value: number }[];
};

let chartA11yCounter = 0;

export function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 1000) / 1000);
}

type LabeledValue = { label: string; value: number };

function orderedPoints(
  series: ValueSeries,
  categories: string[],
): LabeledValue[] {
  if (categories.length > 0) {
    return categories
      .map(cat => series.points.find(p => p.label === cat))
      .filter((p): p is LabeledValue => !!p);
  }
  return series.points;
}

function describeExtremes(points: LabeledValue[], valueLabel: string): string {
  if (points.length === 0) return '';

  let highest = points[0];
  let lowest = points[0];
  for (const point of points) {
    if (point.value > highest.value) highest = point;
    if (point.value < lowest.value) lowest = point;
  }

  const val = valueLabel || 'value';
  if (highest.value === lowest.value) {
    return `all ${val}s are ${formatNumber(highest.value)}`;
  }

  return `highest ${val} ${formatNumber(highest.value)} at ${highest.label}, lowest ${formatNumber(lowest.value)} at ${lowest.label}`;
}

function describeTrend(points: LabeledValue[]): string {
  if (points.length < 2) return '';

  const first = points[0];
  const last = points[points.length - 1];
  const values = points.map(p => p.value);
  const range = Math.max(...values) - Math.min(...values);
  const threshold = range > 0 ? range * 0.08 : 0;
  const delta = last.value - first.value;

  const nonDecreasing = values.every((v, i) => i === 0 || v >= values[i - 1] - 0.001);
  const nonIncreasing = values.every((v, i) => i === 0 || v <= values[i - 1] + 0.001);

  if (nonDecreasing && delta > threshold) {
    return `trending up from ${first.label} to ${last.label}`;
  }
  if (nonIncreasing && delta < -threshold) {
    return `trending down from ${first.label} to ${last.label}`;
  }
  if (Math.abs(delta) <= threshold) {
    return 'relatively stable overall';
  }
  return 'fluctuating across categories';
}

function seriesFindings(
  series: ValueSeries,
  categories: string[],
  valueLabel: string,
): string {
  const points = orderedPoints(series, categories);
  if (points.length === 0) return '';

  const extremes = describeExtremes(points, valueLabel);
  const trend = describeTrend(points);
  const prefix = series.name ? `${series.name}: ` : '';

  return trend ? `${prefix}${extremes}; ${trend}` : `${prefix}${extremes}`;
}

function stackedTotalFindings(
  series: ValueSeries[],
  categories: string[],
  valueLabel: string,
): string {
  if (categories.length === 0) return '';

  const totals = categories.map(category => ({
    label: category,
    value: series.reduce(
      (sum, s) => sum + (s.points.find(p => p.label === category)?.value ?? 0),
      0,
    ),
  }));

  const val = valueLabel || 'value';
  const extremes = describeExtremes(totals, val);
  const trend = describeTrend(totals);
  return trend
    ? `Combined total: ${extremes}; ${trend}`
    : `Combined total: ${extremes}`;
}

function formatPointList(
  points: LabeledValue[],
  categoryLabel: string,
  valueLabel: string,
): string {
  const cat = categoryLabel || 'category';
  const val = valueLabel || 'value';
  return points
    .map(p => `${p.label || cat} ${val} ${formatNumber(p.value)}`)
    .join(', ');
}

function seriesDataDescription(
  series: ValueSeries[],
  categories: string[],
  categoryLabel: string,
  valueLabel: string,
): string {
  const hasNamedSeries = series.length > 1 || !!series[0]?.name;

  if (!hasNamedSeries) {
    const points = series[0]?.points ?? [];
    const data = formatPointList(points, categoryLabel, valueLabel);
    return data ? `Data: ${data}.` : '';
  }

  const parts = series.map(s => {
    const points = orderedPoints(s, categories);
    const name = s.name || 'Series';
    return `${name}: ${formatPointList(points, categoryLabel, valueLabel)}`;
  });

  return `Data: ${parts.join('. ')}.`;
}

export function spokenSeriesSummary(
  chartType: string,
  series: ValueSeries[],
  categories: string[],
  categoryLabel: string,
  valueLabel: string,
): string {
  if (series.length === 0 || series.every(s => s.points.length === 0)) {
    return chartType;
  }

  const isStacked = chartType.toLowerCase().includes('stacked');
  const findingParts = series.map(s => seriesFindings(s, categories, valueLabel)).filter(Boolean);

  if (isStacked) {
    const combined = stackedTotalFindings(series, categories, valueLabel);
    if (combined) findingParts.unshift(combined);
  }

  const findings = findingParts.length > 0
    ? `Key findings: ${findingParts.join('. ')}.`
    : '';
  const data = seriesDataDescription(series, categories, categoryLabel, valueLabel);

  return [chartType + '.', findings, data].filter(Boolean).join(' ');
}

function scatterSeriesFindings(
  series: ScatterSeries,
  xLabel: string,
  yLabel: string,
): string {
  const points = series.points;
  if (points.length === 0) return '';

  const x = xLabel || 'X';
  const y = yLabel || 'Y';

  let highestY = points[0];
  let lowestY = points[0];
  for (const point of points) {
    if (point.y > highestY.y) highestY = point;
    if (point.y < lowestY.y) lowestY = point;
  }

  const byX = [...points].sort((a, b) => a.x - b.x);
  const yTrend = describeTrend(byX.map(p => ({ label: `${x} ${formatNumber(p.x)}`, value: p.y })));

  const prefix = series.name ? `${series.name}: ` : '';
  const extremes = `highest ${y} ${formatNumber(highestY.y)} at ${x} ${formatNumber(highestY.x)}, lowest ${y} ${formatNumber(lowestY.y)} at ${x} ${formatNumber(lowestY.x)}`;

  return yTrend ? `${prefix}${extremes}; ${yTrend}` : `${prefix}${extremes}`;
}

export function spokenScatterSummary(
  series: ScatterSeries[],
  xLabel: string,
  yLabel: string,
): string {
  if (series.length === 0 || series.every(s => s.points.length === 0)) {
    return 'Scatter plot';
  }

  const x = xLabel || 'X';
  const y = yLabel || 'Y';
  const findings = series.map(s => scatterSeriesFindings(s, xLabel, yLabel)).filter(Boolean);
  const findingsText = findings.length > 0 ? `Key findings: ${findings.join('. ')}.` : '';

  const hasNamedSeries = series.length > 1 || !!series[0]?.name;
  let data: string;

  if (!hasNamedSeries) {
    const points = series[0]?.points ?? [];
    const list = points.map(p => `${x} ${formatNumber(p.x)}, ${y} ${formatNumber(p.y)}`).join('; ');
    data = list ? `Data: ${list}.` : '';
  } else {
    const parts = series.map(s => {
      const name = s.name || 'Series';
      const list = s.points.map(p => `${x} ${formatNumber(p.x)}, ${y} ${formatNumber(p.y)}`).join('; ');
      return `${name}: ${list}`;
    });
    data = `Data: ${parts.join('. ')}.`;
  }

  return ['Scatter plot.', findingsText, data].filter(Boolean).join(' ');
}

function pieSeriesFindings(s: PieSeries): string {
  const points = s.points;
  if (points.length === 0) return '';

  const total = points.reduce((sum, p) => sum + p.value, 0);
  if (total <= 0) return '';

  let largest = points[0];
  let smallest = points[0];
  for (const point of points) {
    if (point.value > largest.value) largest = point;
    if (point.value < smallest.value) smallest = point;
  }

  const largestPct = ((largest.value / total) * 100).toFixed(1);
  const smallestPct = ((smallest.value / total) * 100).toFixed(1);
  const prefix = s.name ? `${s.name}: ` : '';

  const parts = [
    `largest segment ${largest.label} at ${largestPct}%`,
    `smallest segment ${smallest.label} at ${smallestPct}%`,
  ];

  if (parseFloat(largestPct) >= 50) {
    parts.push(`${largest.label} is the majority`);
  }

  return `${prefix}${parts.join('; ')}`;
}

export function spokenPieSummary(series: PieSeries[]): string {
  const label = series.length > 1 ? 'Pie charts' : 'Pie chart';
  if (series.length === 0 || series.every(s => s.points.length === 0)) {
    return label;
  }

  const findings = series.map(s => pieSeriesFindings(s)).filter(Boolean);
  const findingsText = findings.length > 0 ? `Key findings: ${findings.join('. ')}.` : '';

  const dataParts = series.map(s => {
    const total = s.points.reduce((sum, p) => sum + p.value, 0);
    const name = s.name ? `${s.name}: ` : '';
    const list = s.points
      .map(p => {
        const pct = total > 0 ? ((p.value / total) * 100).toFixed(1) : '0.0';
        return `${p.label} ${formatNumber(p.value)}, ${pct} percent`;
      })
      .join('; ');
    return `${name}${list}`;
  });

  const data = `Data: ${dataParts.join('. ')}.`;
  return [label + '.', findingsText, data].filter(Boolean).join(' ');
}

export function seriesValueTable(
  series: ValueSeries[],
  categories: string[],
  categoryLabel: string,
  valueLabel: string,
): string {
  const catHeader = categoryLabel || 'Category';
  const valHeader = valueLabel || 'Value';
  const hasNamedSeries = series.length > 1 || !!series[0]?.name;

  if (!hasNamedSeries) {
    const points = series[0]?.points ?? [];
    return `
      <table class="chart-sr-table">
        <caption>Chart data</caption>
        <thead>
          <tr>
            <th scope="col">${escapeHtml(catHeader)}</th>
            <th scope="col">${escapeHtml(valHeader)}</th>
          </tr>
        </thead>
        <tbody>
          ${points.map(p => `<tr><th scope="row">${escapeHtml(p.label)}</th><td>${formatNumber(p.value)}</td></tr>`).join('')}
        </tbody>
      </table>
    `;
  }

  return `
    <table class="chart-sr-table">
      <caption>Chart data by series</caption>
      <thead>
        <tr>
          <th scope="col">${escapeHtml(catHeader)}</th>
          ${series.map(s => `<th scope="col">${escapeHtml(s.name || 'Series')}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${categories.map(category => `
          <tr>
            <th scope="row">${escapeHtml(category)}</th>
            ${series.map(s => {
              const point = s.points.find(p => p.label === category);
              return `<td>${point ? formatNumber(point.value) : '—'}</td>`;
            }).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

export function scatterValueTable(
  series: ScatterSeries[],
  xLabel: string,
  yLabel: string,
): string {
  const xHeader = xLabel || 'X';
  const yHeader = yLabel || 'Y';
  const hasNamedSeries = series.length > 1 || !!series[0]?.name;

  if (!hasNamedSeries) {
    const points = series[0]?.points ?? [];
    return `
      <table class="chart-sr-table">
        <caption>Scatter plot data</caption>
        <thead>
          <tr>
            <th scope="col">${escapeHtml(xHeader)}</th>
            <th scope="col">${escapeHtml(yHeader)}</th>
          </tr>
        </thead>
        <tbody>
          ${points.map(p => `<tr><td>${formatNumber(p.x)}</td><td>${formatNumber(p.y)}</td></tr>`).join('')}
        </tbody>
      </table>
    `;
  }

  return series.map(s => `
    <table class="chart-sr-table">
      <caption>${escapeHtml(s.name || 'Series')}</caption>
      <thead>
        <tr>
          <th scope="col">${escapeHtml(xHeader)}</th>
          <th scope="col">${escapeHtml(yHeader)}</th>
        </tr>
      </thead>
      <tbody>
        ${s.points.map(p => `<tr><td>${formatNumber(p.x)}</td><td>${formatNumber(p.y)}</td></tr>`).join('')}
      </tbody>
    </table>
  `).join('');
}

export function pieValueTable(series: PieSeries[]): string {
  return series.map(s => {
    const total = s.points.reduce((sum, p) => sum + p.value, 0);
    const caption = s.name || 'Chart data';
    return `
      <table class="chart-sr-table">
        <caption>${escapeHtml(caption)}</caption>
        <thead>
          <tr>
            <th scope="col">Segment</th>
            <th scope="col">Value</th>
            <th scope="col">Percent</th>
          </tr>
        </thead>
        <tbody>
          ${s.points.map(p => {
            const pct = total > 0 ? ((p.value / total) * 100).toFixed(1) : '0.0';
            return `<tr><th scope="row">${escapeHtml(p.label)}</th><td>${formatNumber(p.value)}</td><td>${pct}%</td></tr>`;
          }).join('')}
        </tbody>
      </table>
    `;
  }).join('');
}

export function chartA11yShell(
  chartClass: string,
  spokenSummary: string,
  tableMarkup: string,
  visualMarkup: string,
): string {
  const tableId = `chart-data-${++chartA11yCounter}`;
  const summary = escapeHtml(spokenSummary);

  return `
    <div class="chart ${chartClass}" part="chart" role="figure" tabindex="0" aria-label="${summary}" aria-describedby="${tableId}">
      <div class="chart-visual" aria-hidden="true">
        ${visualMarkup}
      </div>
      <div id="${tableId}" class="chart-data" part="data-table">
        <p class="chart-sr-summary" aria-live="polite">${summary}</p>
        ${tableMarkup}
      </div>
    </div>
  `;
}

export function emptyChartMarkup(message: string): string {
  const text = escapeHtml(message);
  return `<p part="empty" class="chart-empty" role="status" aria-live="polite">${text}</p>`;
}
