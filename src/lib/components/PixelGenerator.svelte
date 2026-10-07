<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LayersModel } from '@tensorflow/tfjs-layers';
	import type { Tensor } from '@tensorflow/tfjs-core';
	import LossChart from './LossChart.svelte';
	let { mode }: { mode: 'image' | 'video' } = $props();
	const size = 64;
	const noiseSize = 100;
	let canvas: HTMLCanvasElement;
	let files = $state<File[]>([]);
	let sampleCount = $state(0);
	let epochs = $state<number | undefined>(100);
	let busy = $state(false);
	let ready = $state(false);
	let hasImage = $state(false);
	let status = $state('');
	let error = $state('');
	let losses = $state<number[]>([]);
	let clipUrl = $state('');
	let samples: Float32Array[] = [];
	let model: LayersModel | undefined;
	let recorder: MediaRecorder | undefined;
	let recordingStream: MediaStream | undefined;
	let disposed = false;
	const storageKey = $derived('indexeddb://alexco-' + mode + '-generator-v1');
	onDestroy(() => {
		disposed = true;
		if (model) { model.stopTraining = true; if (!busy) model.dispose(); }
		if (recorder?.state === 'recording') recorder.stop();
		recordingStream?.getTracks().forEach(track => track.stop());
		if (clipUrl) URL.revokeObjectURL(clipUrl);
		samples = [];
	});
	async function run(action: () => Promise<void>) {
		if (busy) return;
		busy = true; error = '';
		try { await action(); }
		catch (cause) { if (!disposed) { error = cause instanceof Error ? cause.message : 'The operation failed.'; status = ''; } }
		finally { busy = false; if (disposed) model?.dispose(); }
	}
	function readPixels(source: CanvasImageSource): Float32Array {
		const offscreen = document.createElement('canvas'); offscreen.width = size; offscreen.height = size;
		const context = offscreen.getContext('2d')!;
		context.fillStyle = '#fff'; context.fillRect(0, 0, size, size); context.drawImage(source, 0, 0, size, size);
		const rgba = context.getImageData(0, 0, size, size).data;
		const rgb = new Float32Array(size * size * 3);
		for (let pixel = 0; pixel < size * size; pixel++) for (let channel = 0; channel < 3; channel++) rgb[pixel * 3 + channel] = rgba[pixel * 4 + channel] / 255;
		return rgb;
	}
	function waitForVideo(video: HTMLVideoElement, event: 'loadeddata' | 'seeked'): Promise<void> {
		return new Promise((resolve, reject) => {
			const cleanup = () => { clearTimeout(timeout); video.removeEventListener(event, done); video.removeEventListener('error', fail); };
			const done = () => { cleanup(); resolve(); };
			const fail = () => { cleanup(); reject(new Error('Could not read that video. Try a different format.')); };
			const timeout = setTimeout(fail, 15000);
			video.addEventListener(event, done, { once: true }); video.addEventListener('error', fail, { once: true });
		});
	}
	async function loadSamples() {
		if (!files.length) throw new Error(mode === 'image' ? 'Choose some training images first.' : 'Choose a training video first.');
		status = mode === 'image' ? 'Reading images...' : 'Extracting video frames...';
		const loaded: Float32Array[] = [];
		if (mode === 'image') {
			if (files.length > 100) throw new Error('Choose at most 100 training images.');
			for (const file of files) {
				if (disposed) return;
				const bitmap = await createImageBitmap(file);
				try { loaded.push(readPixels(bitmap)); } finally { bitmap.close(); }
				status = `Read ${loaded.length} of ${files.length} images.`;
			}
		} else {
			const video = document.createElement('video'); video.muted = true; video.preload = 'auto'; video.playsInline = true;
			const url = URL.createObjectURL(files[0]);
			try {
				const waiting = waitForVideo(video, 'loadeddata'); video.src = url; await waiting;
				if (!Number.isFinite(video.duration) || video.duration <= 0) throw new Error('This video has no readable duration.');
				const duration = Math.min(video.duration, 60);
				const count = Math.min(100, Math.max(1, Math.ceil(duration * 2)));
				for (let index = 0; index < count; index++) {
					if (disposed) return;
					const time = index * duration / count;
					if (Math.abs(video.currentTime - time) > 0.001) { const seeking = waitForVideo(video, 'seeked'); video.currentTime = time; await seeking; }
					loaded.push(readPixels(video)); status = `Extracted ${index + 1} of ${count} frames.`;
				}
			} finally { video.removeAttribute('src'); video.load(); URL.revokeObjectURL(url); }
		}
		if (!disposed) { samples = loaded; sampleCount = samples.length; status = `${sampleCount} ${mode === 'image' ? sampleCount === 1 ? 'image' : 'images' : sampleCount === 1 ? 'frame' : 'frames'} ready for training.`; }
	}
	async function tensor() { const tf = await import('#lib/tensor.ts'); await tf.initializeTensor(); return tf; }
	async function train() {
		if (!samples.length) throw new Error('Load training data first.');
		if (!epochs || !Number.isInteger(epochs) || epochs < 1 || epochs > 200) throw new Error('Choose between 1 and 200 epochs.');
		status = 'Loading training library...';
		const tf = await tensor(); if (disposed) return;
		model?.dispose(); ready = false; losses = [];
		model = tf.sequential({ layers: [tf.layers.dense({ inputShape: [noiseSize], units: 256, activation: 'relu' }), tf.layers.dense({ units: 512, activation: 'relu' }), tf.layers.dense({ units: size * size * 3, activation: 'sigmoid' })] });
		model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
		const noise = tf.randomNormal([samples.length, noiseSize]);
		const targets = tf.tensor2d(samples.map(sample => Array.from(sample)), [samples.length, size * size * 3]);
		try {
			await model.fit(noise, targets, { epochs, batchSize: Math.min(16, samples.length), shuffle: true, callbacks: { onEpochEnd: async (epoch, logs) => {
				if (!disposed) { losses = [...losses, Number(logs?.loss ?? 0)]; status = `Training epoch ${epoch + 1} of ${epochs}`; }
				await tf.nextFrame();
			} } });
			if (!disposed) { ready = true; status = 'Training complete.'; await draw(); }
		} finally { noise.dispose(); targets.dispose(); }
	}
	async function draw() {
		if (!model) throw new Error('Train or load a model first.');
		const tf = await tensor(); if (disposed) return;
		const pixels = tf.tidy(() => Array.from((model!.predict(tf.randomNormal([1, noiseSize])) as Tensor).dataSync()));
		const context = canvas.getContext('2d')!;
		const image = context.createImageData(size, size);
		for (let pixel = 0; pixel < size * size; pixel++) { for (let channel = 0; channel < 3; channel++) image.data[pixel * 4 + channel] = Number(pixels[pixel * 3 + channel]) * 255; image.data[pixel * 4 + 3] = 255; }
		context.putImageData(image, 0, 0); hasImage = true;
	}
	async function generate() {
		if (mode === 'image') { await draw(); if (!disposed) status = 'Image generated.'; return; }
		if (!model) throw new Error('Train or load a model first.');
		if (!('MediaRecorder' in window) || !canvas.captureStream) throw new Error('Video recording is not supported in this browser.');
		status = 'Generating a five-second clip...';
		recordingStream = canvas.captureStream(10);
		const mimeType = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4'].find(type => MediaRecorder.isTypeSupported(type));
		recorder = new MediaRecorder(recordingStream, mimeType ? { mimeType } : undefined);
		const activeRecorder = recorder;
		const chunks: Blob[] = [];
		const complete = new Promise<Blob>((resolve, reject) => {
			activeRecorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
			activeRecorder.onerror = () => reject(new Error('Video recording failed.'));
			activeRecorder.onstop = () => resolve(new Blob(chunks, { type: activeRecorder.mimeType }));
		});
		try {
			activeRecorder.start();
			for (let frame = 0; frame < 50 && !disposed; frame++) { await draw(); await new Promise(resolve => setTimeout(resolve, 100)); }
			if (activeRecorder.state === 'recording') activeRecorder.stop();
			const blob = await complete;
			if (!disposed) { if (clipUrl) URL.revokeObjectURL(clipUrl); clipUrl = URL.createObjectURL(blob); status = 'Clip generated.'; }
		} finally { if (activeRecorder.state === 'recording') activeRecorder.stop(); recordingStream.getTracks().forEach(track => track.stop()); }
	}
	async function save() { if (!model) throw new Error('Train or load a model first.'); await model.save(storageKey); if (!disposed) status = 'Model saved in this browser.'; }
	async function load() {
		status = 'Loading saved model...'; const tf = await tensor(); if (disposed) return;
		let saved: LayersModel;
		try { saved = await tf.loadLayersModel(storageKey); } catch { throw new Error('No saved model was found in this browser.'); }
		if (disposed) { saved.dispose(); return; }
		if (saved.inputs[0].shape.at(-1) !== noiseSize || saved.outputs[0].shape.at(-1) !== size * size * 3) { saved.dispose(); throw new Error('The saved model has incompatible dimensions.'); }
		model?.dispose(); model = saved; ready = true; status = 'Saved model loaded.';
		await draw();
	}
	function downloadImage() { const link = document.createElement('a'); link.download = 'generated-image.png'; link.href = canvas.toDataURL('image/png'); link.click(); }
