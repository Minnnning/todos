<script lang="ts">
	import { userStore } from '$lib/stores/user.store';
	import { page } from '$app/stores';
	import { projectStore } from '$lib/stores/projects.store';
	import dayjs from 'dayjs';

	$: $userStore;
	$: $projectStore;
	const id = $page.params.id;
	let project = projectStore.get(+id);
	const nl2br = (text: string) => text.replace(/\n/g, '<br>');
	$: if ($projectStore) {
		project = projectStore.get(+id);
		console.log(project);
	}

	const formData = {
		email: ''
	};

	const addMember = (project: Project) => async () => {
		const data = prompt('초대할 유저의 이메일을 작성해주세요');
		if (!data) {
			return;
		} else {
			formData.email = data;
			console.log(formData);
		}

		await projectStore.addMember(project.id, formData);
		alert('멤버를 초대했습니다');
	};
	
</script>

<main class="max-w-2xl m-auto p-20 bg-gray-200 rounded-sm shadow-xl">
	{#if project}
		<h1 class="text-3xl font-bold mb-3">{project.name}</h1>

		<div class="text-l flex justify-end text-gray-500 mb-4">
			{project.creator.name} email: {project.creator.email}
			<br />
			Created at {dayjs(project.createdAt).format('YYYY년 M월 D일 hh:mm')}
		</div>
		<hr class="border-1 border-gray-500 cursor-pointer mb-2" />
		<div class="text-xl text-black">{@html nl2br(project.description)}</div>
		<hr class="border-1 border-gray-500 cursor-pointer mt-2 mb-2" />
		{#if project.members}
			<div class="flex font-bold justify-between">
				<span class="">프로젝트 멤버</span>
				{#if $userStore && project.creator.name == $userStore.name}
					<button
						type="button"
						class="px-1 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
						on:click={addMember(project)}
					>
						멤버 초대
					</button>
				{/if}
			</div>
			{#each project.members as member}
				<p>{member.name}</p>
			{/each}
		{/if}
	{:else}
		<p>Loading...</p>
	{/if}
</main>
