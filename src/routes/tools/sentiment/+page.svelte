<script lang="ts">import TextAnalyser from '#lib/components/TextAnalyser.svelte';</script>
<svelte:head><title>Sentiment analyser · Alex Cowgill</title></svelte:head>
<h1>Sentiment analyser</h1>
<p class="page-intro">Classify the sentiment of each sentence with the Robust Sentiment Analysis model. Predictions can be wrong; confidence is the model's score.</p>
<TextAnalyser kind="sentiment" />
