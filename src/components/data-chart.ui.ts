import { type ChartOptions } from '../utils/config';
import {
  chartA11yShell,
  pieValueTable,
  scatterValueTable,
  seriesValueTable,
  spokenPieSummary,
  spokenScatterSummary,
  spokenSeriesSummary,
} from '../utils/a11y';
import {
  getPlotLayout,
  polarToCartesian,
  getCategoryPosition,
  getSeriesCoordinates,
  getPieSlicePoints,
  stackedAreaPath,
  getStackedBandPosition,
  getStackedMax,
  valueToPlotPercent,
  getAxisScale,
  getScale,
  describePieSlice,
} from '../utils/ui';

export type TemplateContext = { options: ChartOptions };

export const templates = {
  root() {
    return `<div class="chart-container" part="container"></div>`;
  },
  barChart({ series, categories }: { series: { name: string; color: string; points: any[] }[]; categories: string[] }) {
    const { valueLabel, categoryLabel, showValues, showLegend } = (this as unknown as TemplateContext).options;
    const allPoints = series.flatMap(s => s.points);
    const dataMax = Math.max(...allPoints.map(p => p.value));
    const { scaleMax, xAxisTicks, gridLines } = this.scaledBarAxesMarkup(dataMax);
    const seriesCount = series.length;
    const grouped = seriesCount > 1;
    const layout = getPlotLayout(categories.length, seriesCount);

    const barsMarkup = categories.map((category, catIndex) => {
      const rowTop = getCategoryPosition(catIndex, categories.length, layout.inset);
      const bars = series.map(s => {
        const point = s.points.find(p => p.label === category);
        if (!point) return '';
        return this.barItem(point, scaleMax, showValues, grouped);
      }).join('');
      return `<div class="bar-category-row" style="--row-top: ${rowTop}%;">${bars}</div>`;
    }).join('');

    const shouldShowLegend = showLegend ?? (seriesCount > 1 || !!series[0]?.name);
    const legendMarkup = shouldShowLegend && series.some(s => s.name)
      ? `<div class="line-legend" part="legend">${series.filter(s => s.name).map(s => this.lineLegendItem(s)).join('')}</div>`
      : '';

    const visual = `
        <div class="chart-wrapper ${categoryLabel ? '' : 'chart-wrapper--no-y-label'}" part="plot">
          ${categoryLabel ? `<div class="y-axis-label" part="category-axis-label">${categoryLabel}</div>` : ''}
          <div class="y-axis-track bar-category-track" part="category-axis">
            ${this.barCategoryLabelMarkup(categories, layout.inset)}
          </div>
          <div class="chart-area" part="plot-area">
            <div class="grid-lines-vertical" part="grid">${gridLines}</div>
            <div class="bars-container" part="bars">
              ${barsMarkup}
            </div>
          </div>
        </div>
        <div class="x-axis" part="value-axis">
          <div class="x-axis-gutter" aria-hidden="true"></div>
          <div class="x-axis-panel">
            <div class="x-axis-ticks x-axis-values">${xAxisTicks}</div>
            ${valueLabel ? `<div class="x-axis-label" part="value-axis-label">${valueLabel}</div>` : ''}
          </div>
        </div>
        ${legendMarkup}`;

    return chartA11yShell(
      'bar-chart',
      spokenSeriesSummary('Bar chart', series, categories, categoryLabel, valueLabel),
      seriesValueTable(series, categories, categoryLabel, valueLabel),
      visual,
    );
  },
  scaledBarAxesMarkup(dataMax: number) {
    const { scaleMax, steps } = getScale(dataMax, (this as unknown as TemplateContext).options?.scalePadding);
    const tickPosition = (step: number) => (step / scaleMax) * 100;

    return {
      scaleMax,
      xAxisTicks: steps.map(step =>
        `<div class="x-axis-value-tick" style="--tick-position: ${tickPosition(step)}%;">${step}</div>`
      ).join(''),
      gridLines: steps.map(step =>
        `<div class="grid-line-vertical" style="--tick-position: ${tickPosition(step)}%;"></div>`
      ).join(''),
    };
  },
  barItem(point: any, scaleMax: number, showValues: boolean, grouped = false) {
    const percentage = (point.value / scaleMax) * 100;
    const groupedClass = grouped ? ' bar-item--grouped' : '';
    return `
      <div class="bar-item${groupedClass}" style="--bar-width: ${percentage}%; --bar-color: ${point.color};">
        <div class="bar-fill" part="bar"></div>
        ${showValues ? `<div class="bar-value-label" part="value-label">${point.value}</div>` : ''}
      </div>
    `;
  },
  columnChart({ series, categories }: { series: { name: string; color: string; points: any[] }[]; categories: string[] }) {
    const { valueLabel, categoryLabel, showValues, showLegend } = (this as unknown as TemplateContext).options;
    const allPoints = series.flatMap(s => s.points);
    const dataMax = Math.max(...allPoints.map(p => p.value));
    const { scaleMax, yAxisTicks, gridLines } = this.scaledAxesMarkup(dataMax);
    const seriesCount = series.length;
    const layout = getPlotLayout(categories.length, seriesCount);

    const columnsMarkup = categories.flatMap((_category, catIndex) =>
      series.map((s, seriesIndex) => {
        const point = s.points.find(p => p.label === categories[catIndex]);
        if (!point) return '';
        return this.columnItem(
          point,
          scaleMax,
          categories.length,
          catIndex,
          showValues,
          layout,
          seriesIndex,
          seriesCount,
        );
      }),
    ).join('');

    const shouldShowLegend = showLegend ?? (seriesCount > 1 || !!series[0]?.name);
    const legendMarkup = shouldShowLegend && series.some(s => s.name)
      ? `<div class="line-legend" part="legend">${series.filter(s => s.name).map(s => this.lineLegendItem(s)).join('')}</div>`
      : '';

    const visual = `
        <div class="chart-wrapper ${valueLabel ? '' : 'chart-wrapper--no-y-label'}" part="plot">
          ${valueLabel ? `<div class="y-axis-label" part="value-axis-label">${valueLabel}</div>` : ''}
          <div class="y-axis-track" part="value-axis">${yAxisTicks}</div>
          <div class="chart-area" part="plot-area">
            <div class="grid-lines" part="grid">${gridLines}</div>
            <div class="columns-container" part="columns">
              ${columnsMarkup}
            </div>
          </div>
        </div>
        <div class="x-axis" part="category-axis">
          <div class="x-axis-gutter" aria-hidden="true"></div>
          <div class="x-axis-panel">
            <div class="x-axis-ticks">
              ${this.categoryLabelMarkup(categories, layout.inset)}
            </div>
            ${categoryLabel ? `<div class="x-axis-label" part="category-axis-label">${categoryLabel}</div>` : ''}
          </div>
        </div>
        ${legendMarkup}`;

    return chartA11yShell(
      'column-chart',
      spokenSeriesSummary('Column chart', series, categories, categoryLabel, valueLabel),
      seriesValueTable(series, categories, categoryLabel, valueLabel),
      visual,
    );
  },
  scaledAxesMarkup(dataMax: number) {
    const { scaleMax, steps } = getScale(dataMax, (this as unknown as TemplateContext).options?.scalePadding);
    const tickPosition = (step: number) => (step / scaleMax) * 100;

    return {
      scaleMax,
      yAxisTicks: steps.map(step =>
        `<div class="y-axis-tick" style="--tick-position: ${tickPosition(step)}%;">${step}</div>`
      ).join(''),
      gridLines: steps.map(step =>
        `<div class="grid-line" style="--tick-position: ${tickPosition(step)}%;"></div>`
      ).join(''),
    };
  },
  columnItem(
    point: any,
    scaleMax: number,
    categoryCount: number,
    categoryIndex: number,
    showValues: boolean,
    layout: { barWidth: number; inset: number; seriesCount: number },
    seriesIndex = 0,
    seriesCount = 1,
  ) {
    const percentage = (point.value / scaleMax) * 100;
    const categoryCenter = getCategoryPosition(categoryIndex, categoryCount, layout.inset);
    const width = layout.barWidth;
    let left = categoryCenter;

    if (seriesCount > 1) {
      const gap = layout.barWidth * 0.08;
      const groupWidth = layout.barWidth * seriesCount + gap * (seriesCount - 1);
      const groupStart = categoryCenter - groupWidth / 2;
      left = groupStart + seriesIndex * (layout.barWidth + gap) + layout.barWidth / 2;
    }
    return `
      <div class="column-item" style="--column-left: ${left}%; --column-width: ${width}%; --column-height: ${percentage}%; --column-color: ${point.color};">
        ${showValues ? `<div class="column-value-label" part="value-label">${point.value}</div>` : ''}
        <div class="column-bar" part="column"></div>
      </div>
    `;
  },
  lineChart({ series, categories }: { series: { name: string; color: string; points: any[] }[]; categories: string[] }) {
    const { valueLabel, categoryLabel, showValues, showLegend } = (this as unknown as TemplateContext).options;
    const allPoints = series.flatMap(s => s.points);
    const dataMax = Math.max(...allPoints.map(p => p.value));
    const { scaleMax, yAxisTicks, gridLines } = this.scaledAxesMarkup(dataMax);
    const layout = getPlotLayout(categories.length, series.length);

    const linesMarkup = series.map(s => {
      const coords = getSeriesCoordinates(s.points, categories, scaleMax, layout.inset);
      const polylinePoints = coords.map(c => `${c.x},${c.y}`).join(' ');
      return `<polyline class="line-path" part="line" points="${polylinePoints}" style="--line-color: ${s.color};" vector-effect="non-scaling-stroke"></polyline>`;
    }).join('');

    const pointsMarkup = series.flatMap(s => {
      const coords = getSeriesCoordinates(s.points, categories, scaleMax, layout.inset);
      return coords.map(c => this.linePoint(c.point, c.x, c.bottom, showValues)).join('');
    }).join('');

    const shouldShowLegend = showLegend ?? (series.length > 1 || !!series[0]?.name);
    const legendMarkup = shouldShowLegend && series.some(s => s.name)
      ? `<div class="line-legend" part="legend">${series.filter(s => s.name).map(s => this.lineLegendItem(s)).join('')}</div>`
      : '';

    const visual = `
        <div class="chart-wrapper ${valueLabel ? '' : 'chart-wrapper--no-y-label'}" part="plot">
          ${valueLabel ? `<div class="y-axis-label" part="value-axis-label">${valueLabel}</div>` : ''}
          <div class="y-axis-track" part="value-axis">${yAxisTicks}</div>
          <div class="chart-area" part="plot-area">
            <div class="grid-lines" part="grid">${gridLines}</div>
            <svg class="line-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              ${linesMarkup}
            </svg>
            <div class="line-points-container" part="points">
              ${pointsMarkup}
            </div>
          </div>
        </div>
        <div class="x-axis" part="category-axis">
          <div class="x-axis-gutter" aria-hidden="true"></div>
          <div class="x-axis-panel">
            <div class="x-axis-ticks">
              ${this.categoryLabelMarkup(categories, layout.inset)}
            </div>
            ${categoryLabel ? `<div class="x-axis-label" part="category-axis-label">${categoryLabel}</div>` : ''}
          </div>
        </div>
        ${legendMarkup}`;

    return chartA11yShell(
      'line-chart',
      spokenSeriesSummary('Line chart', series, categories, categoryLabel, valueLabel),
      seriesValueTable(series, categories, categoryLabel, valueLabel),
      visual,
    );
  },
  areaChart({ series, categories }: { series: { name: string; color: string; points: any[] }[]; categories: string[] }) {
    const { valueLabel, categoryLabel, showValues, showLegend } = (this as unknown as TemplateContext).options;
    const stackedMax = getStackedMax(series, categories);
    const { scaleMax, yAxisTicks, gridLines } = this.scaledAxesMarkup(stackedMax);
    const layout = getPlotLayout(categories.length, 1);

    const areasMarkup = series.map((s, seriesIndex) => {
      const path = stackedAreaPath(seriesIndex, series, categories, scaleMax, layout.inset);
      return `<path class="area-path" part="area" d="${path}" style="--area-color: ${s.color};" vector-effect="non-scaling-stroke"></path>`;
    }).join('');

    const pointsMarkup = showValues
      ? series.flatMap((s, seriesIndex) =>
          categories.flatMap((category, catIndex) => {
            const point = s.points.find(p => p.label === category);
            if (!point) return [];
            const { x, top } = getStackedBandPosition(seriesIndex, series, categories, catIndex, scaleMax, layout.inset);
            return this.areaPoint(point, x, top, showValues);
          }),
        ).join('')
      : '';

    const shouldShowLegend = showLegend ?? (series.length > 1 || !!series[0]?.name);
    const legendMarkup = shouldShowLegend && series.some(s => s.name)
      ? `<div class="line-legend" part="legend">${series.filter(s => s.name).map(s => this.areaLegendItem(s)).join('')}</div>`
      : '';

    const visual = `
        <div class="chart-wrapper ${valueLabel ? '' : 'chart-wrapper--no-y-label'}" part="plot">
          ${valueLabel ? `<div class="y-axis-label" part="value-axis-label">${valueLabel}</div>` : ''}
          <div class="y-axis-track" part="value-axis">${yAxisTicks}</div>
          <div class="chart-area" part="plot-area">
            <div class="grid-lines" part="grid">${gridLines}</div>
            <svg class="line-svg area-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              ${areasMarkup}
            </svg>
            <div class="line-points-container" part="points">
              ${pointsMarkup}
            </div>
          </div>
        </div>
        <div class="x-axis" part="category-axis">
          <div class="x-axis-gutter" aria-hidden="true"></div>
          <div class="x-axis-panel">
            <div class="x-axis-ticks">
              ${this.categoryLabelMarkup(categories, layout.inset)}
            </div>
            ${categoryLabel ? `<div class="x-axis-label" part="category-axis-label">${categoryLabel}</div>` : ''}
          </div>
        </div>
        ${legendMarkup}`;

    return chartA11yShell(
      'area-chart',
      spokenSeriesSummary('Stacked area chart', series, categories, categoryLabel, valueLabel),
      seriesValueTable(series, categories, categoryLabel, valueLabel),
      visual,
    );
  },
  areaLegendItem(series: { name: string; color: string }) {
    return `
      <div class="line-legend-item">
        <div class="area-legend-swatch" style="--legend-color: ${series.color};"></div>
        <span class="line-legend-label">${series.name}</span>
      </div>
    `;
  },
  areaPoint(point: any, x: number, top: number, showValues: boolean) {
    return `
      <div class="line-point-item" style="--left-position: ${x}%; --bottom-position: ${top}%; --dot-color: ${point.color};">
        ${showValues ? `<span class="line-value-label" part="value-label">${point.value}</span>` : ''}
        <div class="line-dot" part="point"></div>
      </div>
    `;
  },
  scatterChart({ series }: { series: { name: string; color: string; points: { label: string; x: number; y: number; color: string }[] }[] }) {
    const { valueLabel, categoryLabel, showValues, showLegend } = (this as unknown as TemplateContext).options;
    const allPoints = series.flatMap(s => s.points);
    const xValues = allPoints.map(p => p.x);
    const yValues = allPoints.map(p => p.y);
    const xScale = getAxisScale(xValues);
    const yScale = getAxisScale(yValues);
    const inset = 6;

    const yAxisTicks = yScale.steps.map(step =>
      `<div class="y-axis-tick" style="--tick-position: ${valueToPlotPercent(step, yScale.scaleMin, yScale.scaleMax)}%;">${step}</div>`
    ).join('');
    const gridLinesH = yScale.steps.map(step =>
      `<div class="grid-line" style="--tick-position: ${valueToPlotPercent(step, yScale.scaleMin, yScale.scaleMax)}%;"></div>`
    ).join('');
    const xAxisTicks = xScale.steps.map(step =>
      `<div class="x-axis-value-tick" style="--tick-position: ${valueToPlotPercent(step, xScale.scaleMin, xScale.scaleMax, inset)}%;">${step}</div>`
    ).join('');
    const gridLinesV = xScale.steps.map(step =>
      `<div class="grid-line-vertical" style="--tick-position: ${valueToPlotPercent(step, xScale.scaleMin, xScale.scaleMax, inset)}%;"></div>`
    ).join('');

    const pointsMarkup = series.flatMap(s =>
      s.points.map(p => this.scatterPoint(p, xScale, yScale, inset, showValues)).join('')
    ).join('');

    const shouldShowLegend = showLegend ?? (series.length > 1 || !!series[0]?.name);
    const legendMarkup = shouldShowLegend && series.some(s => s.name)
      ? `<div class="line-legend" part="legend">${series.filter(s => s.name).map(s => this.scatterLegendItem(s)).join('')}</div>`
      : '';

    const visual = `
        <div class="chart-wrapper ${valueLabel ? '' : 'chart-wrapper--no-y-label'}" part="plot">
          ${valueLabel ? `<div class="y-axis-label" part="value-axis-label">${valueLabel}</div>` : ''}
          <div class="y-axis-track" part="value-axis">${yAxisTicks}</div>
          <div class="chart-area" part="plot-area">
            <div class="grid-lines" part="grid">${gridLinesH}</div>
            <div class="grid-lines-vertical" part="grid-x">${gridLinesV}</div>
            <div class="scatter-points-container" part="points">
              ${pointsMarkup}
            </div>
          </div>
        </div>
        <div class="x-axis" part="category-axis">
          <div class="x-axis-gutter" aria-hidden="true"></div>
          <div class="x-axis-panel">
            <div class="x-axis-ticks x-axis-values scatter-x-ticks">${xAxisTicks}</div>
            ${categoryLabel ? `<div class="x-axis-label" part="category-axis-label">${categoryLabel}</div>` : ''}
          </div>
        </div>
        ${legendMarkup}`;

    return chartA11yShell(
      'scatter-chart',
      spokenScatterSummary(series, categoryLabel, valueLabel),
      scatterValueTable(series, categoryLabel, valueLabel),
      visual,
    );
  },
  scatterPoint(
    point: { label: string; x: number; y: number; color: string },
    xScale: { scaleMin: number; scaleMax: number },
    yScale: { scaleMin: number; scaleMax: number },
    inset: number,
    showValues: boolean,
  ) {
    const left = valueToPlotPercent(point.x, xScale.scaleMin, xScale.scaleMax, inset);
    const bottom = valueToPlotPercent(point.y, yScale.scaleMin, yScale.scaleMax);
    const title = point.label || `(${point.x}, ${point.y})`;
    return `
      <div class="scatter-point-item" style="--left-position: ${left}%; --bottom-position: ${bottom}%; --dot-color: ${point.color};" title="${title}">
        ${showValues ? `<span class="scatter-value-label" part="value-label">${point.y}</span>` : ''}
        <div class="scatter-dot" part="point"></div>
      </div>
    `;
  },
  scatterLegendItem(series: { name: string; color: string }) {
    return `
      <div class="line-legend-item">
        <div class="scatter-legend-dot" style="--legend-color: ${series.color};"></div>
        <span class="line-legend-label">${series.name}</span>
      </div>
    `;
  },
  categoryLabelMarkup(labels: string[], inset?: number) {
    const total = labels.length;
    const margin = inset ?? 4;
    return labels.map((label, i) => {
      const position = getCategoryPosition(i, total, margin);
      return `<div class="x-axis-tick" style="--tick-position: ${position}%;" title="${label}">${label}</div>`;
    }).join('');
  },
  barCategoryLabelMarkup(labels: string[], inset?: number) {
    const total = labels.length;
    const margin = inset ?? 4;
    return labels.map((label, i) => {
      const position = getCategoryPosition(i, total, margin);
      return `<div class="y-axis-category-tick" style="--tick-position: ${position}%;" title="${label}">${label}</div>`;
    }).join('');
  },
  lineLegendItem(series: { name: string; color: string }) {
    return `
      <div class="line-legend-item">
        <div class="line-legend-line" style="--legend-color: ${series.color};"></div>
        <span class="line-legend-label">${series.name}</span>
      </div>
    `;
  },
  linePoint(point: any, x: number, bottom: number, showValues: boolean) {
    return `
      <div class="line-point-item" style="--left-position: ${x}%; --bottom-position: ${bottom}%; --dot-color: ${point.color};">
        ${showValues ? `<span class="line-value-label" part="value-label">${point.value}</span>` : ''}
        <div class="line-dot" part="point"></div>
      </div>
    `;
  },
  pieChart({ series }: { series: { name: string; color: string; points: any[] }[] }) {
    if (series.length > 1) {
      return this.piePanelChart({ series });
    }
    return this.singlePieChart(series[0]?.points ?? []);
  },
  singlePieChart(dataPoints: any[]) {
    const { showLegend } = (this as unknown as TemplateContext).options;
    const total = dataPoints.reduce((sum, p) => sum + p.value, 0);
    const segments = this.getPieSegments(dataPoints, total);
    const shouldShowLegend = showLegend ?? true;

    return chartA11yShell(
      'pie-chart',
      spokenPieSummary([{ name: '', points: dataPoints }]),
      pieValueTable([{ name: '', points: dataPoints }]),
      this.piePlotMarkup(dataPoints, segments, total, shouldShowLegend),
    );
  },
  piePanelChart({ series }: { series: { name: string; color: string; points: any[] }[] }) {
    const { showLegend, colors } = (this as unknown as TemplateContext).options;
    const shouldShowLegend = showLegend ?? true;

    const panelsMarkup = series.map(s => {
      const points = getPieSlicePoints(s.points, colors);
      const total = points.reduce((sum, p) => sum + p.value, 0);
      const segments = this.getPieSegments(points, total);
      const title = s.name
        ? `<div class="pie-panel-title" part="panel-title"><span class="pie-panel-title-swatch" style="--legend-color: ${s.color};"></span>${s.name}</div>`
        : '';

      return `
        <div class="pie-panel" part="panel">
          ${title}
          ${this.piePlotMarkup(points, segments, total, shouldShowLegend)}
        </div>
      `;
    }).join('');

    const visual = `<div class="pie-panels" part="plot">${panelsMarkup}</div>`;

    return chartA11yShell(
      'pie-chart pie-chart--panel',
      spokenPieSummary(series),
      pieValueTable(series),
      visual,
    );
  },
  piePlotMarkup(dataPoints: any[], segments: { path: string; point: any; labelMarkup: string }[], total: number, showLegend: boolean) {
    return `
      <div class="pie-plot" part="plot">
        <svg class="pie-svg" viewBox="-18 -18 136 136" aria-hidden="true">
          ${segments.map(s => `<path class="pie-slice" part="slice" d="${s.path}" fill="${s.point.color}"></path>${s.labelMarkup}`).join('')}
        </svg>
        ${showLegend ? `<div class="pie-legend" part="legend">${dataPoints.map(point => this.pieLegendItem(point, total)).join('')}</div>` : ''}
      </div>
    `;
  },
  pieLabelMarkup(
    value: number,
    cx: number,
    cy: number,
    radius: number,
    midAngle: number,
    sweep: number,
    minSweepForInside: number,
  ) {
    const label = String(value);
    const fitsInside = sweep >= minSweepForInside;

    if (fitsInside) {
      const pos = polarToCartesian(cx, cy, radius * 0.58, midAngle);
      return `<text class="pie-label pie-label--inside" x="${pos.x.toFixed(2)}" y="${pos.y.toFixed(2)}" text-anchor="middle" dominant-baseline="middle">${label}</text>`;
    }

    const edge = polarToCartesian(cx, cy, radius, midAngle);
    const bend = polarToCartesian(cx, cy, radius + 7, midAngle);
    const isRight = bend.x >= cx;
    const endX = isRight ? bend.x + 12 : bend.x - 12;
    const anchor = isRight ? 'start' : 'end';
    const textX = isRight ? endX + 1.5 : endX - 1.5;

    return `
      <polyline class="pie-callout" points="${edge.x.toFixed(2)},${edge.y.toFixed(2)} ${bend.x.toFixed(2)},${bend.y.toFixed(2)} ${endX.toFixed(2)},${bend.y.toFixed(2)}"></polyline>
      <text class="pie-label pie-label--outside" x="${textX.toFixed(2)}" y="${bend.y.toFixed(2)}" text-anchor="${anchor}" dominant-baseline="middle">${label}</text>
    `;
  },

  pieLegendItem(point: any, total: number) {
    const percentage = total > 0 ? (point.value / total) * 100 : 0;
    return `
      <div class="pie-legend-item">
        <div class="pie-legend-color" style="--legend-color: ${point.color};"></div>
        <span class="pie-legend-label">${point.label}</span>
        <span class="pie-legend-percent">${percentage.toFixed(1)}%</span>
      </div>
    `;
  },
  getPieSegments(dataPoints: any[], total: number) {
    let startAngle = 0;
    const cx = 50;
    const cy = 50;
    const radius = 38;
    const minSweepForInside = 22;
  
    return dataPoints.map(point => {
      const sweep = total > 0 ? (point.value / total) * 360 : 0;
      const endAngle = startAngle + sweep;
      const midAngle = startAngle + sweep / 2;
      const path = describePieSlice(cx, cy, radius, startAngle, endAngle);
      const labelMarkup = this.pieLabelMarkup(point.value, cx, cy, radius, midAngle, sweep, minSweepForInside);
      startAngle = endAngle;
      return { path, point, labelMarkup };
    });
  },
};
