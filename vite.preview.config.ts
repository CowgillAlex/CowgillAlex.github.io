import { defineConfig } from 'vite';

// Serve the deployable artifact, including the archive and compatibility redirects.
// SvelteKit's usual preview serves its intermediate output instead.
export default defineConfig({
	appType: 'mpa',
	build: { outDir: 'build' }
});
