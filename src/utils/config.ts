export type ChartType = 'bar' | 'column' | 'line' | 'area' | 'scatter' | 'pie';

export const DEFAULT_COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#6366f1',
];

/** Distinct color for an index — cycles the palette, then generates muted HSL colors. */
export function colorForIndex(index: number, palette: string[] = DEFAULT_COLORS): string {
  if (index < palette.length) return palette[index];
  const hue = Math.round((index * 137.508) % 360);
  return `hsl(${hue} 70% 55%)`;
}

export function resolveElementColor(el: Element, index: number, palette: string[]): string {
  return el.getAttribute('color') || colorForIndex(index, palette);
}

export type ChartOptions = {
  valueLabel: string;
  categoryLabel: string;
  height: string | null;
  showValues: boolean;
  showLegend: boolean | null;
  colors: string[];
  scalePadding: number;
  emptyMessage: string;
  font: string | null;
  textColor: string | null;
  axisColor: string | null;
  gridColor: string | null;
  plotColor: string | null;
  lineWidth: string | null;
  barRadius: string | null;
};

function defaultLabels(type: ChartType) {
  if (type === 'bar') {
    return { valueLabel: 'Values', categoryLabel: 'Categories' };
  }
  if (type === 'pie') {
    return { valueLabel: '', categoryLabel: '' };
  }
  if (type === 'scatter') {
    return { valueLabel: 'Y', categoryLabel: 'X' };
  }
  return { valueLabel: 'Values', categoryLabel: 'Categories' };
}

function parseOptionalBool(value: string | null): boolean | null {
  if (value === null) return null;
  return value !== 'false' && value !== '0';
}

function parseColors(value: string | null): string[] | null {
  if (!value) return null;
  const colors = value.split(',').map(c => c.trim()).filter(Boolean);
  return colors.length > 0 ? colors : null;
}

function parseHeight(value: string | null): string | null {
  if (!value) return null;
  return /^\d+$/.test(value) ? `${value}px` : value;
}

export function parseChartOptions(el: HTMLElement): ChartOptions {
  const type = (el.getAttribute('type') as ChartType) || 'column';
  const labels = defaultLabels(type);

  return {
    valueLabel: el.getAttribute('value-label') || el.getAttribute('y-label') || labels.valueLabel,
    categoryLabel: el.getAttribute('category-label') || el.getAttribute('x-label') || labels.categoryLabel,
    height: parseHeight(el.getAttribute('height')),
    showValues: el.getAttribute('show-values') !== 'false',
    showLegend: parseOptionalBool(el.getAttribute('show-legend')),
    colors: parseColors(el.getAttribute('colors')) || DEFAULT_COLORS,
    scalePadding: Math.max(1, parseFloat(el.getAttribute('scale-padding') || '1.15') || 1.15),
    emptyMessage: el.getAttribute('empty-message') || 'No data points provided',
    font: el.getAttribute('font'),
    textColor: el.getAttribute('text-color'),
    axisColor: el.getAttribute('axis-color'),
    gridColor: el.getAttribute('grid-color'),
    plotColor: el.getAttribute('plot-color'),
    lineWidth: el.getAttribute('line-width'),
    barRadius: el.getAttribute('bar-radius'),
  };
}

const THEME_PROPS: [keyof ChartOptions, string][] = [
  ['font', '--chart-font'],
  ['textColor', '--chart-text'],
  ['axisColor', '--chart-axis-color'],
  ['gridColor', '--chart-grid-color'],
  ['plotColor', '--chart-plot-bg'],
  ['lineWidth', '--chart-line-width'],
  ['barRadius', '--chart-bar-radius'],
  ['height', '--chart-height'],
];

export function applyChartTheme(el: HTMLElement, options: ChartOptions) {
  for (const [key, cssVar] of THEME_PROPS) {
    const value = options[key];
    if (typeof value === 'string' && value) {
      el.style.setProperty(cssVar, value);
    } else {
      el.style.removeProperty(cssVar);
    }
  }
}

export const CHART_OPTION_ATTRIBUTES = [
  'type',
  'value-label',
  'category-label',
  'x-label',
  'y-label',
  'height',
  'show-values',
  'show-legend',
  'colors',
  'scale-padding',
  'empty-message',
  'font',
  'text-color',
  'axis-color',
  'grid-color',
  'plot-color',
  'line-width',
  'bar-radius',
];
