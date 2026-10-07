<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Heading } from '#lib/outline.ts';
	let { headings, activeHash = $bindable(''), onselect }: {
		headings: Heading[];
		activeHash?: string;
		onselect?: (event: MouseEvent, id: string) => void | Promise<void>;
	} = $props();
	async function jumpToHeading(event: MouseEvent, id: string) {
		event.preventDefault();
		await goto('#' + encodeURIComponent(id), { shallow: true, reset: false });
		activeHash = location.hash;
		const heading = document.getElementById(id);
		heading?.focus({ preventScroll: true });
		heading?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
	}
</script>

<nav class="outline-links" aria-label="Table of contents">
	{#each headings as heading}
		<a href={'#' + encodeURIComponent(heading.id)} class:subsection={heading.level === 3} aria-current={activeHash === '#' + encodeURIComponent(heading.id) ? 'location' : undefined} onclick={(event) => onselect ? onselect(event, heading.id) : jumpToHeading(event, heading.id)}>{heading.text}</a>
	{/each}
</nav>
