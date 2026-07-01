import { DataChart, type ChartType } from './index.ts';

const THEME_KEY = 'data-chart-theme';
const root = document.documentElement;
const themeButtons = document.querySelectorAll<HTMLButtonElement>('.theme-switcher [data-theme]');

const setTheme = (theme: string) => {
  root.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  themeButtons.forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.theme === theme));
  });
};

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const theme = button.dataset.theme;
    if (theme) setTheme(theme);
  });
});

setTheme(root.getAttribute('data-theme') || 'dark');

const chart = document.getElementById('playgroundChart');
const typeButtons = document.querySelectorAll<HTMLButtonElement>('.segmented [data-type]');

if (chart instanceof DataChart) {
  typeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const type = button.dataset.type as ChartType | undefined;
      if (!type) return;

      chart.type = type;

      typeButtons.forEach((btn) => {
        btn.setAttribute('aria-pressed', String(btn === button));
      });
    });
  });
}
