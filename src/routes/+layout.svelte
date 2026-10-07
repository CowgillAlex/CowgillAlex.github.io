<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import SiteHeader from '#lib/components/SiteHeader.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import OutlineLinks from '#lib/components/OutlineLinks.svelte';
	import { collectHeadings, type Heading } from '#lib/outline.ts';
	import type { LayoutProps } from './$types';
	let { children }: LayoutProps = $props();
	let headings = $state<Heading[]>([]);
	let activeHash = $state('');
	onMount(() => {
		const updateHash = () => { activeHash = location.hash; };
		updateHash();
		window.addEventListener('hashchange', updateHash);
		window.addEventListener('popstate', updateHash);
		return () => {
			window.removeEventListener('hashchange', updateHash);
			window.removeEventListener('popstate', updateHash);
		};
	});
	afterNavigate(async () => {
		await tick();
		const content = document.getElementById('page-content');
		headings = content ? collectHeadings(content) : [];
		activeHash = location.hash;
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" sizes="any" />
	<meta name="description" content="Alex Cowgill's projects, writing and small tools. TypeScript, Java, software and games." />
	<link rel="canonical" href={'https://www.alexco.dev' + page.url.pathname} />
</svelte:head>

{#if page.route.id === '/tools/exam-clock'}
	{@render children()}
{:else}
<div class="site">
	<a class="skip-link" href="#page-content">Skip to content</a>
	<SiteHeader {headings} bind:activeHash />
	<div class="page-body" class:has-outline={headings.length > 1}>
		{#if headings.length > 1}
			<aside class="page-sidebar" aria-labelledby="sidebar-title">
				<div class="sidebar-title" id="sidebar-title">On this page</div>
				<OutlineLinks {headings} bind:activeHash />
			</aside>
		{/if}
		<main id="page-content" tabindex="-1"><div class="content">{@render children()}</div></main>
	</div>
	<SiteFooter />
</div>
{/if}
