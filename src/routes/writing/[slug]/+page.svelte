<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>
<svelte:head><title>{data.post.title} · Alex Cowgill</title><meta name="description" content={data.post.description} /></svelte:head>
<a class="back-link" href="/writing/">← Writing</a>
<article class="prose article">
	<h1>{data.post.title}</h1>
	<p class="muted"><time datetime={data.post.date}>{new Date(data.post.date + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</time></p>
	{@html data.post.html}
</article>
