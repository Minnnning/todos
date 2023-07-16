<script lang="ts">
	// import type { PageData } from './$types';
	import { userStore } from '$lib/stores/user.store';
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import Project from '$lib/components/Project.svelte';
	import { modalStore } from '$lib/stores/modal.store';
	import Modal1 from '$lib/components/Modal1.svelte';
	import Modal2 from '$lib/components/Modal2.svelte';

	// const unsubscribe = userStore.subscribe(($user) => {
	// 	if (!$user) {
	// 		goto('/login');
	// 	}
	// });

	// onDestroy(unsubscribe);

	const openModal = (component: any, data?: any) => () => {
		modalStore.open(component, { data }).subscribe((output) => console.log(output));
	};
</script>

<div class="flex items-stretch gap-3 mt-4">
	<Project />
	<!-- <button
		type="button"
		class="px-4 py-2 text-white bg-blue-200"
		on:click={openModal(Modal1, { name: 'h' })}
	>버튼1 </button>
	<button type="button" class="px-4 py-2 text-white bg-blue-200" on:click={openModal(Modal2)} >버튼2</button> -->
</div>
