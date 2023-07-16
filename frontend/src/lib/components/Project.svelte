<script lang="ts">
	import { userStore } from '$lib/stores/user.store';
	import { projectStore } from '$lib/stores/projects.store';
	//const unsubscribe = userStore.subscribe()
	const removeProject = (project: Project) => async () => {
		const yes = confirm(`${project.name}을 삭제하겠습니까?`);

		if (!yes) return;
		await projectStore.removeProject(project.id);
		alert('프로젝트를 삭제했습니다');
	};
</script>

{#if $userStore !== null}
	<ul class="flex flex-col gap-4 justify-center px-6 py-4 font-cyan-500 text-lg bg-gray-200">
		<li class="text-gray-800 font-blod text-2xl">
			<div>Dashboard</div>
		</li>
		<li>
			<button type="button" class="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
				<a href="/projects">Add Project</a>
			</button>
		</li>
		<hr class="border-2 border-gray-500 cursor-pointer" />
		<!-- 생성순서 내림차순 정렬 -->
		{#each $projectStore as project}
			<li>
				<a href="/projects/{project.id}" class="text-s">{project.name}</a>
				<!-- 지금은 생성자만 프로젝트 삭제 가능 -> 멤버들은 프로젝트에서 나가는 api구현 해야함 -->
				{#if project.creator.name == $userStore.name}
					<button type="button" on:click={removeProject(project)}
						><svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
							/>
						</svg>
					</button>
					<br />
					<span class="text-xs flex justify-end">관리자: 나</span>
				{:else}
					<br />
					<span class="text-xs flex justify-end">관리자: {project.creator.name}</span>
				{/if}
			</li>
			<hr class="border-1 border-gray-500 cursor-pointer" />
		{/each}
	</ul>
{/if}
