<script lang="ts">
	import { toSingleLine } from '#lib/text-tools.ts';
	import ToolOutput from '#lib/components/ToolOutput.svelte';
	let input = $state('');
	let output = $derived(toSingleLine(input));
</script>
<svelte:head><title>Text to one line · Alex Cowgill</title></svelte:head>
<h1>Text to one line</h1>
<p class="page-intro">Replace each line break with a space.</p>
<div class="panel">
	<div class="field"><label for="multiline-input">Text</label><textarea id="multiline-input" rows="8" bind:value={input}></textarea></div>
	<ToolOutput id="single-line-output" label="Single-line text" value={output} rows={6} />
</div>
