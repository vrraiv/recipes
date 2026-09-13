// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Change this to your subdomain before the first deploy.
  site: 'https://recipes.example.com',
  output: 'static',
  build: {
    // Emits /recipes/foo/index.html so Workers static assets serve clean URLs.
    format: 'directory',
  },
});
