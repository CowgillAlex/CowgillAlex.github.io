<script lang="ts">import PixelGenerator from '#lib/components/PixelGenerator.svelte';</script>
<svelte:head><title>Video generator · Alex Cowgill</title></svelte:head>
<h1>Video generator</h1>
<p class="page-intro">An old neural-network experiment. Train on frames from your own video, then generate a short clip from random noise.</p>
<PixelGenerator mode="video" />
