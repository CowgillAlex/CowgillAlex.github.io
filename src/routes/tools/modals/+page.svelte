<script lang="ts">
	import { countModals, totalCount } from '#lib/language-tools.ts';
	let input = $state('');
	let counts = $derived(countModals(input));
</script>
<svelte:head><title>Modal verb counter · Alex Cowgill</title></svelte:head>
<h1>Modal verb counter</h1>
<p class="page-intro">Find modal verbs and phrases, including negative contractions. The category counts are based on word lists; their actual meaning depends on context.</p>
<div class="panel">
	<div class="field"><label for="text-input">Text</label><textarea id="text-input" rows="9" bind:value={input}></textarea></div>
	<div class="button-row"><button class="button" onclick={() => input = ''} disabled={!input}>Clear</button></div>
	<dl class="tool-stats">
		<div><dt>Total occurrences</dt><dd>{totalCount(counts.entries)}</dd><p>{counts.entries.map(item => `${item.word} (${item.count})`).join(', ') || 'None'}</p></div>
		<div><dt>Potential epistemic uses</dt><dd>{totalCount(counts.epistemic)}</dd><p>Possibility, probability or certainty.</p></div>
		<div><dt>Potential deontic uses</dt><dd>{totalCount(counts.deontic)}</dd><p>Obligation, permission or necessity.</p></div>
	</dl>
	<p class="muted">Shared words appear in both category counts. Each occurrence is counted once in the total. "I'd" is treated as "would".</p>
</div>
