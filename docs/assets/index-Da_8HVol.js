(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[`#3b82f6`,`#8b5cf6`,`#06b6d4`,`#10b981`,`#f59e0b`,`#ef4444`,`#ec4899`,`#6366f1`];function t(t,n=e){return t<n.length?n[t]:`hsl(${Math.round(t*137.508%360)} 70% 55%)`}function n(e){return e===`bar`?{valueLabel:`Values`,categoryLabel:`Categories`}:e===`pie`?{valueLabel:``,categoryLabel:``}:e===`scatter`?{valueLabel:`Y`,categoryLabel:`X`}:{valueLabel:`Values`,categoryLabel:`Categories`}}function r(e){return e===null?null:e!==`false`&&e!==`0`}function i(e){if(!e)return null;let t=e.split(`,`).map(e=>e.trim()).filter(Boolean);return t.length>0?t:null}function a(e){return e?/^\d+$/.test(e)?`${e}px`:e:null}function o(t){let o=n(t.getAttribute(`type`)||`column`);return{valueLabel:t.getAttribute(`value-label`)||t.getAttribute(`y-label`)||o.valueLabel,categoryLabel:t.getAttribute(`category-label`)||t.getAttribute(`x-label`)||o.categoryLabel,height:a(t.getAttribute(`height`)),showValues:t.getAttribute(`show-values`)!==`false`,showLegend:r(t.getAttribute(`show-legend`)),colors:i(t.getAttribute(`colors`))||e,scalePadding:Math.max(1,parseFloat(t.getAttribute(`scale-padding`)||`1.15`)||1.15),emptyMessage:t.getAttribute(`empty-message`)||`No data points provided`,font:t.getAttribute(`font`),textColor:t.getAttribute(`text-color`),axisColor:t.getAttribute(`axis-color`),gridColor:t.getAttribute(`grid-color`),plotColor:t.getAttribute(`plot-color`),lineWidth:t.getAttribute(`line-width`),barRadius:t.getAttribute(`bar-radius`)}}var s=[[`font`,`--chart-font`],[`textColor`,`--chart-text`],[`axisColor`,`--chart-axis-color`],[`gridColor`,`--chart-grid-color`],[`plotColor`,`--chart-plot-bg`],[`lineWidth`,`--chart-line-width`],[`barRadius`,`--chart-bar-radius`],[`height`,`--chart-height`]];function c(e,t){for(let[n,r]of s){let i=t[n];typeof i==`string`&&i?e.style.setProperty(r,i):e.style.removeProperty(r)}}var l=[`type`,`value-label`,`category-label`,`x-label`,`y-label`,`height`,`show-values`,`show-legend`,`colors`,`scale-padding`,`empty-message`,`font`,`text-color`,`axis-color`,`grid-color`,`plot-color`,`line-width`,`bar-radius`],u=0;function d(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function f(e){return String(Number.isInteger(e)?e:Math.round(e*1e3)/1e3)}function p(e,t){return t.length>0?t.map(t=>e.points.find(e=>e.label===t)).filter(e=>!!e):e.points}function m(e,t){if(e.length===0)return``;let n=e[0],r=e[0];for(let t of e)t.value>n.value&&(n=t),t.value<r.value&&(r=t);let i=t||`value`;return n.value===r.value?`all ${i}s are ${f(n.value)}`:`highest ${i} ${f(n.value)} at ${n.label}, lowest ${f(r.value)} at ${r.label}`}function h(e){if(e.length<2)return``;let t=e[0],n=e[e.length-1],r=e.map(e=>e.value),i=Math.max(...r)-Math.min(...r),a=i>0?i*.08:0,o=n.value-t.value,s=r.every((e,t)=>t===0||e>=r[t-1]-.001),c=r.every((e,t)=>t===0||e<=r[t-1]+.001);return s&&o>a?`trending up from ${t.label} to ${n.label}`:c&&o<-a?`trending down from ${t.label} to ${n.label}`:Math.abs(o)<=a?`relatively stable overall`:`fluctuating across categories`}function g(e,t,n){let r=p(e,t);if(r.length===0)return``;let i=m(r,n),a=h(r),o=e.name?`${e.name}: `:``;return a?`${o}${i}; ${a}`:`${o}${i}`}function _(e,t,n){if(t.length===0)return``;let r=t.map(t=>({label:t,value:e.reduce((e,n)=>e+(n.points.find(e=>e.label===t)?.value??0),0)})),i=m(r,n||`value`),a=h(r);return a?`Combined total: ${i}; ${a}`:`Combined total: ${i}`}function v(e,t,n){let r=t||`category`,i=n||`value`;return e.map(e=>`${e.label||r} ${i} ${f(e.value)}`).join(`, `)}function y(e,t,n,r){if(!(e.length>1||e[0]?.name)){let t=v(e[0]?.points??[],n,r);return t?`Data: ${t}.`:``}return`Data: ${e.map(e=>{let i=p(e,t);return`${e.name||`Series`}: ${v(i,n,r)}`}).join(`. `)}.`}function b(e,t,n,r,i){if(t.length===0||t.every(e=>e.points.length===0))return e;let a=e.toLowerCase().includes(`stacked`),o=t.map(e=>g(e,n,i)).filter(Boolean);if(a){let e=_(t,n,i);e&&o.unshift(e)}let s=o.length>0?`Key findings: ${o.join(`. `)}.`:``,c=y(t,n,r,i);return[e+`.`,s,c].filter(Boolean).join(` `)}function x(e,t,n){let r=e.points;if(r.length===0)return``;let i=t||`X`,a=n||`Y`,o=r[0],s=r[0];for(let e of r)e.y>o.y&&(o=e),e.y<s.y&&(s=e);let c=h([...r].sort((e,t)=>e.x-t.x).map(e=>({label:`${i} ${f(e.x)}`,value:e.y}))),l=e.name?`${e.name}: `:``,u=`highest ${a} ${f(o.y)} at ${i} ${f(o.x)}, lowest ${a} ${f(s.y)} at ${i} ${f(s.x)}`;return c?`${l}${u}; ${c}`:`${l}${u}`}function S(e,t,n){if(e.length===0||e.every(e=>e.points.length===0))return`Scatter plot`;let r=t||`X`,i=n||`Y`,a=e.map(e=>x(e,t,n)).filter(Boolean),o=a.length>0?`Key findings: ${a.join(`. `)}.`:``,s=e.length>1||!!e[0]?.name,c;if(s)c=`Data: ${e.map(e=>`${e.name||`Series`}: ${e.points.map(e=>`${r} ${f(e.x)}, ${i} ${f(e.y)}`).join(`; `)}`).join(`. `)}.`;else{let t=(e[0]?.points??[]).map(e=>`${r} ${f(e.x)}, ${i} ${f(e.y)}`).join(`; `);c=t?`Data: ${t}.`:``}return[`Scatter plot.`,o,c].filter(Boolean).join(` `)}function C(e){let t=e.points;if(t.length===0)return``;let n=t.reduce((e,t)=>e+t.value,0);if(n<=0)return``;let r=t[0],i=t[0];for(let e of t)e.value>r.value&&(r=e),e.value<i.value&&(i=e);let a=(r.value/n*100).toFixed(1),o=(i.value/n*100).toFixed(1),s=e.name?`${e.name}: `:``,c=[`largest segment ${r.label} at ${a}%`,`smallest segment ${i.label} at ${o}%`];return parseFloat(a)>=50&&c.push(`${r.label} is the majority`),`${s}${c.join(`; `)}`}function w(e){let t=e.length>1?`Pie charts`:`Pie chart`;if(e.length===0||e.every(e=>e.points.length===0))return t;let n=e.map(e=>C(e)).filter(Boolean),r=n.length>0?`Key findings: ${n.join(`. `)}.`:``,i=`Data: ${e.map(e=>{let t=e.points.reduce((e,t)=>e+t.value,0);return`${e.name?`${e.name}: `:``}${e.points.map(e=>{let n=t>0?(e.value/t*100).toFixed(1):`0.0`;return`${e.label} ${f(e.value)}, ${n} percent`}).join(`; `)}`}).join(`. `)}.`;return[t+`.`,r,i].filter(Boolean).join(` `)}function T(e,t,n,r){let i=n||`Category`,a=r||`Value`;if(!(e.length>1||e[0]?.name)){let t=e[0]?.points??[];return`
      <table class="chart-sr-table">
        <caption>Chart data</caption>
        <thead>
          <tr>
            <th scope="col">${d(i)}</th>
            <th scope="col">${d(a)}</th>
          </tr>
        </thead>
        <tbody>
          ${t.map(e=>`<tr><th scope="row">${d(e.label)}</th><td>${f(e.value)}</td></tr>`).join(``)}
        </tbody>
      </table>
    `}return`
    <table class="chart-sr-table">
      <caption>Chart data by series</caption>
      <thead>
        <tr>
          <th scope="col">${d(i)}</th>
          ${e.map(e=>`<th scope="col">${d(e.name||`Series`)}</th>`).join(``)}
        </tr>
      </thead>
      <tbody>
        ${t.map(t=>`
          <tr>
            <th scope="row">${d(t)}</th>
            ${e.map(e=>{let n=e.points.find(e=>e.label===t);return`<td>${n?f(n.value):`—`}</td>`}).join(``)}
          </tr>
        `).join(``)}
      </tbody>
    </table>
  `}function E(e,t,n){let r=t||`X`,i=n||`Y`;if(!(e.length>1||e[0]?.name)){let t=e[0]?.points??[];return`
      <table class="chart-sr-table">
        <caption>Scatter plot data</caption>
        <thead>
          <tr>
            <th scope="col">${d(r)}</th>
            <th scope="col">${d(i)}</th>
          </tr>
        </thead>
        <tbody>
          ${t.map(e=>`<tr><td>${f(e.x)}</td><td>${f(e.y)}</td></tr>`).join(``)}
        </tbody>
      </table>
    `}return e.map(e=>`
    <table class="chart-sr-table">
      <caption>${d(e.name||`Series`)}</caption>
      <thead>
        <tr>
          <th scope="col">${d(r)}</th>
          <th scope="col">${d(i)}</th>
        </tr>
      </thead>
      <tbody>
        ${e.points.map(e=>`<tr><td>${f(e.x)}</td><td>${f(e.y)}</td></tr>`).join(``)}
      </tbody>
    </table>
  `).join(``)}function D(e){return e.map(e=>{let t=e.points.reduce((e,t)=>e+t.value,0);return`
      <table class="chart-sr-table">
        <caption>${d(e.name||`Chart data`)}</caption>
        <thead>
          <tr>
            <th scope="col">Segment</th>
            <th scope="col">Value</th>
            <th scope="col">Percent</th>
          </tr>
        </thead>
        <tbody>
          ${e.points.map(e=>{let n=t>0?(e.value/t*100).toFixed(1):`0.0`;return`<tr><th scope="row">${d(e.label)}</th><td>${f(e.value)}</td><td>${n}%</td></tr>`}).join(``)}
        </tbody>
      </table>
    `}).join(``)}function O(e,t,n,r){let i=`chart-data-${++u}`,a=d(t);return`
    <div class="chart ${e}" part="chart" role="figure" tabindex="0" aria-label="${a}" aria-describedby="${i}">
      <div class="chart-visual" aria-hidden="true">
        ${r}
      </div>
      <div id="${i}" class="chart-data" part="data-table">
        <p class="chart-sr-summary" aria-live="polite">${a}</p>
        ${n}
      </div>
    </div>
  `}function k(e){return`<p part="empty" class="chart-empty" role="status" aria-live="polite">${d(e)}</p>`}function A(e,t=1){let n=Math.min(14,100/Math.max(e,1)*.75),r=.08,i=t>1?n/(t+(t-1)*r):n,a=t>1?i*t+i*r*(t-1):i;return{barWidth:i,inset:Math.max(6,a/2+1.5),seriesCount:t}}function j(e,t,n=4){return t===1?50:n+e/(t-1)*(100-n*2)}function M(e,t,n,r=4){let i=t.length;return t.flatMap((t,a)=>{let o=e.find(e=>e.label===t);return o?[{x:j(a,i,r),y:(1-o.value/n)*100,bottom:o.value/n*100,point:o}]:[]})}function N(e,t){return P(e,t??1.15)}function P(e,t,n=5){if(e<=0)return{scaleMax:1,steps:[0,1]};let r=e*t,i=r/n,a=10**Math.floor(Math.log10(i)),o=i/a,s=(o<=1?1:o<=2?2:o<=5?5:10)*a,c=Math.ceil(r/s)*s,l=[];for(let e=0;e<=c+s*.001;e+=s)l.push(Number.isInteger(s)?e:Math.round(e*1e3)/1e3);return{scaleMax:c,steps:l}}function F(e,t){return t.length===0?0:Math.max(0,...t.map(t=>e.reduce((e,n)=>e+(n.points.find(e=>e.label===t)?.value??0),0)))}function I(e,t,n,r){let i=0;for(let a=0;a<e;a++)i+=t[a].points.find(e=>e.label===n[r])?.value??0;let a=t[e].points.find(e=>e.label===n[r])?.value??0;return{bottomSum:i,topSum:i+a}}function L(e,t,n,r,i,a){let{topSum:o}=I(e,t,n,r);return{x:j(r,n.length,a),top:o/i*100}}function R(e,t,n,r,i){let a=[],o=[];if(n.forEach((s,c)=>{let{bottomSum:l,topSum:u}=I(e,t,n,c),d=j(c,n.length,i);a.push({x:d,y:(1-u/r)*100}),o.push({x:d,y:(1-l/r)*100})}),a.length===0)return``;let s=[`M ${a[0].x} ${a[0].y}`];for(let e=1;e<a.length;e++)s.push(`L ${a[e].x} ${a[e].y}`);for(let e=o.length-1;e>=0;e--)s.push(`L ${o[e].x} ${o[e].y}`);return s.push(`Z`),s.join(` `)}function z(e,t){let n=t??1.15;if(e.length===0)return{scaleMin:0,scaleMax:1,steps:[0,1]};let r=Math.min(...e),i=Math.max(...e);if(r>=0){let{scaleMax:e,steps:t}=P(i,n);return{scaleMin:0,scaleMax:e,steps:t}}let{scaleMax:a,steps:o}=P(Math.max(Math.abs(r),Math.abs(i)),n);return{scaleMin:-a,scaleMax:a,steps:o}}function B(e,t,n,r=0){let i=n-t||1,a=(e-t)/i;return r<=0?a*100:r+a*(100-r*2)}function V(e,n){return e.length>1&&e.every(t=>t.color===e[0]?.color)?e.map((e,r)=>({...e,color:t(r,n)})):e}function H(e,t,n,r){let i=(r-90)*Math.PI/180;return{x:e+n*Math.cos(i),y:t+n*Math.sin(i)}}function U(e,t,n,r,i){if(i-r>=360)return`M ${e} ${t-n} A ${n} ${n} 0 1 1 ${e-.01} ${t-n} Z`;let a=H(e,t,n,r),o=H(e,t,n,i),s=+(i-r>180);return`M ${e} ${t} L ${a.x} ${a.y} A ${n} ${n} 0 ${s} 1 ${o.x} ${o.y} Z`}var W={root(){return`<div class="chart-container" part="container"></div>`},barChart({series:e,categories:t}){let{valueLabel:n,categoryLabel:r,showValues:i,showLegend:a}=this.options,o=e.flatMap(e=>e.points),s=Math.max(...o.map(e=>e.value)),{scaleMax:c,xAxisTicks:l,gridLines:u}=this.scaledBarAxesMarkup(s),d=e.length,f=d>1,p=A(t.length,d),m=t.map((n,r)=>`<div class="bar-category-row" style="--row-top: ${j(r,t.length,p.inset)}%;">${e.map(e=>{let t=e.points.find(e=>e.label===n);return t?this.barItem(t,c,i,f):``}).join(``)}</div>`).join(``),h=(a??(d>1||!!e[0]?.name))&&e.some(e=>e.name)?`<div class="line-legend" part="legend">${e.filter(e=>e.name).map(e=>this.lineLegendItem(e)).join(``)}</div>`:``,g=`
        <div class="chart-wrapper ${r?``:`chart-wrapper--no-y-label`}" part="plot">
          ${r?`<div class="y-axis-label" part="category-axis-label">${r}</div>`:``}
          <div class="y-axis-track bar-category-track" part="category-axis">
            ${this.barCategoryLabelMarkup(t,p.inset)}
          </div>
          <div class="chart-area" part="plot-area">
            <div class="grid-lines-vertical" part="grid">${u}</div>
            <div class="bars-container" part="bars">
              ${m}
            </div>
          </div>
        </div>
        <div class="x-axis" part="value-axis">
          <div class="x-axis-gutter" aria-hidden="true"></div>
          <div class="x-axis-panel">
            <div class="x-axis-ticks x-axis-values">${l}</div>
            ${n?`<div class="x-axis-label" part="value-axis-label">${n}</div>`:``}
          </div>
        </div>
        ${h}`;return O(`bar-chart`,b(`Bar chart`,e,t,r,n),T(e,t,r,n),g)},scaledBarAxesMarkup(e){let{scaleMax:t,steps:n}=N(e,this.options?.scalePadding),r=e=>e/t*100;return{scaleMax:t,xAxisTicks:n.map(e=>`<div class="x-axis-value-tick" style="--tick-position: ${r(e)}%;">${e}</div>`).join(``),gridLines:n.map(e=>`<div class="grid-line-vertical" style="--tick-position: ${r(e)}%;"></div>`).join(``)}},barItem(e,t,n,r=!1){let i=e.value/t*100;return`
      <div class="bar-item${r?` bar-item--grouped`:``}" style="--bar-width: ${i}%; --bar-color: ${e.color};">
        <div class="bar-fill" part="bar"></div>
        ${n?`<div class="bar-value-label" part="value-label">${e.value}</div>`:``}
      </div>
    `},columnChart({series:e,categories:t}){let{valueLabel:n,categoryLabel:r,showValues:i,showLegend:a}=this.options,o=e.flatMap(e=>e.points),s=Math.max(...o.map(e=>e.value)),{scaleMax:c,yAxisTicks:l,gridLines:u}=this.scaledAxesMarkup(s),d=e.length,f=A(t.length,d),p=t.flatMap((n,r)=>e.map((e,n)=>{let a=e.points.find(e=>e.label===t[r]);return a?this.columnItem(a,c,t.length,r,i,f,n,d):``})).join(``),m=(a??(d>1||!!e[0]?.name))&&e.some(e=>e.name)?`<div class="line-legend" part="legend">${e.filter(e=>e.name).map(e=>this.lineLegendItem(e)).join(``)}</div>`:``,h=`
        <div class="chart-wrapper ${n?``:`chart-wrapper--no-y-label`}" part="plot">
          ${n?`<div class="y-axis-label" part="value-axis-label">${n}</div>`:``}
          <div class="y-axis-track" part="value-axis">${l}</div>
          <div class="chart-area" part="plot-area">
            <div class="grid-lines" part="grid">${u}</div>
            <div class="columns-container" part="columns">
              ${p}
            </div>
          </div>
        </div>
        <div class="x-axis" part="category-axis">
          <div class="x-axis-gutter" aria-hidden="true"></div>
          <div class="x-axis-panel">
            <div class="x-axis-ticks">
              ${this.categoryLabelMarkup(t,f.inset)}
            </div>
            ${r?`<div class="x-axis-label" part="category-axis-label">${r}</div>`:``}
          </div>
        </div>
        ${m}`;return O(`column-chart`,b(`Column chart`,e,t,r,n),T(e,t,r,n),h)},scaledAxesMarkup(e){let{scaleMax:t,steps:n}=N(e,this.options?.scalePadding),r=e=>e/t*100;return{scaleMax:t,yAxisTicks:n.map(e=>`<div class="y-axis-tick" style="--tick-position: ${r(e)}%;">${e}</div>`).join(``),gridLines:n.map(e=>`<div class="grid-line" style="--tick-position: ${r(e)}%;"></div>`).join(``)}},columnItem(e,t,n,r,i,a,o=0,s=1){let c=e.value/t*100,l=j(r,n,a.inset),u=a.barWidth,d=l;if(s>1){let e=a.barWidth*.08;d=l-(a.barWidth*s+e*(s-1))/2+o*(a.barWidth+e)+a.barWidth/2}return`
      <div class="column-item" style="--column-left: ${d}%; --column-width: ${u}%; --column-height: ${c}%; --column-color: ${e.color};">
        ${i?`<div class="column-value-label" part="value-label">${e.value}</div>`:``}
        <div class="column-bar" part="column"></div>
      </div>
    `},lineChart({series:e,categories:t}){let{valueLabel:n,categoryLabel:r,showValues:i,showLegend:a}=this.options,o=e.flatMap(e=>e.points),s=Math.max(...o.map(e=>e.value)),{scaleMax:c,yAxisTicks:l,gridLines:u}=this.scaledAxesMarkup(s),d=A(t.length,e.length),f=e.map(e=>`<polyline class="line-path" part="line" points="${M(e.points,t,c,d.inset).map(e=>`${e.x},${e.y}`).join(` `)}" style="--line-color: ${e.color};" vector-effect="non-scaling-stroke"></polyline>`).join(``),p=e.flatMap(e=>M(e.points,t,c,d.inset).map(e=>this.linePoint(e.point,e.x,e.bottom,i)).join(``)).join(``),m=(a??(e.length>1||!!e[0]?.name))&&e.some(e=>e.name)?`<div class="line-legend" part="legend">${e.filter(e=>e.name).map(e=>this.lineLegendItem(e)).join(``)}</div>`:``,h=`
        <div class="chart-wrapper ${n?``:`chart-wrapper--no-y-label`}" part="plot">
          ${n?`<div class="y-axis-label" part="value-axis-label">${n}</div>`:``}
          <div class="y-axis-track" part="value-axis">${l}</div>
          <div class="chart-area" part="plot-area">
            <div class="grid-lines" part="grid">${u}</div>
            <svg class="line-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              ${f}
            </svg>
            <div class="line-points-container" part="points">
              ${p}
            </div>
          </div>
        </div>
        <div class="x-axis" part="category-axis">
          <div class="x-axis-gutter" aria-hidden="true"></div>
          <div class="x-axis-panel">
            <div class="x-axis-ticks">
              ${this.categoryLabelMarkup(t,d.inset)}
            </div>
            ${r?`<div class="x-axis-label" part="category-axis-label">${r}</div>`:``}
          </div>
        </div>
        ${m}`;return O(`line-chart`,b(`Line chart`,e,t,r,n),T(e,t,r,n),h)},areaChart({series:e,categories:t}){let{valueLabel:n,categoryLabel:r,showValues:i,showLegend:a}=this.options,o=F(e,t),{scaleMax:s,yAxisTicks:c,gridLines:l}=this.scaledAxesMarkup(o),u=A(t.length,1),d=e.map((n,r)=>`<path class="area-path" part="area" d="${R(r,e,t,s,u.inset)}" style="--area-color: ${n.color};" vector-effect="non-scaling-stroke"></path>`).join(``),f=i?e.flatMap((n,r)=>t.flatMap((a,o)=>{let c=n.points.find(e=>e.label===a);if(!c)return[];let{x:l,top:d}=L(r,e,t,o,s,u.inset);return this.areaPoint(c,l,d,i)})).join(``):``,p=(a??(e.length>1||!!e[0]?.name))&&e.some(e=>e.name)?`<div class="line-legend" part="legend">${e.filter(e=>e.name).map(e=>this.areaLegendItem(e)).join(``)}</div>`:``,m=`
        <div class="chart-wrapper ${n?``:`chart-wrapper--no-y-label`}" part="plot">
          ${n?`<div class="y-axis-label" part="value-axis-label">${n}</div>`:``}
          <div class="y-axis-track" part="value-axis">${c}</div>
          <div class="chart-area" part="plot-area">
            <div class="grid-lines" part="grid">${l}</div>
            <svg class="line-svg area-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              ${d}
            </svg>
            <div class="line-points-container" part="points">
              ${f}
            </div>
          </div>
        </div>
        <div class="x-axis" part="category-axis">
          <div class="x-axis-gutter" aria-hidden="true"></div>
          <div class="x-axis-panel">
            <div class="x-axis-ticks">
              ${this.categoryLabelMarkup(t,u.inset)}
            </div>
            ${r?`<div class="x-axis-label" part="category-axis-label">${r}</div>`:``}
          </div>
        </div>
        ${p}`;return O(`area-chart`,b(`Stacked area chart`,e,t,r,n),T(e,t,r,n),m)},areaLegendItem(e){return`
      <div class="line-legend-item">
        <div class="area-legend-swatch" style="--legend-color: ${e.color};"></div>
        <span class="line-legend-label">${e.name}</span>
      </div>
    `},areaPoint(e,t,n,r){return`
      <div class="line-point-item" style="--left-position: ${t}%; --bottom-position: ${n}%; --dot-color: ${e.color};">
        ${r?`<span class="line-value-label" part="value-label">${e.value}</span>`:``}
        <div class="line-dot" part="point"></div>
      </div>
    `},scatterChart({series:e}){let{valueLabel:t,categoryLabel:n,showValues:r,showLegend:i}=this.options,a=e.flatMap(e=>e.points),o=a.map(e=>e.x),s=a.map(e=>e.y),c=z(o),l=z(s),u=l.steps.map(e=>`<div class="y-axis-tick" style="--tick-position: ${B(e,l.scaleMin,l.scaleMax)}%;">${e}</div>`).join(``),d=l.steps.map(e=>`<div class="grid-line" style="--tick-position: ${B(e,l.scaleMin,l.scaleMax)}%;"></div>`).join(``),f=c.steps.map(e=>`<div class="x-axis-value-tick" style="--tick-position: ${B(e,c.scaleMin,c.scaleMax,6)}%;">${e}</div>`).join(``),p=c.steps.map(e=>`<div class="grid-line-vertical" style="--tick-position: ${B(e,c.scaleMin,c.scaleMax,6)}%;"></div>`).join(``),m=e.flatMap(e=>e.points.map(e=>this.scatterPoint(e,c,l,6,r)).join(``)).join(``),h=(i??(e.length>1||!!e[0]?.name))&&e.some(e=>e.name)?`<div class="line-legend" part="legend">${e.filter(e=>e.name).map(e=>this.scatterLegendItem(e)).join(``)}</div>`:``,g=`
        <div class="chart-wrapper ${t?``:`chart-wrapper--no-y-label`}" part="plot">
          ${t?`<div class="y-axis-label" part="value-axis-label">${t}</div>`:``}
          <div class="y-axis-track" part="value-axis">${u}</div>
          <div class="chart-area" part="plot-area">
            <div class="grid-lines" part="grid">${d}</div>
            <div class="grid-lines-vertical" part="grid-x">${p}</div>
            <div class="scatter-points-container" part="points">
              ${m}
            </div>
          </div>
        </div>
        <div class="x-axis" part="category-axis">
          <div class="x-axis-gutter" aria-hidden="true"></div>
          <div class="x-axis-panel">
            <div class="x-axis-ticks x-axis-values scatter-x-ticks">${f}</div>
            ${n?`<div class="x-axis-label" part="category-axis-label">${n}</div>`:``}
          </div>
        </div>
        ${h}`;return O(`scatter-chart`,S(e,n,t),E(e,n,t),g)},scatterPoint(e,t,n,r,i){let a=B(e.x,t.scaleMin,t.scaleMax,r),o=B(e.y,n.scaleMin,n.scaleMax),s=e.label||`(${e.x}, ${e.y})`;return`
      <div class="scatter-point-item" style="--left-position: ${a}%; --bottom-position: ${o}%; --dot-color: ${e.color};" title="${s}">
        ${i?`<span class="scatter-value-label" part="value-label">${e.y}</span>`:``}
        <div class="scatter-dot" part="point"></div>
      </div>
    `},scatterLegendItem(e){return`
      <div class="line-legend-item">
        <div class="scatter-legend-dot" style="--legend-color: ${e.color};"></div>
        <span class="line-legend-label">${e.name}</span>
      </div>
    `},categoryLabelMarkup(e,t){let n=e.length,r=t??4;return e.map((e,t)=>`<div class="x-axis-tick" style="--tick-position: ${j(t,n,r)}%;" title="${e}">${e}</div>`).join(``)},barCategoryLabelMarkup(e,t){let n=e.length,r=t??4;return e.map((e,t)=>`<div class="y-axis-category-tick" style="--tick-position: ${j(t,n,r)}%;" title="${e}">${e}</div>`).join(``)},lineLegendItem(e){return`
      <div class="line-legend-item">
        <div class="line-legend-line" style="--legend-color: ${e.color};"></div>
        <span class="line-legend-label">${e.name}</span>
      </div>
    `},linePoint(e,t,n,r){return`
      <div class="line-point-item" style="--left-position: ${t}%; --bottom-position: ${n}%; --dot-color: ${e.color};">
        ${r?`<span class="line-value-label" part="value-label">${e.value}</span>`:``}
        <div class="line-dot" part="point"></div>
      </div>
    `},pieChart({series:e}){return e.length>1?this.piePanelChart({series:e}):this.singlePieChart(e[0]?.points??[])},singlePieChart(e){let{showLegend:t}=this.options,n=e.reduce((e,t)=>e+t.value,0),r=this.getPieSegments(e,n),i=t??!0;return O(`pie-chart`,w([{name:``,points:e}]),D([{name:``,points:e}]),this.piePlotMarkup(e,r,n,i))},piePanelChart({series:e}){let{showLegend:t,colors:n}=this.options,r=t??!0,i=`<div class="pie-panels" part="plot">${e.map(e=>{let t=V(e.points,n),i=t.reduce((e,t)=>e+t.value,0),a=this.getPieSegments(t,i);return`
        <div class="pie-panel" part="panel">
          ${e.name?`<div class="pie-panel-title" part="panel-title"><span class="pie-panel-title-swatch" style="--legend-color: ${e.color};"></span>${e.name}</div>`:``}
          ${this.piePlotMarkup(t,a,i,r)}
        </div>
      `}).join(``)}</div>`;return O(`pie-chart pie-chart--panel`,w(e),D(e),i)},piePlotMarkup(e,t,n,r){return`
      <div class="pie-plot" part="plot">
        <svg class="pie-svg" viewBox="-18 -18 136 136" aria-hidden="true">
          ${t.map(e=>`<path class="pie-slice" part="slice" d="${e.path}" fill="${e.point.color}"></path>${e.labelMarkup}`).join(``)}
        </svg>
        ${r?`<div class="pie-legend" part="legend">${e.map(e=>this.pieLegendItem(e,n)).join(``)}</div>`:``}
      </div>
    `},pieLabelMarkup(e,t,n,r,i,a,o){let s=String(e);if(a>=o){let e=H(t,n,r*.58,i);return`<text class="pie-label pie-label--inside" x="${e.x.toFixed(2)}" y="${e.y.toFixed(2)}" text-anchor="middle" dominant-baseline="middle">${s}</text>`}let c=H(t,n,r,i),l=H(t,n,r+7,i),u=l.x>=t,d=u?l.x+12:l.x-12,f=u?`start`:`end`,p=u?d+1.5:d-1.5;return`
      <polyline class="pie-callout" points="${c.x.toFixed(2)},${c.y.toFixed(2)} ${l.x.toFixed(2)},${l.y.toFixed(2)} ${d.toFixed(2)},${l.y.toFixed(2)}"></polyline>
      <text class="pie-label pie-label--outside" x="${p.toFixed(2)}" y="${l.y.toFixed(2)}" text-anchor="${f}" dominant-baseline="middle">${s}</text>
    `},pieLegendItem(e,t){let n=t>0?e.value/t*100:0;return`
      <div class="pie-legend-item">
        <div class="pie-legend-color" style="--legend-color: ${e.color};"></div>
        <span class="pie-legend-label">${e.label}</span>
        <span class="pie-legend-percent">${n.toFixed(1)}%</span>
      </div>
    `},getPieSegments(e,t){let n=0;return e.map(e=>{let r=t>0?e.value/t*360:0,i=n+r,a=n+r/2,o=U(50,50,38,n,i),s=this.pieLabelMarkup(e.value,50,50,38,a,r,22);return n=i,{path:o,point:e,labelMarkup:s}})}},G=`chart-update`,K=`:host{width:100%;min-width:0;font:inherit;color:canvastext;--chart-font:inherit;--chart-text:CanvasText;--chart-text-muted:color-mix(in srgb, CanvasText 55%, transparent);--chart-axis-color:color-mix(in srgb, CanvasText 28%, transparent);--chart-grid-color:color-mix(in srgb, CanvasText 10%, transparent);--chart-plot-bg:color-mix(in srgb, Canvas 94%, CanvasText 6%);--chart-height:16em;--chart-radius:10px;--chart-bar-radius:6px;--chart-line-width:2.5px;--chart-dot-size:.55em;display:block;container-type:inline-size}.chart-container{min-width:0;padding:.25em;overflow:hidden}.chart-container [part=empty]{color:var(--chart-text-muted);font:inherit;text-align:center;margin:0;padding:1.5em}.chart{width:100%;min-width:0;position:relative}.chart:focus-visible{outline:2px solid var(--chart-axis-color);outline-offset:2px}.chart-data{clip:rect(0, 0, 0, 0);white-space:nowrap;border:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}.chart-sr-summary{margin:0}.chart-sr-table{border-collapse:collapse}.chart-empty{color:var(--chart-text-muted);font:inherit;text-align:center;margin:0;padding:1.5em}.bar-chart,.column-chart,.line-chart,.area-chart,.scatter-chart{flex-direction:column;gap:.65em;padding:.35em 0;display:flex}.bar-category-track{min-height:0;position:relative}.y-axis-category-tick{right:0;top:var(--tick-position);font:inherit;color:var(--chart-text-muted);text-overflow:ellipsis;white-space:nowrap;text-align:right;max-width:100%;padding-right:.5em;font-size:.6875rem;font-weight:500;position:absolute;overflow:hidden;transform:translateY(-50%)}.grid-lines-vertical,.grid-lines{pointer-events:none;position:absolute;inset:0}.grid-line-vertical{top:0;bottom:0;left:var(--tick-position);border-left:1px dashed var(--chart-grid-color);width:0;position:absolute}.bars-container{position:absolute;inset:0}.bar-chart .x-axis-values{margin-top:0;padding:0}.bar-category-row{left:0;right:0;top:var(--row-top);flex-direction:column;justify-content:center;gap:.15em;display:flex;position:absolute;transform:translateY(-50%)}.bar-item{flex:none;align-items:center;display:flex;position:relative}.bar-item--grouped{flex:none}.bar-fill{height:.85em;width:var(--bar-width);background-color:var(--bar-color);border-radius:0 var(--chart-bar-radius) var(--chart-bar-radius) 0;opacity:.92;border:none;min-width:2px}.bar-item--grouped .bar-fill{height:.55em}.bar-value-label{left:var(--bar-width);font:inherit;font-variant-numeric:tabular-nums;color:var(--chart-text);white-space:nowrap;margin-left:.4em;font-size:.75rem;font-weight:600;position:absolute}.x-axis-values{min-width:0;height:1.35em;margin-top:.35em;padding:0 4%;position:relative}.x-axis-value-tick{left:var(--tick-position);font:inherit;font-variant-numeric:tabular-nums;color:var(--chart-text-muted);font-size:.6875rem;font-weight:500;position:absolute;transform:translate(-50%)}.chart-wrapper{height:var(--chart-height);gap:.5em;min-width:0;display:flex;overflow:visible}.column-chart .chart-wrapper,.line-chart .chart-wrapper,.area-chart .chart-wrapper,.scatter-chart .chart-wrapper,.bar-chart .chart-wrapper{grid-template-rows:auto 1fr;grid-template-columns:max(2.75em,5ch) 1fr;column-gap:.5em;display:grid}.column-chart .chart-wrapper--no-y-label,.line-chart .chart-wrapper--no-y-label,.area-chart .chart-wrapper--no-y-label,.scatter-chart .chart-wrapper--no-y-label,.bar-chart .chart-wrapper--no-y-label{grid-template-rows:1fr}.column-chart .chart-wrapper--no-y-label .y-axis-track,.line-chart .chart-wrapper--no-y-label .y-axis-track,.area-chart .chart-wrapper--no-y-label .y-axis-track,.scatter-chart .chart-wrapper--no-y-label .y-axis-track,.bar-chart .chart-wrapper--no-y-label .bar-category-track,.column-chart .chart-wrapper--no-y-label .chart-area,.line-chart .chart-wrapper--no-y-label .chart-area,.area-chart .chart-wrapper--no-y-label .chart-area,.scatter-chart .chart-wrapper--no-y-label .chart-area,.bar-chart .chart-wrapper--no-y-label .chart-area{grid-row:1}.y-axis{flex-direction:column;flex-shrink:0;width:max(2.75em,5ch);display:flex}.column-chart .y-axis-label,.line-chart .y-axis-label,.area-chart .y-axis-label,.scatter-chart .y-axis-label,.bar-chart .y-axis-label{text-align:right;font:inherit;letter-spacing:.02em;color:var(--chart-text);flex-shrink:0;grid-area:1/1;padding:0 .5em .35em;font-size:.75rem;font-weight:600}.bar-chart .y-axis-label{white-space:normal;line-height:1.25}.y-axis-label{text-align:right;font:inherit;letter-spacing:.02em;color:var(--chart-text);flex-shrink:0;padding:0 .5em .35em;font-size:.75rem;font-weight:600}.column-chart .y-axis-track,.line-chart .y-axis-track,.area-chart .y-axis-track,.scatter-chart .y-axis-track,.bar-chart .bar-category-track{grid-area:2/1;min-height:0;position:relative}.y-axis-track{flex:1;min-height:0;position:relative}.y-axis-tick{right:0;top:calc(100% - var(--tick-position));font:inherit;font-variant-numeric:tabular-nums;color:var(--chart-text-muted);white-space:nowrap;padding-right:.5em;font-size:.6875rem;font-weight:500;position:absolute;transform:translateY(-50%)}.chart-area{background-color:var(--chart-plot-bg);border-radius:var(--chart-radius);min-width:0;box-shadow:inset 0 0 0 1px var(--chart-grid-color);border:none;flex:1;position:relative;overflow:visible}.column-chart .chart-area,.line-chart .chart-area,.area-chart .chart-area,.scatter-chart .chart-area,.bar-chart .chart-area{grid-area:2/2}.grid-line{border-top:1px dashed var(--chart-grid-color);width:100%;height:0;left:0;bottom:var(--tick-position);position:absolute}.columns-container{padding-top:2px;position:absolute;inset:0}.column-value-label{left:50%;bottom:var(--column-height);font:inherit;font-variant-numeric:tabular-nums;color:var(--chart-text);white-space:nowrap;pointer-events:none;font-size:.6875rem;font-weight:600;position:absolute;transform:translate(-50%,calc(-100% - .35em))}.x-axis{align-items:stretch;gap:.5em;min-width:0;margin-top:.25em;display:flex}.x-axis-gutter{flex-shrink:0;width:max(2.75em,5ch)}.x-axis-panel{flex:1;min-width:0}.x-axis-label{text-align:center;font:inherit;letter-spacing:.02em;color:var(--chart-text);margin-top:.5em;font-size:.75rem;font-weight:600}.x-axis-ticks{min-width:0;height:1.35em;position:relative}.x-axis-tick{left:var(--tick-position);font:inherit;color:var(--chart-text-muted);text-overflow:ellipsis;white-space:nowrap;text-align:center;max-width:5em;font-size:.6875rem;font-weight:500;position:absolute;overflow:hidden;transform:translate(-50%)}.column-item{bottom:0;left:var(--column-left);width:var(--column-width);min-width:0;height:100%;position:absolute;transform:translate(-50%)}.column-bar{background-color:var(--column-color);border-radius:var(--chart-bar-radius) var(--chart-bar-radius) 0 0;width:100%;min-height:2px;height:var(--column-height);box-sizing:border-box;opacity:.92;border:none;position:absolute;bottom:0;left:0}.line-svg{pointer-events:none;width:100%;height:100%;position:absolute;inset:0;overflow:visible}.line-path{fill:none;stroke:var(--line-color,CanvasText);stroke-width:var(--chart-line-width);stroke-linecap:round;stroke-linejoin:round}.area-path{fill:var(--area-color,CanvasText);fill-opacity:.22;stroke:var(--area-color,CanvasText);stroke-width:var(--chart-line-width);stroke-linejoin:round;stroke-linecap:round}.area-legend-swatch{background-color:var(--legend-color);opacity:.85;border:none;border-radius:3px;flex-shrink:0;width:.75em;height:.75em}.scatter-points-container{pointer-events:none;position:absolute;inset:0}.scatter-point-item{left:var(--left-position);bottom:var(--bottom-position);flex-direction:column;align-items:center;display:flex;position:absolute;transform:translate(-50%,50%)}.scatter-dot{width:var(--chart-dot-size);height:var(--chart-dot-size);border:2px solid var(--chart-plot-bg);box-shadow:0 0 0 1.5px var(--dot-color);background-color:var(--dot-color);border-radius:50%}.scatter-value-label{font:inherit;font-variant-numeric:tabular-nums;color:var(--chart-text);white-space:nowrap;font-size:.6875rem;font-weight:600;position:absolute;bottom:calc(100% + .25em)}.scatter-legend-dot{width:var(--chart-dot-size);height:var(--chart-dot-size);background-color:var(--legend-color);border:none;border-radius:50%;flex-shrink:0}.scatter-x-ticks{padding:0}.line-points-container{pointer-events:none;position:absolute;inset:0}.line-point-item{left:var(--left-position);bottom:var(--bottom-position);flex-direction:column;align-items:center;display:flex;position:absolute;transform:translate(-50%,50%)}.line-dot{width:var(--chart-dot-size);height:var(--chart-dot-size);border:2px solid var(--chart-plot-bg);box-shadow:0 0 0 1.5px var(--dot-color);background-color:var(--dot-color);border-radius:50%}.line-value-label{font:inherit;font-variant-numeric:tabular-nums;color:var(--chart-text);white-space:nowrap;font-size:.6875rem;font-weight:600;position:absolute;bottom:calc(100% + .25em)}.line-legend,.pie-legend{font:inherit;flex-wrap:wrap;justify-content:flex-start;gap:.5em 1.25em;padding-top:.5em;font-size:.75rem;display:flex}.line-legend-item,.pie-legend-item{align-items:center;gap:.45em;display:flex}.line-legend-line{background-color:var(--legend-color);border:none;border-radius:999px;width:1.1em;height:3px}.line-legend-label,.pie-legend-label{color:var(--chart-text);font-weight:500}.pie-chart{padding:.35em 0}.pie-panels{grid-template-columns:repeat(auto-fit,minmax(min(100%,14em),1fr));gap:1.25em 1.5em;min-width:0;display:grid}.pie-panel{flex-direction:column;align-items:center;min-width:0;display:flex}.pie-panel-title{font:inherit;color:var(--chart-text);text-align:center;justify-content:center;align-items:center;gap:.45em;margin-bottom:.35em;font-size:.8125rem;font-weight:600;display:flex}.pie-panel-title-swatch{background-color:var(--legend-color);border-radius:999px;flex-shrink:0;width:.65em;height:.65em}.pie-chart--panel .pie-plot{align-items:center;width:100%}.pie-chart--panel .pie-svg{width:min(12em,100%)}.pie-chart--panel .pie-legend{justify-content:center}.pie-plot{flex-direction:column;align-items:flex-start;gap:.85em;min-height:12em;padding:.35em;display:flex}.pie-svg{width:min(16em,100%);height:auto;filter:drop-shadow(0 4px 12px color-mix(in srgb, CanvasText 8%, transparent));overflow:visible}.pie-slice{stroke:var(--chart-plot-bg);stroke-width:2px}.pie-label{font:inherit;pointer-events:none}.pie-label--inside{fill:#fff;font-size:5px;font-weight:600}.pie-label--outside{fill:var(--chart-text);font-size:5px;font-weight:500}.pie-callout{fill:none;stroke:var(--chart-text-muted);stroke-width:.5px;opacity:.7}.pie-legend-color{background-color:var(--legend-color);border:none;border-radius:3px;flex-shrink:0;width:.65em;height:.65em}.pie-legend-percent{color:var(--chart-text-muted);font-variant-numeric:tabular-nums}@container (width<=20em){.bar-value-label,.column-value-label,.line-value-label,.scatter-value-label{display:none}}`,q=class extends HTMLElement{static templates=W;static styles=K;static sheet;#e=`column`;#t=null;#n=()=>this.render();constructor(){super();let e=this.attachShadow({mode:`open`}),t=this.constructor,{templates:n,styles:r,sheet:i}=t;e.adoptedStyleSheets&&=(i||(i=new CSSStyleSheet,i.replaceSync(r),t.sheet=i),[i]),this._setShadowHTML(n.root(),e),this.#t=e.querySelector(`.chart-container`)}connectedCallback(){this.#e=this.getAttribute(`type`)||`column`,this.addEventListener(G,this.#n),this.render()}disconnectedCallback(){this.removeEventListener(G,this.#n)}static get observedAttributes(){return l}attributeChangedCallback(e,t,n){e===`type`&&(this.#e=n||`column`),this.render()}#r(){return o(this)}_setShadowHTML(e,t){let n=this.constructor;!t.adoptedStyleSheets&&n.styles&&(e=`<style>${n.styles}</style>\n${e}`),t.innerHTML=e}set type(e){this.#e=e,this.render()}get type(){return this.#e}#i(e,t){return{label:e.getAttribute(`label`)||``,value:parseFloat(e.getAttribute(`value`)||`0`),color:e.getAttribute(`color`)||t}}#a(e,t){return{label:e.getAttribute(`label`)||``,x:parseFloat(e.getAttribute(`x`)||`0`),y:parseFloat(e.getAttribute(`value`)||`0`),color:e.getAttribute(`color`)||t}}#o(e){let n=e.colors,r=Array.from(this.querySelectorAll(`:scope > data-chart-group`)),i;if(r.length>0)i=r.map((e,r)=>{let i=e.getAttribute(`label`)||e.getAttribute(`name`)||`Series ${r+1}`,a=e.getAttribute(`color`)||t(r,n);return{name:i,color:a,points:Array.from(e.querySelectorAll(`data-chart-point`)).map(e=>this.#a(e,a))}});else{let e=Array.from(this.querySelectorAll(`:scope > data-chart-point`));i=[...new Set(e.map(e=>e.getAttribute(`group`)||`default`))].map((r,i)=>{let a=t(i,n),o=e.filter(e=>(e.getAttribute(`group`)||`default`)===r).map(e=>this.#a(e,a));return{name:r==="default"?``:r,color:o[0]?.color||a,points:o}})}return{series:i}}#s(e){let n=e.colors,r=Array.from(this.querySelectorAll(`:scope > data-chart-group`)),i;if(r.length>0)i=r.map((e,r)=>{let i=e.getAttribute(`label`)||e.getAttribute(`name`)||`Series ${r+1}`,a=e.getAttribute(`color`)||t(r,n);return{name:i,color:a,points:Array.from(e.querySelectorAll(`data-chart-point`)).map(e=>this.#i(e,a))}});else{let e=Array.from(this.querySelectorAll(`:scope > data-chart-point`));i=[...new Set(e.map(e=>e.getAttribute(`group`)||`default`))].map((r,i)=>{let a=t(i,n),o=e.filter(e=>(e.getAttribute(`group`)||`default`)===r).map(e=>this.#i(e,a));return{name:r==="default"?``:r,color:o[0]?.color||a,points:o}})}let a=[],o=new Set;for(let e of i)for(let t of e.points)t.label&&!o.has(t.label)&&(o.add(t.label),a.push(t.label));return{series:i,categories:a}}#c(){let e=this.#t?.querySelector(`[part="chart"]`);if(e){let t=e.getAttribute(`aria-label`);t?this.setAttribute(`aria-label`,t):this.removeAttribute(`aria-label`),this.setAttribute(`role`,`group`)}else this.removeAttribute(`aria-label`),this.removeAttribute(`role`)}render(){if(!this.#t||!this.isConnected)return;let e=this.#r();c(this,e);let{templates:t}=this.constructor,n=``;switch(this.#e){case`bar`:{let r=this.#s(e);if(r.series.flatMap(e=>e.points).length===0){this.#t.innerHTML=k(e.emptyMessage),this.#c();return}n=t.barChart.call({...t,options:e},r);break}case`column`:{let r=this.#s(e);if(r.series.flatMap(e=>e.points).length===0){this.#t.innerHTML=k(e.emptyMessage),this.#c();return}n=t.columnChart.call({...t,options:e},r);break}case`line`:{let r=this.#s(e);if(r.series.flatMap(e=>e.points).length===0){this.#t.innerHTML=k(e.emptyMessage),this.#c();return}n=t.lineChart.call({...t,options:e},r);break}case`area`:{let r=this.#s(e);if(r.series.flatMap(e=>e.points).length===0){this.#t.innerHTML=k(e.emptyMessage),this.#c();return}n=t.areaChart.call({...t,options:e},r);break}case`scatter`:{let r=this.#o(e);if(r.series.flatMap(e=>e.points).length===0){this.#t.innerHTML=k(e.emptyMessage),this.#c();return}n=t.scatterChart.call({...t,options:e},r);break}case`pie`:{let r=this.#s(e);if(r.series.flatMap(e=>e.points).length===0){this.#t.innerHTML=k(e.emptyMessage),this.#c();return}n=t.pieChart.call({...t,options:e},r);break}}this.#t.innerHTML=n,this.#c()}};customElements.define(`data-chart`,q);var J=`data-chart-theme`,Y=document.documentElement,X=document.querySelectorAll(`.theme-switcher [data-theme]`),Z=e=>{Y.setAttribute(`data-theme`,e),localStorage.setItem(J,e),X.forEach(t=>{t.setAttribute(`aria-pressed`,String(t.dataset.theme===e))})};X.forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.theme;t&&Z(t)})}),Z(Y.getAttribute(`data-theme`)||`dark`);var Q=document.getElementById(`playgroundChart`),$=document.querySelectorAll(`.segmented [data-type]`);Q instanceof q&&$.forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.type;t&&(Q.type=t,$.forEach(t=>{t.setAttribute(`aria-pressed`,String(t===e))}))})});