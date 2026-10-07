<script lang="ts">
	import { onMount } from 'svelte';
	import { formatDuration } from '#lib/time.ts';
	let elapsed = $state(0);
	let running = $state(false);
	let accumulated = 0;
	let started = 0;
	onMount(() => {
		running = true;
		started = performance.now();
		const interval = setInterval(() => { if (running) elapsed = accumulated + performance.now() - started; }, 100);
		return () => clearInterval(interval);
	});
	function toggle() {
		if (running) { accumulated += performance.now() - started; elapsed = accumulated; }
		else started = performance.now();
		running = !running;
	}
	function reset() { running = false; elapsed = 0; accumulated = 0; }
</script>
<svelte:head><title>Stopwatch · Alex Cowgill</title></svelte:head>
<h1>Stopwatch</h1>
<div class="panel">
	<div class="time-display" aria-label="Elapsed time">{formatDuration(elapsed, true)}</div>
	<p role="status">{running ? 'Running' : 'Paused'}</p>
	<div class="button-row"><button class="button primary" onclick={toggle}>{running ? 'Pause' : 'Start'}</button><button class="button" onclick={reset}>Reset</button></div>
</div>
