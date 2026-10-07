<script lang="ts">
	import { onDestroy } from 'svelte';
	let { kind }: { kind: 'sentiment' | 'politeness' } = $props();
	let input = $state('');
	let busy = $state(false);
	let status = $state('');
	let error = $state('');
	let results = $state<{ sentence: string; label: string; score: number }[]>([]);
	let worker: Worker | undefined;
	let summary = $derived(results.reduce<Record<string, number>>((counts, result) => { counts[result.label] = (counts[result.label] ?? 0) + 1; return counts; }, {}));
	let confidence = $derived(results.length ? results.reduce((sum, result) => sum + result.score, 0) / results.length * 100 : 0);
	onDestroy(() => worker?.terminate());
	function analyse() {
		if (!input.trim() || busy) return;
		busy = true; error = ''; results = []; status = 'Starting analysis...';
		if (!worker) {
			worker = new Worker(new URL('../classifier.worker.ts', import.meta.url), { type: 'module' });
			worker.onmessage = event => {
				if (event.data.type === 'status') status = event.data.message;
				if (event.data.type === 'result') { results = event.data.results; busy = false; status = `Analysed ${results.length} sentences.`; }
				if (event.data.type === 'error') { error = 'Could not analyse the text. Check your connection and try again.'; busy = false; status = ''; }
			};
			worker.onerror = () => { error = 'The model could not start. Please try again.'; busy = false; status = ''; worker?.terminate(); worker = undefined; };
		}
		worker.postMessage({ kind, text: input });
	}
	function clear() { worker?.terminate(); worker = undefined; busy = false; input = ''; results = []; error = ''; status = ''; }
</script>
<div class="panel">
	<p class="muted">The model downloads from Hugging Face on first use and is cached in your browser. Your text is analysed on this device.</p>
	<div class="field"><label for="analysis-input">Text</label><textarea id="analysis-input" rows="9" maxlength="10000" bind:value={input} onkeydown={event => { if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); analyse(); } }}></textarea><span class="muted">{input.length} / 10,000 characters</span></div>
	<div class="button-row"><button class="button primary" onclick={analyse} disabled={busy || !input.trim()}>{busy ? 'Analysing...' : 'Analyse'}</button><button class="button" onclick={clear}>{busy ? 'Cancel and clear' : 'Clear'}</button></div>
	<p role="status">{status}</p>
	{#if error}<p class="error" role="alert">{error}</p>{/if}
	{#if results.length}
		<dl class="tool-stats"><div><dt>Sentences</dt><dd>{results.length}</dd></div><div><dt>Average model confidence</dt><dd>{confidence.toFixed(1)}%</dd></div>{#each Object.entries(summary) as [label, count]}<div><dt>{label}</dt><dd>{count}</dd></div>{/each}</dl>
		<ol class="sentence-results">{#each results as result}<li><span class="result-label">{result.label} · {(result.score * 100).toFixed(1)}%</span><p>{result.sentence}</p></li>{/each}</ol>
	{/if}
</div>
<style>
	.sentence-results { list-style: none; padding: 0; margin: 22px 0 0; }
	.sentence-results li { padding: 12px 0; border-top: 1px solid var(--border); }
	.result-label { color: var(--accent); font-size: 12px; }
	.sentence-results p { margin: 5px 0 0; white-space: pre-wrap; }
</style>
