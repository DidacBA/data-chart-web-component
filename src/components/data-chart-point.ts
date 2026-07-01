import { requestChartUpdate } from '../utils/events';

export default class DataChartPoint extends HTMLElement {
  static get observedAttributes() {
    return ['label', 'value', 'x', 'color', 'group'];
  }

  connectedCallback() {
    requestChartUpdate(this);
  }

  disconnectedCallback() {
    requestChartUpdate(this);
  }

  attributeChangedCallback() {
    requestChartUpdate(this);
  }

  get label(): string {
    return this.getAttribute('label') || '';
  }

  get value(): number {
    return parseFloat(this.getAttribute('value') || '0');
  }

  get x(): number {
    return parseFloat(this.getAttribute('x') || '0');
  }

  get color(): string {
    return this.getAttribute('color') || '';
  }

  get group(): string {
    return this.getAttribute('group') || '';
  }
}

customElements.define('data-chart-point', DataChartPoint);
