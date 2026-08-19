/* Allow tests to assign to `global.fetch` in a jsdom environment */
declare var global: Window & typeof globalThis;
