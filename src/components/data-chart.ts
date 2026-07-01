import { templates } from './data-chart.ui';
import { emptyChartMarkup } from '../utils/a11y';
import { CHART_UPDATE } from '../utils/events';
import {
  applyChartTheme,
  CHART_OPTION_ATTRIBUTES,
  colorForIndex,
  parseChartOptions,
  type ChartOptions,
  type ChartType,
} from '../utils/config';
import styles from './data-chart.styles.css?inline';

export type { ChartOptions } from '../utils/config';
export type { ChartType } from '../utils/config';

export type DataPoint = {
  label: string;
  value: number;
  color: string;
};

export type LineSeries = {
  name: string;
  color: string;
  points: DataPoint[];
};

export type ScatterPoint = {
  label: string;
  x: number;
  y: number;
  color: string;
};

export type ScatterSeries = {
  name: string;
  color: string;
  points: ScatterPoint[];
};

/**
 * Web component that renders charts with a declarative HTML api.
 * @element data-chart
 * @extends {HTMLElement}
 * 
 * @attr {string} type - The type of chart to render (column, bar, line, stacked, scatter, pie)
 * 
 * @example
 * <data-chart type="column">
 *  <data-chart-group label="Revenue" color="#3b82f6">
 *    <data-chart-point label="Jan" value="30"></data-chart-point>
 *    <data-chart-point label="Feb" value="50"></data-chart-point>
 *  </data-chart-group>
 * </data-chart>
 */
export default class DataChart extends HTMLElement {
  static templates = templates;
  static styles = styles;
  static sheet: CSSStyleSheet | undefined;

  #chartType: ChartType = 'column';
  #chartContainer: HTMLElement | null = null;
  #handleUpdate = () => this.render();

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const ctor = this.constructor as typeof DataChart;

    let { templates, styles, sheet } = ctor;
    if (shadowRoot.adoptedStyleSheets) {
      if (!sheet) {
        sheet = new CSSStyleSheet();
        sheet.replaceSync(styles);
        ctor.sheet = sheet;
      }

      shadowRoot.adoptedStyleSheets = [sheet];
    }

