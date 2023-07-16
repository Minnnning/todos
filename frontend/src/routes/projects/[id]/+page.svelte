<script lang="ts">
	import { page } from '$app/stores';
	import { projectStore } from '$lib/stores/projects.store';
	import dayjs from 'dayjs';

	$: $projectStore;
	const id = $page.params.id;
	let project = projectStore.get(+id);
	const nl2br = (text: string) => text.replace(/\n/g, '<br>');
	$: if ($projectStore) {
		project = projectStore.get(+id);
	}
</script>

<main class="max-w-2xl m-auto p-20 bg-gray-200 rounded-sm shadow-xl">
	{#if project}
		<h1 class="text-3xl font-bold mb-3">{project.name}</h1>

		<div class="text-l flex justify-end text-gray-500 mb-4">
			{project.creator.name} email: {project.creator.email}
			<br />
			Created at {dayjs(project.createdAt).format('YYYY년 M월 D일 hh:mm')}
		</div>
		<hr class="border-1 border-gray-500 cursor-pointer" />
		<br />
		<div class="text-xl text-black">{@html nl2br(project.description)}</div>
	{:else}
		<p>Loading...</p>
	{/if}
</main>
