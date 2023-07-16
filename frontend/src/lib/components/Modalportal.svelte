<script lang="ts">
	import { modalStore } from '$lib/stores/modal.store';
	import { fade } from 'svelte/transition';
	$: modal = $modalStore[$modalStore.length - 1];
	$: component = modal?.component;
	$: options = modal?.options;
</script>

{#if $modalStore.length > 0}
	<div transition:fade={{ duration: 300 }} class="fixed bg-black bg-opacity-50 inset-0 z-10" />
	<div
		transition:fade={{ duration: 300 }}
		class="fixed inset-0 flex items-center justify-center z-20"
	>
		<svelte:component this={component} {...options?.data} />
	</div>
{/if}
