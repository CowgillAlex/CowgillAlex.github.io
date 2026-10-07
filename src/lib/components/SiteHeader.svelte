<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';
	import SidebarSimpleIcon from 'phosphor-svelte/lib/SidebarSimpleIcon';
	import SunIcon from 'phosphor-svelte/lib/SunIcon';
	import MoonIcon from 'phosphor-svelte/lib/MoonIcon';
	import XIcon from 'phosphor-svelte/lib/XIcon';
	import type { Heading } from '#lib/outline.ts';
	import OutlineLinks from '#lib/components/OutlineLinks.svelte';
	let { headings, activeHash = $bindable('') }: { headings: Heading[]; activeHash?: string } = $props();
	const links = [
		{ href: '/', label: 'Home' }, { href: '/projects/', label: 'Projects' },
		{ href: '/writing/', label: 'Writing' }, { href: '/tools/', label: 'Tools' }
	];
	let light = $state(false);
	let dialog: HTMLDialogElement;
	let opener = $state<HTMLButtonElement>();
	let expanded = $state(false);
	let selectedHeading: HTMLElement | null = null;
	onMount(() => {
		light = document.documentElement.dataset.theme === 'light';
		const wideScreen = matchMedia('(min-width: 1024px)');
		const dismissOverlay = () => { if (wideScreen.matches) dialog.close(); };
		wideScreen.addEventListener('change', dismissOverlay);
		return () => wideScreen.removeEventListener('change', dismissOverlay);
	});
	afterNavigate(() => {
		dialog?.close();
	});
	function toggleTheme() {
		light = !light;
		document.documentElement.dataset.theme = light ? 'light' : 'dark';
		try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch {}
	}
	function openOutline() {
		selectedHeading = null;
		dialog.showModal();
		expanded = true;
	}
	function closeOutline() {
		expanded = false;
		if (selectedHeading) {
			const heading = selectedHeading;
			selectedHeading = null;
			heading.focus({ preventScroll: true });
			heading.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
		} else if (opener?.getClientRects().length) opener.focus({ preventScroll: true });
		else document.querySelector<HTMLAnchorElement>('.page-sidebar a')?.focus({ preventScroll: true });
	}
	async function jumpToHeading(event: MouseEvent, id: string) {
		event.preventDefault();
		selectedHeading = document.getElementById(id);
		await goto('#' + encodeURIComponent(id), { shallow: true, reset: false });
		activeHash = location.hash;
		dialog.close();
	}
</script>

<header>
	<div class="header-bar">
		<nav class="nav" aria-label="Main navigation">
			{#each links as link}
				<a href={link.href} aria-current={(link.href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(link.href)) ? 'page' : undefined}>{link.label}</a>
			{/each}
		</nav>
		<div class="controls">
			{#if headings.length > 1}
				<button class="icon-button outline-toggle" bind:this={opener} onclick={openOutline} aria-label="Open table of contents" title="Table of contents" aria-haspopup="dialog" aria-controls="page-outline" aria-expanded={expanded}><SidebarSimpleIcon size={18} aria-hidden="true" /></button>
			{/if}
			<button class="icon-button" onclick={toggleTheme} aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'} title={light ? 'Switch to dark mode' : 'Switch to light mode'}>{#if light}<MoonIcon size={18} aria-hidden="true" />{:else}<SunIcon size={18} aria-hidden="true" />{/if}</button>
		</div>
	</div>
</header>

<dialog id="page-outline" bind:this={dialog} aria-labelledby="outline-title" onclose={closeOutline} onclick={(event) => { if (event.target === dialog && event.clientX > dialog.getBoundingClientRect().right) dialog.close(); }}>
	<div class="drawer-head"><span id="outline-title">On this page</span><button class="icon-button" onclick={() => dialog.close()} aria-label="Close table of contents"><XIcon size={18} aria-hidden="true" /></button></div>
	<div class="drawer-body"><OutlineLinks {headings} bind:activeHash onselect={jumpToHeading} /></div>
</dialog>
