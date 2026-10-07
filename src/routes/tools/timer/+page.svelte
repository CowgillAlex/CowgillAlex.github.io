<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { formatDuration, parseTimerSeconds } from '#lib/time.ts';
	let ready = $state(false);
	let duration = $state(300000);
	let remaining = $state(300000);
	let deadline = 0;
	let running = $state(false);
	let finished = $state(false);
	let minutes = $state(5);
	let error = $state('');
	const querySeconds = $derived(page.url.searchParams.get('seconds'));
	onMount(() => {
		ready = true;
		const interval = setInterval(update, 100);
		return () => clearInterval(interval);
	});
	$effect(() => {
		if (!ready) return;
		const value = querySeconds;
		const seconds = parseTimerSeconds(value);
		const nextDuration = (seconds ?? 300) * 1000;
		duration = nextDuration;
		remaining = nextDuration;
		minutes = nextDuration / 60000;
		finished = false;
		error = value !== null && seconds === null ? 'Choose a duration between 1 second and 24 hours.' : '';
		running = seconds !== null;
		if (seconds !== null) deadline = Date.now() + nextDuration;
	});
	function update() {
		if (!running) return;
		remaining = Math.max(0, deadline - Date.now());
		if (!remaining) { running = false; finished = true; }
	}
	function toggle() {
		if (running) { update(); running = false; }
		else {
			if (!remaining) remaining = duration;
			deadline = Date.now() + remaining;
			finished = false;
			running = true;
		}
	}
	function reset() { running = false; remaining = duration; finished = false; }
	function setDuration(event: SubmitEvent) {
		event.preventDefault();
		const seconds = parseTimerSeconds(String(Math.round(minutes * 60)));
		if (!seconds) { error = 'Choose a duration between 1 second and 24 hours.'; return; }
		duration = seconds * 1000;
		reset();
		error = '';
	}
</script>
<svelte:head><title>Countdown timer · Alex Cowgill</title></svelte:head>
<h1>Countdown timer</h1>
<div class="panel">
	<div class="time-display" aria-label="Time remaining">{formatDuration(Math.ceil(remaining / 1000) * 1000)}</div>
	<p role="status">{finished ? "Time's up." : running ? 'Running' : 'Paused'}</p>
	<div class="button-row"><button class="button primary" onclick={toggle}>{running ? 'Pause' : finished ? 'Start again' : 'Start'}</button><button class="button" onclick={reset}>Reset</button></div>
	<form onsubmit={setDuration}>
		<div class="field"><label for="minutes">Duration in minutes</label><input id="minutes" type="number" min="0.0167" max="1440" step="any" required bind:value={minutes} /></div>
		<button class="button" type="submit">Set duration</button>
	</form>
	{#if error}<p class="error" role="alert">{error}</p>{/if}
</div>
