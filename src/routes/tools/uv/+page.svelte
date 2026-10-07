<script lang="ts">
	import { generateUVCoordinates } from '#lib/text-tools.ts';
	import ToolOutput from '#lib/components/ToolOutput.svelte';
	let atlasWidth = $state<number | undefined>(256);
	let atlasHeight = $state<number | undefined>(256);
	let x = $state<number | undefined>(0);
	let y = $state<number | undefined>(0);
	let width = $state<number | undefined>(16);
	let height = $state<number | undefined>(16);
	let comment = $state('');
	let output = $state('');
	let error = $state('');
	function calculate(event: SubmitEvent) {
		event.preventDefault();
		try {
			output = generateUVCoordinates(atlasWidth ?? NaN, atlasHeight ?? NaN, x ?? NaN, y ?? NaN, width ?? NaN, height ?? NaN, comment);
			error = '';
		} catch (cause) { output = ''; error = cause instanceof Error ? cause.message : 'Could not calculate coordinates.'; }
	}
</script>
<svelte:head><title>UV coordinate calculator · Alex Cowgill</title></svelte:head>
<h1>UV coordinate calculator</h1>
<p class="page-intro">Turn a tile in a texture atlas into six Java Vector2f coordinates for two triangles. Coordinates use a bottom-left origin.</p>
<div class="panel">
	<form onsubmit={calculate}>
		<div class="dimensions">
			<div class="field"><label for="atlas-width">Atlas width, pixels</label><input id="atlas-width" type="number" min="1" step="1" required bind:value={atlasWidth} /></div>
			<div class="field"><label for="atlas-height">Atlas height, pixels</label><input id="atlas-height" type="number" min="1" step="1" required bind:value={atlasHeight} /></div>
			<div class="field"><label for="tile-x">Tile start X, pixels</label><input id="tile-x" type="number" min="0" step="1" required bind:value={x} /></div>
			<div class="field"><label for="tile-y">Tile start Y, pixels</label><input id="tile-y" type="number" min="0" step="1" required bind:value={y} /></div>
			<div class="field"><label for="tile-width">Tile width, pixels</label><input id="tile-width" type="number" min="1" step="1" required bind:value={width} /></div>
			<div class="field"><label for="tile-height">Tile height, pixels</label><input id="tile-height" type="number" min="1" step="1" required bind:value={height} /></div>
		</div>
		<div class="field"><label for="comment">Comment</label><input id="comment" placeholder="GRASS" bind:value={comment} /></div>
		<div class="button-row"><button class="button primary" type="submit">Calculate</button></div>
	</form>
	{#if error}<p class="error" role="alert">{error}</p>{/if}
	<ToolOutput id="uv-output" label="UV coordinates" value={output} />
</div>
<style>
	.dimensions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 16px; }
	@media (max-width: 420px) { .dimensions { grid-template-columns: 1fr; } }
</style>
