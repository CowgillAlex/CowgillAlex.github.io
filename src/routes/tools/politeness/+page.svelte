<script lang="ts">import TextAnalyser from '#lib/components/TextAnalyser.svelte';</script>
<svelte:head><title>Politeness analyser · Alex Cowgill</title></svelte:head>
<h1>Politeness analyser</h1>
<p class="page-intro">Classify the politeness of each sentence with Intel's PoliteGuard model. Predictions can be wrong; confidence is the model's score.</p>
<TextAnalyser kind="politeness" />
