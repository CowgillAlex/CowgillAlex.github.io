<script lang="ts">
	import { generateMetaTags } from '#lib/text-tools.ts';
	import ToolOutput from '#lib/components/ToolOutput.svelte';
	let title = $state('');
	let description = $state('');
	let keywords = $state('');
	let author = $state('');
	let url = $state('');
	let output = $derived(generateMetaTags({ title, description, keywords, author, url }));
</script>
<svelte:head><title>Meta tag generator · Alex Cowgill</title></svelte:head>
<h1>Meta tag generator</h1>
<p class="page-intro">Make HTML metadata for a page, including Open Graph and social previews.</p>
<div class="panel">
	<div class="field"><label for="title">Page title</label><input id="title" bind:value={title} /></div>
	<div class="field"><label for="description">Description</label><textarea id="description" rows="3" bind:value={description}></textarea></div>
	<div class="field"><label for="url">Page URL</label><input id="url" type="url" placeholder="https://example.com/page" bind:value={url} /></div>
	<div class="field"><label for="keywords">Keywords, separated by commas</label><input id="keywords" bind:value={keywords} /></div>
	<div class="field"><label for="author">Author</label><input id="author" bind:value={author} /></div>
	<ToolOutput id="meta-output" label="Generated HTML" value={output} rows={12} />
</div>
