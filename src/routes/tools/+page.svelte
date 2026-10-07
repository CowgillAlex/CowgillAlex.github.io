<script lang="ts">
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	const tools = [
		{ name: 'Stopwatch', href: '/tools/stopwatch/', description: 'A stopwatch with pause and reset controls.' },
		{ name: 'Clock', href: '/tools/clock/', description: 'A live display of your local date and time.' },
		{ name: 'Exam clock', href: '/tools/exam-clock/', description: 'A minimal date and time display with a centre number field.' },
		{ name: 'Markov text generator', href: '/tools/markov/', description: 'Generate text from a sample using a Markov chain.' },
		{ name: 'Substitution cipher helper', href: '/tools/cipher/', description: 'Work through a cipher with your own letter replacements.' },
		{ name: 'Meta tag generator', href: '/tools/meta-tags/', description: 'Make HTML metadata and social preview tags for a page.' },
		{ name: 'UV coordinate calculator', href: '/tools/uv/', description: 'Calculate texture atlas coordinates in Java Vector2f format.' },
		{ name: 'Markdown to HTML', href: '/tools/markdown/', description: 'Convert Markdown into a raw HTML snippet.' },
		{ name: 'Text to one line', href: '/tools/single-line/', description: 'Replace line breaks with spaces.' },
		{ name: 'DuckDuckGo lookup', href: '/tools/duck/', description: "Find a topic's instant answer from DuckDuckGo." },
		{ name: 'Sentence counter', href: '/tools/sentences/', description: 'Count sentences, words, characters and average sentence length.' },
		{ name: 'Pronoun counter', href: '/tools/pronouns/', description: 'Count first, second and third person pronouns.' },
		{ name: 'Modal verb counter', href: '/tools/modals/', description: 'Find modal verbs and phrases, including contractions.' },
		{ name: 'Sentiment analyser', href: '/tools/sentiment/', description: 'Classify the sentiment of each sentence on your device.' },
		{ name: 'Politeness analyser', href: '/tools/politeness/', description: "Analyse sentences with Intel's PoliteGuard model." },
		{ name: 'Neural text generator', href: '/tools/neural-text/', description: 'Train a small next-word model on your own text.' },
		{ name: 'Image generator', href: '/tools/image-generator/', description: 'An experiment in generating small images from your own training data.' },
		{ name: 'Video generator', href: '/tools/video-generator/', description: 'Train on video frames and generate a five-second clip.' }
	];
	const presets = [60, 120, 300, 600, 1800, 3600];
</script>
<svelte:head><title>Tools · Alex Cowgill</title></svelte:head>
<h1>Tools</h1><p class="page-intro">Small utilities I made for my own use. Help yourself.</p>
<div class="project-list">
	<div class="tool-row"><h2><a href="/tools/timer/">Countdown timers<ArrowRightIcon size={16} aria-hidden="true" /></a></h2><p>Simple timers that start when you open a preset.</p><div class="presets">{#each presets as seconds}<a href={'/tools/timer/?seconds=' + seconds}>{seconds === 3600 ? '1 hour' : seconds / 60 + (seconds === 60 ? ' minute' : ' minutes')}</a>{/each}</div></div>
	{#each tools as tool}<div class="tool-row"><h2><a href={tool.href}>{tool.name}<ArrowRightIcon size={16} aria-hidden="true" /></a></h2><p>{tool.description}</p></div>{/each}
</div>
