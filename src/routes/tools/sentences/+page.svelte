<script lang="ts">
	import { countText } from '#lib/language-tools.ts';
	let input = $state('');
	let counts = $derived(countText(input));
</script>
<svelte:head><title>Sentence counter · Alex Cowgill</title></svelte:head>
<h1>Sentence counter</h1>
<p class="page-intro">Count sentences, words and characters as you type. Sentences are split at full stops, question marks, exclamation marks and line breaks.</p>
<div class="panel">
	<div class="field"><label for="text-input">Text</label><textarea id="text-input" rows="9" bind:value={input}></textarea></div>
	<div class="button-row"><button class="button" onclick={() => input = ''} disabled={!input}>Clear</button></div>
	<dl class="tool-stats">
		<div><dt>Sentences</dt><dd>{counts.sentences}</dd></div>
		<div><dt>Words</dt><dd>{counts.words}</dd></div>
		<div><dt>Characters</dt><dd>{counts.characters}</dd></div>
		<div><dt>Without whitespace</dt><dd>{counts.withoutWhitespace}</dd></div>
		<div><dt>Words per sentence</dt><dd>{counts.average.toFixed(1)}</dd></div>
	</dl>
</div>
