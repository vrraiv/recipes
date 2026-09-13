// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://recipes.vikramrai.com',
  output: 'static',
  build: {
    // Emits /recipes/foo/index.html so Workers static assets serve clean URLs.
    format: 'directory',
  },
});
