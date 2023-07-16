<script lang="ts">
	import { projectStore } from '$lib/stores/projects.store';
	const formData = {
		name: '',
		description: ''
	};

	const submit = async () => {
		await projectStore.createProject(formData);
		alert('프로젝트 생성 완료');
		import('$app/navigation').then(({ goto }) => goto('/'));
	};
</script>

<form on:submit|preventDefault={submit} class="flex flex-col gap-8 mx-auto max-w-md mt-10">
	<h1 class="font-bold text-xl">프로젝트 생성</h1>
	<input
		bind:value={formData.name}
		type="text"
		class="border border-gray-300 px-6 py-2 focus-outline-none"
		placeholder="프로젝트 이름을 입력하세요"
	/>
	<textarea
		bind:value={formData.description}
		rows="5"
		class="border border-gray-300 px-6 py-2 focus-outline-none"
		placeholder="프로젝트 설명을 입력하세요"
	/>
	<button type="submit" class=" bg-cyan-500 text-white px-6 py-2">프로젝트 생성 </button>
</form>
