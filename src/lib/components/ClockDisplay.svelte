<script lang="ts">
	import { onMount } from 'svelte';
	let now = $state<Date | null>(null);
	onMount(() => {
		now = new Date();
		const interval = setInterval(() => { now = new Date(); }, 1000);
		return () => clearInterval(interval);
	});
</script>
<div class="time-display" aria-label="Local time">{now ? now.toLocaleTimeString('en-GB', { hour12: false }) : '--:--:--'}</div>
<p style="text-align:center">{now ? now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Loading local date…'}</p>
