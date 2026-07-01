export const CHART_UPDATE = 'chart-update';

export function requestChartUpdate(el: Element) {
  el.dispatchEvent(new CustomEvent(CHART_UPDATE, { bubbles: true }));
}