    this._setShadowHTML(templates.root(), shadowRoot);
    this.#chartContainer = shadowRoot.querySelector('.chart-container');
  }

  connectedCallback() {
    this.#chartType = (this.getAttribute('type') as ChartType) || 'column';
    this.addEventListener(CHART_UPDATE, this.#handleUpdate);
    this.render();
  }

  disconnectedCallback() {
    this.removeEventListener(CHART_UPDATE, this.#handleUpdate);
  }

  static get observedAttributes() {
    return CHART_OPTION_ATTRIBUTES;
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    if (name === 'type') {
      this.#chartType = (newValue as ChartType) || 'column';
    }
    this.render();
  }

  #getOptions(): ChartOptions {
    return parseChartOptions(this);
  }

  _setShadowHTML(html: string, shadowRoot: ShadowRoot) {
    const ctor = this.constructor as typeof DataChart;
    if (!shadowRoot.adoptedStyleSheets && ctor.styles) {
      html = `<style>${ctor.styles}</style>\n${html}`;
    }

    shadowRoot.innerHTML = html;
  }

  set type(chartType: ChartType) {
    this.#chartType = chartType;
    this.render();
  }

  get type(): ChartType {
    return this.#chartType;
  }

  #parsePoint(el: Element, fallbackColor: string): DataPoint {
    return {
      label: el.getAttribute('label') || '',
      value: parseFloat(el.getAttribute('value') || '0'),
      color: el.getAttribute('color') || fallbackColor,
    };
  }

  #parseScatterPoint(el: Element, fallbackColor: string): ScatterPoint {
    return {
      label: el.getAttribute('label') || '',
      x: parseFloat(el.getAttribute('x') || '0'),
      y: parseFloat(el.getAttribute('value') || '0'),
      color: el.getAttribute('color') || fallbackColor,
    };
  }

  #getScatterSeries(options: ChartOptions): { series: ScatterSeries[] } {
    const colors = options.colors;
    const groupEls = Array.from(this.querySelectorAll(':scope > data-chart-group'));
    let series: ScatterSeries[];

    if (groupEls.length > 0) {
      series = groupEls.map((groupEl, i) => {
        const name = groupEl.getAttribute('label') || groupEl.getAttribute('name') || `Series ${i + 1}`;
        const seriesColor = groupEl.getAttribute('color') || colorForIndex(i, colors);
        const points = Array.from(groupEl.querySelectorAll('data-chart-point')).map(p =>
          this.#parseScatterPoint(p, seriesColor)
        );
        return { name, color: seriesColor, points };
      });
    } else {
      const pointEls = Array.from(this.querySelectorAll(':scope > data-chart-point'));
      const groupNames = [...new Set(pointEls.map(el => el.getAttribute('group') || 'default'))];

      series = groupNames.map((name, i) => {
        const seriesColor = colorForIndex(i, colors);
        const points = pointEls
          .filter(el => (el.getAttribute('group') || 'default') === name)
          .map(el => this.#parseScatterPoint(el, seriesColor));

        return {
          name: name === 'default' ? '' : name,
          color: points[0]?.color || seriesColor,
          points,
        };
      });
    }

    return { series };
  }

  #getSeries(options: ChartOptions): { series: LineSeries[]; categories: string[] } {
    const colors = options.colors;
    const groupEls = Array.from(this.querySelectorAll(':scope > data-chart-group'));
    let series: LineSeries[];

    if (groupEls.length > 0) {
      series = groupEls.map((groupEl, i) => {
        const name = groupEl.getAttribute('label') || groupEl.getAttribute('name') || `Series ${i + 1}`;
        const seriesColor = groupEl.getAttribute('color') || colorForIndex(i, colors);
        const points = Array.from(groupEl.querySelectorAll('data-chart-point')).map(p =>
          this.#parsePoint(p, seriesColor)
        );
        return { name, color: seriesColor, points };
      });
    } else {
      const pointEls = Array.from(this.querySelectorAll(':scope > data-chart-point'));
      const groupNames = [...new Set(pointEls.map(el => el.getAttribute('group') || 'default'))];

      series = groupNames.map((name, i) => {
        const seriesColor = colorForIndex(i, colors);
        const points = pointEls
          .filter(el => (el.getAttribute('group') || 'default') === name)
          .map(el => this.#parsePoint(el, seriesColor));

        return {
          name: name === 'default' ? '' : name,
          color: points[0]?.color || seriesColor,
          points,
        };
      });
    }

    const categories: string[] = [];
    const seen = new Set<string>();
    for (const s of series) {
      for (const point of s.points) {
        if (point.label && !seen.has(point.label)) {
          seen.add(point.label);
          categories.push(point.label);
        }
      }
    }

    return { series, categories };
  }

  #syncHostA11y() {
    const figure = this.#chartContainer?.querySelector('[part="chart"]');
    if (figure) {
      const label = figure.getAttribute('aria-label');
      if (label) this.setAttribute('aria-label', label);
      else this.removeAttribute('aria-label');
      this.setAttribute('role', 'group');
    } else {
      this.removeAttribute('aria-label');
      this.removeAttribute('role');
    }
  }

  render() {
    if (!this.#chartContainer || !this.isConnected) return;

    const options = this.#getOptions();
    applyChartTheme(this, options);
    const { templates } = this.constructor as typeof DataChart;
    let html = '';

    switch (this.#chartType) {
      case 'bar': {
        const barData = this.#getSeries(options);
        const barPoints = barData.series.flatMap(s => s.points);
        if (barPoints.length === 0) {
          this.#chartContainer.innerHTML = emptyChartMarkup(options.emptyMessage);
          this.#syncHostA11y();
          return;
        }
        html = templates.barChart.call({ ...templates, options }, barData);
        break;
      }
      case 'column': {
        const columnData = this.#getSeries(options);
        const columnPoints = columnData.series.flatMap(s => s.points);
        if (columnPoints.length === 0) {
          this.#chartContainer.innerHTML = emptyChartMarkup(options.emptyMessage);
          this.#syncHostA11y();
          return;
        }
        html = templates.columnChart.call({ ...templates, options }, columnData);
        break;
      }
      case 'line': {
        const lineData = this.#getSeries(options);
        const linePoints = lineData.series.flatMap(s => s.points);
        if (linePoints.length === 0) {
          this.#chartContainer.innerHTML = emptyChartMarkup(options.emptyMessage);
          this.#syncHostA11y();
          return;
        }
        html = templates.lineChart.call({ ...templates, options }, lineData);
        break;
      }
      case 'area': {
        const areaData = this.#getSeries(options);
        const areaPoints = areaData.series.flatMap(s => s.points);
        if (areaPoints.length === 0) {
          this.#chartContainer.innerHTML = emptyChartMarkup(options.emptyMessage);
          this.#syncHostA11y();
          return;
        }
        html = templates.areaChart.call({ ...templates, options }, areaData);
        break;
      }
      case 'scatter': {
        const scatterData = this.#getScatterSeries(options);
        const scatterPoints = scatterData.series.flatMap(s => s.points);
        if (scatterPoints.length === 0) {
          this.#chartContainer.innerHTML = emptyChartMarkup(options.emptyMessage);
          this.#syncHostA11y();
          return;
        }
        html = templates.scatterChart.call({ ...templates, options }, scatterData);
        break;
      }
      case 'pie': {
        const pieData = this.#getSeries(options);
        const piePoints = pieData.series.flatMap(s => s.points);
        if (piePoints.length === 0) {
          this.#chartContainer.innerHTML = emptyChartMarkup(options.emptyMessage);
          this.#syncHostA11y();
          return;
        }
        html = templates.pieChart.call({ ...templates, options }, pieData);
        break;
      }
    }

    this.#chartContainer.innerHTML = html;
    this.#syncHostA11y();
  }
}

customElements.define('data-chart', DataChart);
