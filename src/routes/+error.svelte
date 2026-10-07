<script lang="ts">
	import { page } from '$app/state';
</script>
<svelte:head><title>{page.status} · Alex Cowgill</title><meta name="robots" content="noindex" /></svelte:head>
<div class="prose"><h1>{page.status === 404 ? 'Page not found' : 'Something went wrong'}</h1><p>{page.status === 404 ? "That page isn't here." : page.error?.message}</p><p><a href="/">Go home</a>, or take a look at my <a href="/projects/">projects</a> and <a href="/tools/">tools</a>.</p></div>
