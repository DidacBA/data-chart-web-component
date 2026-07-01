import { colorForIndex } from './config';

export function getPlotLayout(categoryCount: number, seriesCount = 1) {
  const slotWidth = Math.min(14, (100 / Math.max(categoryCount, 1)) * 0.75);
  const gapRatio = 0.08;
  const barWidth = seriesCount > 1
    ? slotWidth / (seriesCount + (seriesCount - 1) * gapRatio)
    : slotWidth;
  const groupWidth = seriesCount > 1
    ? barWidth * seriesCount + barWidth * gapRatio * (seriesCount - 1)
    : barWidth;
  const inset = Math.max(6, groupWidth / 2 + 1.5);
  return { barWidth, inset, seriesCount };
}

export function getCategoryPosition(index: number, total: number, inset = 4) {
   return total === 1 ? 50 : inset + (index / (total - 1)) * (100 - inset * 2);
}

export function getSeriesCoordinates(points: any[], categories: string[], scaleMax: number, inset = 4) {
  const total = categories.length;

  return categories.flatMap((category, index) => {
    const point = points.find(p => p.label === category);
    if (!point) return [];

    const x = getCategoryPosition(index, total, inset);
    const y = (1 - point.value / scaleMax) * 100;
    const bottom = (point.value / scaleMax) * 100;
    return [{ x, y, bottom, point }];
  });
}

export function getScale(dataMax: number, scalePadding?: number) {
  const padding = scalePadding ?? 1.15;
  return niceScale(dataMax, padding);
}

function niceScale(dataMax: number, padding: number, targetTicks = 5) {
  if (dataMax <= 0) return { scaleMax: 1, steps: [0, 1] };

  const padded = dataMax * padding;
  const roughStep = padded / targetTicks;
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const normalized = roughStep / magnitude;
  const niceUnit = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  const step = niceUnit * magnitude;
  const scaleMax = Math.ceil(padded / step) * step;
  const steps: number[] = [];

  for (let value = 0; value <= scaleMax + step * 0.001; value += step) {
    steps.push(Number.isInteger(step) ? value : Math.round(value * 1000) / 1000);
  }

  return { scaleMax, steps };
}

export function getStackedMax(series: { points: { label: string; value: number }[] }[], categories: string[]) {
  if (categories.length === 0) return 0;
  return Math.max(
    0,
    ...categories.map(category =>
      series.reduce((sum, s) => sum + (s.points.find(p => p.label === category)?.value ?? 0), 0),
    ),
  );
}

function getStackedSums(
  seriesIndex: number,
  series: { points: { label: string; value: number }[] }[],
  categories: string[],
  categoryIndex: number,
) {
  let bottomSum = 0;
  for (let i = 0; i < seriesIndex; i++) {
    bottomSum += series[i].points.find(p => p.label === categories[categoryIndex])?.value ?? 0;
  }
  const value = series[seriesIndex].points.find(p => p.label === categories[categoryIndex])?.value ?? 0;
  return { bottomSum, topSum: bottomSum + value };
}

export function getStackedBandPosition(
  seriesIndex: number,
  series: { points: { label: string; value: number }[] }[],
  categories: string[],
  categoryIndex: number,
  scaleMax: number,
  inset: number,
) {
  const { topSum } = getStackedSums(seriesIndex, series, categories, categoryIndex);
  const x = getCategoryPosition(categoryIndex, categories.length, inset);
  const top = (topSum / scaleMax) * 100;
  return { x, top };
}

export function stackedAreaPath(
  seriesIndex: number,
  series: { points: { label: string; value: number }[] }[],
  categories: string[],
  scaleMax: number,
  inset: number,
) {
  const tops: { x: number; y: number }[] = [];
  const bottoms: { x: number; y: number }[] = [];

  categories.forEach((_category, catIndex) => {
    const { bottomSum, topSum } = getStackedSums(seriesIndex, series, categories, catIndex);
    const x = getCategoryPosition(catIndex, categories.length, inset);
    tops.push({ x, y: (1 - topSum / scaleMax) * 100 });
    bottoms.push({ x, y: (1 - bottomSum / scaleMax) * 100 });
  });

  if (tops.length === 0) return '';

  const parts = [`M ${tops[0].x} ${tops[0].y}`];
  for (let i = 1; i < tops.length; i++) parts.push(`L ${tops[i].x} ${tops[i].y}`);
  for (let i = bottoms.length - 1; i >= 0; i--) parts.push(`L ${bottoms[i].x} ${bottoms[i].y}`);
  parts.push('Z');
  return parts.join(' ');
}

export function getAxisScale(values: number[], scalePadding?: number) {
  const padding = scalePadding ?? 1.15;
  if (values.length === 0) return { scaleMin: 0, scaleMax: 1, steps: [0, 1] };

  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);

  if (rawMin >= 0) {
    const { scaleMax, steps } = niceScale(rawMax, padding);
    return { scaleMin: 0, scaleMax, steps };
  }

  const absMax = Math.max(Math.abs(rawMin), Math.abs(rawMax));
  const { scaleMax, steps } = niceScale(absMax, padding);
  return { scaleMin: -scaleMax, scaleMax, steps };
}

export function valueToPlotPercent(value: number, min: number, max: number, inset = 0) {
  const span = max - min || 1;
  const t = (value - min) / span;
  if (inset <= 0) return t * 100;
  return inset + t * (100 - inset * 2);
}

export function getPieSlicePoints(points: any[], colors: string[]) {
  const allSameColor = points.length > 1 && points.every(p => p.color === points[0]?.color);
  if (!allSameColor) return points;
  return points.map((p, i) => ({ ...p, color: colorForIndex(i, colors) }));
}

export function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
  const radians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(radians),
    y: cy + r * Math.sin(radians),
  };
}

export function describePieSlice(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  if (endAngle - startAngle >= 360) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`;
  }

  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}
