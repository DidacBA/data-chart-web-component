import { requestChartUpdate } from '../utils/events';

export default class DataChartGroup extends HTMLElement {
  static get observedAttributes() {
    return ['label', 'name', 'color'];
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
}

customElements.define('data-chart-group', DataChartGroup);
