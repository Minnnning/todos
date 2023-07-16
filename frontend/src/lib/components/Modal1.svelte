<script lang="ts">
	import { modalStore } from '$lib/stores/modal.store';
	export let name: string;
</script>

<div class="flex flex-col rounded-2xl bg-white p-4">
	<h1>modal 1</h1>
	<p>content {name}</p>
	<button type="button" on:click={() => modalStore.close()}>Close</button>
</div>
