<script lang="ts">
	import { onDestroy } from 'svelte';
	let query = $state('');
	let abstract = $state('');
	let heading = $state('');
	let source = $state('');
	let sourceUrl = $state('');
	let error = $state('');
	let loading = $state(false);
	let searched = $state(false);
	let controller: AbortController | undefined;
	onDestroy(() => controller?.abort());
	async function search(event: SubmitEvent) {
		event.preventDefault();
		if (!query.trim()) return;
		controller?.abort();
		const request = new AbortController();
		controller = request;
		loading = true; searched = false; error = ''; abstract = ''; heading = ''; sourceUrl = '';
		try {
			const url = new URL('https://api.duckduckgo.com/');
			url.search = new URLSearchParams({ q: query.trim(), format: 'json', no_html: '1', skip_disambig: '1' }).toString();
			const response = await fetch(url, { signal: request.signal });
			if (!response.ok) throw new Error('Search failed.');
			const data = await response.json();
			if (request.signal.aborted) return;
			abstract = typeof data.AbstractText === 'string' ? data.AbstractText : '';
			heading = typeof data.Heading === 'string' ? data.Heading : '';
			source = typeof data.AbstractSource === 'string' ? data.AbstractSource : '';
			if (typeof data.AbstractURL === 'string' && /^https?:\/\//i.test(data.AbstractURL)) sourceUrl = data.AbstractURL;
			searched = true;
		} catch {
			if (!request.signal.aborted) error = 'Could not reach DuckDuckGo. Please try again.';
		} finally { if (controller === request) loading = false; }
	}
</script>
<svelte:head><title>DuckDuckGo lookup · Alex Cowgill</title></svelte:head>
<h1>DuckDuckGo lookup</h1>
<p class="page-intro">Look up a topic using DuckDuckGo's instant answers. Your query is sent to DuckDuckGo.</p>
<div class="panel">
	<form onsubmit={search}>
		<div class="field"><label for="query">Search term</label><input id="query" type="search" required bind:value={query} /></div>
		<div class="button-row"><button type="submit" class="button primary" disabled={loading}>{loading ? 'Searching...' : 'Search'}</button></div>
	</form>
	{#if error}<p class="error" role="alert">{error}</p>{/if}
	<div role="status">
		{#if searched}
			{#if abstract}
				<strong>{heading}</strong><p class="answer">{abstract}</p>
				{#if sourceUrl}<a class="text-link" href={sourceUrl}>{source || 'Source'}</a>{/if}
			{:else}<p>No instant answer found for that term.</p>{/if}
		{/if}
	</div>
</div>
<style>.answer { margin-top: 12px; white-space: pre-wrap; }</style>
