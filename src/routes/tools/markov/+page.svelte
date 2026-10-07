<script lang="ts">
	import { generateMarkovText } from '#lib/markov.ts';
	let sample = $state('');
	let order = $state(3);
	let length = $state(50);
	let output = $state('');
	let error = $state('');
	function generate(extend = false) {
		try { output = generateMarkovText(sample, order, length, extend ? output : ''); error = ''; }
		catch (cause) { error = cause instanceof Error ? cause.message : 'Could not generate text.'; }
	}
</script>
<svelte:head><title>Markov text generator · Alex Cowgill</title></svelte:head>
<h1>Markov text generator</h1>
<p class="page-intro">Generate text from a sample. Everything runs in your browser.</p>
<div class="panel">
	<div class="field"><label for="sample">Sample text</label><textarea id="sample" rows="6" placeholder="Paste a few paragraphs here…" bind:value={sample}></textarea></div>
	<div class="field"><label for="order">Order: {order} words</label><input id="order" type="range" min="1" max="10" bind:value={order} /><span class="muted">How many previous words determine the next word.</span></div>
	<div class="field"><label for="length">Length: {length} words</label><input id="length" type="range" min="4" max="1000" bind:value={length} /></div>
	<div class="button-row"><button class="button primary" onclick={() => generate()}>Generate</button><button class="button" onclick={() => generate(true)} disabled={!output}>Extend</button></div>
	{#if error}<p class="error" role="alert">{error}</p>{/if}
	<div class="field"><label for="output">Generated text</label><textarea id="output" rows="6" readonly value={output}></textarea></div>
	<p class="muted">Generation stops when the sample has no next word for the current sequence.</p>
</div>
