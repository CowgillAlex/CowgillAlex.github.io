import { cp, mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

// GitHub Pages cannot issue HTTP redirects. Keep useful old links working with
// small HTML redirects that also provide a link when JavaScript is disabled.
const redirects = {
	'home.html': '/',
	'contact.html': '/',
	'privacy.html': '/privacy/',
	'IS/index.html': '/tools/',
	'utils/stopwatch.html': '/tools/stopwatch/',
	'utils/time.html': '/tools/clock/',
	'utils/exam.html': '/tools/exam-clock/',
	'Markov.html': '/tools/markov/',
	'alex/decrypt.html': '/tools/cipher/'
};
for (const seconds of [60, 120, 300, 600, 1800, 3600]) {
	redirects['utils/timers/' + seconds + '.html'] = '/tools/timer/?seconds=' + seconds;
}
// Former edu.alexco.dev utilities also work at their old paths on this domain.
const formerTools = {
	'misc/decrypt': '/tools/cipher/',
	'misc/markov': '/tools/markov/',
	'misc/meta': '/tools/meta-tags/',
	'misc/uvs': '/tools/uv/',
	'misc/md': '/tools/markdown/',
	'misc/minify': '/tools/single-line/',
	'misc/duck': '/tools/duck/',
	'misc/token': '/tools/neural-text/',
	'misc/aigen/vid': '/tools/video-generator/',
	'English/nea/sentences': '/tools/sentences/',
	'English/nea/pronouns': '/tools/pronouns/',
	'English/nea/modal': '/tools/modals/',
	'English/nea/sentiment': '/tools/sentiment/',
	'English/nea/politeness': '/tools/politeness/'
};
for (const [path, destination] of Object.entries(formerTools)) {
	redirects[path + '.html'] = destination;
	redirects[path + '/index.html'] = destination;
}
redirects['misc/index.html'] = '/tools/';
redirects['misc/aigen/index.html'] = '/tools/image-generator/';
redirects['English/nea/index.html'] = '/tools/';
for (const [path, destination] of Object.entries(redirects)) {
	const output = 'build/' + path;
	await mkdir(dirname(output), { recursive: true });
	await writeFile(output, '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=' + destination + '"><title>Page moved</title><link rel="canonical" href="https://www.alexco.dev' + destination + '"></head><body><p>This page has moved. <a href="' + destination + '">Continue</a>.</p><script>location.replace(' + JSON.stringify(destination) + ' + location.hash)</script></body></html>');
}

// Keep Scratch's actual history at its original URLs, separate from the Java project.
await cp('projects/scratch', 'build/projects/scratch', { recursive: true });
await cp('assets', 'build/assets', { recursive: true });
for (const file of ['styles.css', 'navigation.js', 'scripts.js', 'global.css', 'base.css']) {
	await cp(file, 'build/' + file);
}
