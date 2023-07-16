<script lang="ts">
	import { modalStore } from '$lib/stores/modal.store';

	const cancel = () => {
		modalStore.close();
	};
	const ok = () => {};
</script>

<div class="flex flex-col rounded-2xl bg-white p-4">
	<h1>modal 2</h1>
	<p>content</p>
	<div class=" flex gap-2">
		<button type="button" on:click={cancel}>cancel</button>
		<button type="button" on:click={ok}>ok</button>
	</div>
</div>
