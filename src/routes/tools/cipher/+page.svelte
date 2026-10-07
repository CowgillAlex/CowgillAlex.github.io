<script lang="ts">
	import { substituteLetters } from '#lib/cipher.ts';
	const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
	let input = $state('');
	let replacements = $state<Record<string, string>>({});
	let output = $derived(substituteLetters(input, replacements));
</script>
<svelte:head><title>Substitution cipher helper · Alex Cowgill</title></svelte:head>
<h1>Substitution cipher helper</h1>
<p class="page-intro">Choose a replacement for each letter. Blank fields leave that letter alone.</p>
<div class="panel">
	<div class="field"><label for="cipher-input">Cipher text</label><textarea id="cipher-input" rows="5" bind:value={input}></textarea></div>
	<fieldset>
		<legend>Letter replacements</legend>
		<div class="letter-grid">
			{#each alphabet as letter}
				<label for={'letter-' + letter}>
					{letter.toUpperCase()}
					<input id={'letter-' + letter} aria-label={'Replace ' + letter.toUpperCase() + ' with'} maxlength="1" pattern="[A-Za-z]" autocomplete="off" value={replacements[letter] ?? ''} oninput={(event) => {
						const value = event.currentTarget.value.replace(/[^a-z]/gi, '');
						replacements[letter] = value;
						event.currentTarget.value = value;
					}} />
				</label>
			{/each}
		</div>
	</fieldset>
	<div class="button-row"><button class="button" onclick={() => { replacements = {}; }}>Clear replacements</button></div>
	<div class="field"><label for="cipher-output">Result</label><textarea id="cipher-output" rows="5" value={output} readonly></textarea></div>
</div>
<style>
	fieldset { border: 0; margin: 0; padding: 0; }
	legend { color: var(--text-soft); font-size: 13px; margin-bottom: 12px; }
	.letter-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(42px, 1fr)); gap: 10px; }
	.letter-grid label { text-align: center; }
	.letter-grid input { text-align: center; padding: 7px 0; text-transform: uppercase; }
</style>
