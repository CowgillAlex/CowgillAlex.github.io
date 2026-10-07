<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LayersModel } from '@tensorflow/tfjs-layers';
	import type { Tensor } from '@tensorflow/tfjs-core';
	import ToolOutput from '#lib/components/ToolOutput.svelte';
	import LossChart from '#lib/components/LossChart.svelte';
	let sample = $state('');
	let prompt = $state('');
	let epochs = $state<number | undefined>(30);
	let output = $state('');
	let status = $state('');
	let error = $state('');
	let busy = $state(false);
	let trained = $state(false);
	let losses = $state<number[]>([]);
	let model: LayersModel | undefined;
	let vocabulary: string[] = [];
	let wordToIndex = new Map<string, number>();
	let disposed = false;
	onDestroy(() => { disposed = true; if (model) { model.stopTraining = true; if (!busy) model.dispose(); } });
	async function train() {
		if (busy) return;
		const words = sample.trim().split(/\s+/).filter(Boolean);
		if (words.length < 4) { error = 'Enter at least four words of training text.'; return; }
		if (!epochs || !Number.isInteger(epochs) || epochs < 1 || epochs > 200) { error = 'Choose between 1 and 200 epochs.'; return; }
		if (words.length > 10000 || new Set(words).size > 2000) { error = 'Use at most 10,000 words and 2,000 unique words for this small model.'; return; }
		busy = true; trained = false; error = ''; losses = []; status = 'Loading training library...';
		let xs: Tensor | undefined; let ys: Tensor | undefined;
		try {
			const tf = await import('#lib/tensor.ts');
			await tf.initializeTensor();
			if (disposed) return;
			model?.dispose();
			vocabulary = [...new Set(words)]; wordToIndex = new Map(vocabulary.map((word, index) => [word, index]));
			const contexts: number[][] = []; const targets: number[] = [];
			for (let index = 0; index < words.length - 3; index++) { contexts.push(words.slice(index, index + 3).map(word => wordToIndex.get(word)!)); targets.push(wordToIndex.get(words[index + 3])!); }
			xs = tf.tensor2d(contexts, [contexts.length, 3], 'int32');
			ys = tf.tidy(() => tf.oneHot(tf.tensor1d(targets, 'int32'), vocabulary.length));
			model = tf.sequential({ layers: [tf.layers.embedding({ inputDim: vocabulary.length, outputDim: 16, inputLength: 3 }), tf.layers.flatten(), tf.layers.dense({ units: 64, activation: 'relu' }), tf.layers.dense({ units: vocabulary.length, activation: 'softmax' })] });
			model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy' });
			await model.fit(xs, ys, { epochs, batchSize: 16, callbacks: { onEpochEnd: async (epoch, logs) => { if (!disposed) { losses = [...losses, Number(logs?.loss ?? 0)]; status = `Training epoch ${epoch + 1} of ${epochs}`; } await tf.nextFrame(); } } });
			if (!disposed) { trained = true; status = 'Training complete.'; }
		} catch { if (!disposed) { error = 'Training failed. Try a smaller sample.'; status = ''; } }
		finally { xs?.dispose(); ys?.dispose(); busy = false; if (disposed) model?.dispose(); }
	}
	async function generate() {
		if (!model || !trained || busy) return;
		const seed = prompt.trim().split(/\s+/).filter(Boolean);
		if (seed.length < 3) { error = 'Enter at least three seed words.'; return; }
		if (seed.slice(-3).some(word => !wordToIndex.has(word))) { error = 'Use seed words that appear in your training sample.'; return; }
		busy = true; error = '';
		try {
			const tf = await import('#lib/tensor.ts');
			const context = seed.slice(-3); const generated = [...context];
			for (let step = 0; step < 20 && !disposed; step++) {
				const probabilities = tf.tidy(() => {
					const prediction = model!.predict(tf.tensor2d([context.map(word => wordToIndex.get(word)!)], [1, 3], 'int32')) as Tensor;
					return Array.from(prediction.dataSync()).map(probability => Math.pow(Number(probability), 1 / 0.8));
				});
				let pick = Math.random() * probabilities.reduce((sum, probability) => sum + probability, 0);
				let index = probabilities.length - 1;
				for (let candidate = 0; candidate < probabilities.length; candidate++) { pick -= probabilities[candidate]; if (pick <= 0) { index = candidate; break; } }
				const word = vocabulary[index]; generated.push(word); context.shift(); context.push(word);
				await tf.nextFrame();
			}
			if (!disposed) { output = generated.join(' '); status = 'Generated 20 new words.'; }
		} catch { if (!disposed) error = 'Could not generate text. Try training again.'; }
		finally { busy = false; if (disposed) model?.dispose(); }
	}
</script>
<svelte:head><title>Neural text generator · Alex Cowgill</title></svelte:head>
<h1>Neural text generator</h1>
<p class="page-intro">An old experiment: train a small next-word model on your own text, using the previous three words as context. Everything runs on this device.</p>
<div class="panel">
	<div class="field"><label for="training-text">Training text</label><textarea id="training-text" rows="8" bind:value={sample} disabled={busy}></textarea></div>
	<div class="field"><label for="epochs">Training epochs</label><input id="epochs" type="number" min="1" max="200" step="1" bind:value={epochs} disabled={busy} /></div>
	<div class="button-row"><button class="button primary" onclick={train} disabled={busy}>{busy ? 'Working...' : 'Train model'}</button></div>
	<LossChart values={losses} />
	<div class="field"><label for="seed">Seed text, at least three words from the training sample</label><input id="seed" bind:value={prompt} disabled={busy} /></div>
	<div class="button-row"><button class="button" onclick={generate} disabled={busy || !trained}>Generate text</button></div>
	<p role="status">{status}</p>
	{#if error}<p class="error" role="alert">{error}</p>{/if}
	<ToolOutput id="generated-text" label="Generated text" value={output} rows={6} />
</div>