</script>
<div class="panel">
	<div class="field"><label for="training-files">{mode === 'image' ? 'Training images' : 'Training video'}</label><input id="training-files" type="file" accept={mode === 'image' ? 'image/*' : 'video/*'} multiple={mode === 'image'} disabled={busy} onchange={event => { files = Array.from(event.currentTarget.files ?? []); samples = []; sampleCount = 0; }} /></div>
	{#if mode === 'video'}<p class="muted">Extracts up to 100 frames from the first minute.</p>{/if}
	<div class="button-row"><button class="button" onclick={() => run(loadSamples)} disabled={busy || !files.length}>{mode === 'image' ? 'Load images' : 'Extract frames'}</button></div>
	<p class="muted">{sampleCount} training {mode === 'image' ? 'images' : 'frames'} loaded. Images are resized to 64 × 64 pixels.</p>
	<div class="field"><label for="epochs">Training epochs</label><input id="epochs" type="number" min="1" max="200" step="1" bind:value={epochs} disabled={busy} /></div>
	<div class="button-row"><button class="button primary" onclick={() => run(train)} disabled={busy || !sampleCount}>Train model</button><button class="button" onclick={() => run(generate)} disabled={busy || !ready}>{mode === 'image' ? 'Generate image' : 'Generate 5s clip'}</button></div>
	<p role="status">{status}</p>
	{#if error}<p class="error" role="alert">{error}</p>{/if}
	<canvas bind:this={canvas} width={size} height={size} aria-label="Generated image preview"></canvas>
	{#if mode === 'image'}<div class="button-row"><button class="button" onclick={downloadImage} disabled={!hasImage || busy}>Download image</button></div>{/if}
	{#if clipUrl}<video src={clipUrl} controls aria-label="Generated clip"><track kind="captions" /></video><p><a class="text-link" href={clipUrl} download="generated-clip">Download clip</a></p>{/if}
	<div class="button-row"><button class="button" onclick={() => run(save)} disabled={busy || !ready}>Save model</button><button class="button" onclick={() => run(load)} disabled={busy}>Load saved model</button></div>
	<p class="muted">Models are saved on this device. Training files stay in your browser.</p>
	<LossChart values={losses} />
</div>
<style>
	canvas { display: block; width: min(256px, 100%); height: auto; background: var(--bg); border: 1px solid var(--border-strong); border-radius: 5px; image-rendering: pixelated; margin: 20px auto; }
	video { display: block; width: min(320px, 100%); margin: 20px auto 10px; }
</style>
