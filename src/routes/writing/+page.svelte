<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>
<svelte:head><title>Writing · Alex Cowgill</title></svelte:head>
<h1>Writing</h1>
<p class="page-intro">Development notes, things I've learnt, and the occasional unrelated thought.</p>
{#if data.posts.length}
	<div class="project-list">{#each data.posts as post}<a class="project" href={'/writing/' + post.slug + '/'}><h2 style="margin:0">{post.title}</h2><p>{post.description}</p><time class="muted" datetime={post.date}>{new Date(post.date + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</time></a>{/each}</div>
{:else}<p>Nothing to see here</p>{/if}
