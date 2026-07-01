# Data Chart Web Component

Declarative charts in plain HTML. Lightweight, framework-agnostic web components for column, bar, line, area, scatter, and pie charts.

## Quick setup

### 1. Install

```bash
npm install data-chart-web-component
```

### 2. Import once

Register the custom elements in your app entry (or a layout file):

```js
import 'data-chart-web-component';
```

Or import the module directly:

```js
import 'data-chart-web-component/lib/data-chart.js';
```

### 3. Add a chart

```html
<data-chart type="column" value-label="Sales" category-label="Month">
  <data-chart-group label="Revenue" color="#3b82f6">
    <data-chart-point label="Jan" value="30"></data-chart-point>
    <data-chart-point label="Feb" value="50"></data-chart-point>
    <data-chart-point label="Mar" value="40"></data-chart-point>
  </data-chart-group>
</data-chart>
```

## Chart types

Set the `type` attribute on `<data-chart>`:

| Type | Description |
|------|-------------|
| `column` | Vertical grouped columns |
| `bar` | Horizontal bars |
| `line` | Multi-series line chart |
| `area` | Stacked area chart |
| `scatter` | Scatter plot (`x` + `value` on points) |
| `pie` | Pie chart (multiple groups render as separate pies) |

### Single-series bar chart

```html
<data-chart type="bar">
  <data-chart-point label="Product A" value="45" color="#3b82f6"></data-chart-point>
  <data-chart-point label="Product B" value="60" color="#ef4444"></data-chart-point>
</data-chart>
```

### Scatter plot

```html
<data-chart type="scatter" value-label="Height (cm)" category-label="Weight (kg)">
  <data-chart-group label="Group A" color="#3b82f6">
    <data-chart-point label="A1" x="52" value="158"></data-chart-point>
    <data-chart-point label="A2" x="58" value="165"></data-chart-point>
  </data-chart-group>
</data-chart>
```

## Components

| Element | Purpose |
|---------|---------|
| `<data-chart>` | Root chart container |
| `<data-chart-group>` | Named series with shared color |
| `<data-chart-point>` | Single data point |

## Common attributes

On `<data-chart>`:

- `type` — chart type (default: `column`)
- `value-label` / `y-label` — Y axis label
- `category-label` / `x-label` — X axis label
- `height` — plot height (`320` or `20em`)
- `show-values` — show values on points (default: `true`)
- `show-legend` — show legend (`true` / `false`; auto for multi-series)
- `colors` — comma-separated palette

On `<data-chart-point>`:

- `label` — category or segment name
- `value` — numeric value (Y for scatter)
- `x` — horizontal position for scatter
- `color` — override color

## Styling

Charts use shadow DOM. Theme via attributes or CSS custom properties on `data-chart`:

```css
data-chart {
  --chart-plot-bg: #f8fafc;
  --chart-axis-color: #64748b;
  --chart-line-width: 3px;
}

data-chart::part(column) {
  opacity: 0.9;
}
```

## JavaScript API

```js
import { DataChart } from 'data-chart-web-component';

const chart = document.querySelector('data-chart');
chart.type = 'line';
```

## Development

Clone the repo and install dependencies:

```bash
git clone https://github.com/DidacBA/data-chart-web-component.git
cd data-chart-web-components
npm install
```

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the documentation site locally |
| `npm run build` | Build the library (`lib/`) and docs site (`docs/`) |
| `npm run build:lib` | Build the library only → `lib/data-chart.js` |
| `npm run build:docs` | Build the documentation site → `docs/` |
| `npm run preview` | Preview the built documentation site |

The library ships as an ES module at `lib/data-chart.js`.

## License

[MIT](LICENSE)
