<script lang="ts">
	import { marked } from 'marked';
	import ToolOutput from '#lib/components/ToolOutput.svelte';
	let input = $state('');
	let output = $derived(marked.parse(input, { async: false }));
</script>
<svelte:head><title>Markdown to HTML · Alex Cowgill</title></svelte:head>
<h1>Markdown to HTML</h1>
<p class="page-intro">Convert Markdown into an HTML snippet. The output updates as you type.</p>
<div class="panel">
	<div class="field"><label for="markdown-input">Markdown</label><textarea id="markdown-input" rows="10" bind:value={input} spellcheck="false"></textarea></div>
	<ToolOutput id="html-output" label="HTML" value={output} rows={10} />
</div>
