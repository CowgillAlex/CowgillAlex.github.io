<script lang="ts">
	let { values }: { values: number[] } = $props();
	let max = $derived(Math.max(...values, 0.000001));
	let points = $derived(values.map((value, index) => `${10 + index / Math.max(values.length - 1, 1) * 580},${140 - value / max * 125}`).join(' '));
</script>
{#if values.length}
	<figure>
		<figcaption>Training loss · {values.at(-1)?.toFixed(5)}</figcaption>
		<svg viewBox="0 0 600 160" role="img" aria-label={`Training loss over ${values.length} epochs. Latest loss ${values.at(-1)?.toFixed(5)}.`}><path d="M10 10 V140 H590" /><polyline {points} /></svg>
		<p class="muted">Epochs: {values.length}</p>
	</figure>
{/if}
<style>
	figure { margin: 20px 0 0; }
	figcaption { font-size: 13px; color: var(--text-soft); }
	svg { display: block; width: 100%; height: auto; margin-top: 8px; }
	path { stroke: var(--border-strong); fill: none; }
	polyline { stroke: var(--accent); stroke-width: 2; fill: none; }
</style>
