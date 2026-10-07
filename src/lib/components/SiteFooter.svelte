<script lang="ts">
	import GithubLogoIcon from 'phosphor-svelte/lib/GithubLogoIcon';
	import YoutubeLogoIcon from 'phosphor-svelte/lib/YoutubeLogoIcon';
	import LinkedinLogoIcon from 'phosphor-svelte/lib/LinkedinLogoIcon';
	import EnvelopeSimpleIcon from 'phosphor-svelte/lib/EnvelopeSimpleIcon';
	import XLogoIcon from 'phosphor-svelte/lib/XLogoIcon';
</script>

<footer>
	<div class="footer-inner">
		<span>© {new Date().getFullYear()} Alexander Cowgill</span>
		<nav class="footer-links" aria-label="Social links">
			<a class="icon-button" target="_blank" rel="noopener noreferrer" href="https://github.com/CowgillAlex" aria-label="GitHub" title="GitHub"><GithubLogoIcon size={18} aria-hidden="true" /></a>
			<a class="icon-button" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/@alexc_mc" aria-label="YouTube" title="YouTube"><YoutubeLogoIcon size={18} aria-hidden="true" /></a>
			<a class="icon-button" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/alexander-cowgill/" aria-label="LinkedIn" title="LinkedIn"><LinkedinLogoIcon size={18} aria-hidden="true" /></a>
			<a class="icon-button" target="_blank" rel="noopener noreferrer" href="mailto:alex@alexco.dev" aria-label="Email" title="Email"><EnvelopeSimpleIcon size={18} aria-hidden="true" /></a>
			<a class="icon-button" target="_blank" rel="noopener noreferrer" href="https://x.com/alexcodotdev" aria-label="X" title="X"><XLogoIcon size={18} aria-hidden="true" /></a>
		</nav>
	</div>
</footer>
