<script lang="ts">
	import { countPronouns, totalCount } from '#lib/language-tools.ts';
	let input = $state('');
	let counts = $derived(countPronouns(input));
	const groups = [{ key: 'first', label: 'First person' }, { key: 'second', label: 'Second person' }, { key: 'third', label: 'Third person' }] as const;
</script>
<svelte:head><title>Pronoun counter · Alex Cowgill</title></svelte:head>
<h1>Pronoun counter</h1>
<p class="page-intro">Count first, second and third person pronouns, including contractions such as "I'm" and "they're".</p>
<div class="panel">
	<div class="field"><label for="text-input">Text</label><textarea id="text-input" rows="9" bind:value={input}></textarea></div>
	<div class="button-row"><button class="button" onclick={() => input = ''} disabled={!input}>Clear</button></div>
	<dl class="tool-stats">
		{#each groups as group}<div><dt>{group.label}</dt><dd>{totalCount(counts[group.key])}</dd><p>{counts[group.key].map(item => `${item.word} (${item.count})`).join(', ') || 'None'}</p></div>{/each}
		<div><dt>Total</dt><dd>{totalCount(counts.first) + totalCount(counts.second) + totalCount(counts.third)}</dd></div>
	</dl>
</div>
