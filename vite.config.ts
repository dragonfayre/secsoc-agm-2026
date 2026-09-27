import { defineConfig } from 'vite';

export default defineConfig({
  // Must match the GitHub repository name for Pages to resolve assets correctly.
  base: '/secsoc-agm-2026/',
  // Treat uppercase image extensions as static assets too.
  assetsInclude: ['**/*.PNG', '**/*.JPG', '**/*.GIF'],
  build: {
    target: 'es2020',
    sourcemap: true,
    outDir: 'dist',
  },
});
