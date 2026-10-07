<script lang="ts">
	let { id, label, value, rows = 8 }: { id: string; label: string; value: string; rows?: number } = $props();
	let message = $state('');
	$effect(() => { value; message = ''; });
	async function copy() {
		try { await navigator.clipboard.writeText(value); message = 'Copied'; }
		catch { message = 'Select the output to copy it manually.'; }
	}
</script>
<div class="field output-field">
	<label for={id}>{label}</label>
	<textarea {id} {rows} {value} readonly spellcheck="false"></textarea>
	<div class="output-actions"><button class="button" onclick={copy} disabled={!value}>Copy</button><span class="muted" role="status">{message}</span></div>
</div>
<style>
	.output-field { margin-bottom: 0; }
	textarea { font-family: ui-monospace, monospace; font-size: 13px; line-height: 1.6; }
	.output-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 6px; }
</style>
