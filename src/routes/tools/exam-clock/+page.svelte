<script lang="ts">
	import { onMount } from 'svelte';
	let now = $state<Date | null>(null);
	let centre = $state('');
	let lock: WakeLockSentinel | null = null;
	let disposed = false;
	let acquiring = false;

	async function acquireWakeLock() {
		if (disposed || acquiring || !('wakeLock' in navigator) || document.visibilityState !== 'visible' || (lock && !lock.released)) return;
		acquiring = true;
		try {
			const acquired = await navigator.wakeLock.request('screen');
			if (disposed) await acquired.release();
			else lock = acquired;
		} catch {
			// The clock still works when the browser declines a screen wake lock.
		} finally {
			acquiring = false;
		}
	}

	onMount(() => {
		now = new Date();
		const interval = setInterval(() => { now = new Date(); }, 1000);
		void acquireWakeLock();
		document.addEventListener('visibilitychange', acquireWakeLock);
		return () => {
			disposed = true;
			clearInterval(interval);
			document.removeEventListener('visibilitychange', acquireWakeLock);
			void lock?.release();
		};
	});
</script>

<svelte:head>
	<title>Exam clock</title>
	<meta name="description" content="A simple local clock and date display with a centre number field." />
	<meta name="color-scheme" content="light" />
</svelte:head>

<main class="exam-clock-page" aria-label="Exam clock">
	<time class="exam-time" aria-label="Local time">{now ? now.toLocaleTimeString('en-GB', { hour12: false }) : '--:--:--'}</time>
	<p class="exam-date" aria-label="Local date">{now ? now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''}</p>
	<label class="centre-field" for="centre">
		Centre number
		<input id="centre" type="text" inputmode="numeric" autocomplete="off" bind:value={centre} />
	</label>
</main>

<style>
	:global(html:has(.exam-clock-page)),
	:global(body:has(.exam-clock-page)) {
		background: #fff;
		color-scheme: light;
	}
	.exam-clock-page {
		--accent: #287c0d;
		width: 100%;
		max-width: none;
		min-height: 100dvh;
		margin: 0;
		padding: clamp(32px, 10vh, 120px) 16px 32px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		background: #fff;
		color: #111;
		color-scheme: light;
	}
	.exam-time {
		font-size: clamp(56px, 16vw, 240px);
		font-weight: 500;
		font-variant-numeric: tabular-nums;
		line-height: 1.1;
		white-space: nowrap;
	}
	.centre-field {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 18px;
		color: #333;
	}
	.exam-date {
		min-height: 1.6em;
		margin: 0;
		font-size: 18px;
		color: #333;
		text-align: center;
	}
	.centre-field input {
		width: 8ch;
		padding: 4px 6px;
		border: 0;
		border-bottom: 1px solid #ccc;
		border-radius: 0;
		background: #fff;
		color: #111;
		font: inherit;
	}
</style>
