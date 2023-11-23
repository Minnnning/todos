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

	import MarkdownIt from 'markdown-it';
	import sanitizeHtml from 'sanitize-html';
	import { afterUpdate } from 'svelte';

	const md = new MarkdownIt();

	let markdown = '';
	let result = '';

	afterUpdate(() => {
		result = sanitizeHtml(md.render(markdown), {
			allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'img'])
		});
	});
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

<div class="markdown-editor">
	<div class="markdown-editor__panel">
		<span class="markdown-editor__panel__label">Markdown</span>
		<textarea class="markdown-editor__textarea" bind:value={markdown} />
	</div>
	<div class="markdown-editor__panel">
		<span class="markdown-editor__panel__label">Output</span>
		<div class="markdown-editor__result-html">
			{@html result}
		</div>
	</div>
</div>

<style>
	.markdown-editor {
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.markdown-editor__panel {
		width: calc(50% - 1rem);
		height: 400px;
		box-sizing: inherit;
	}

	.markdown-editor__panel__label {
		display: block;
		font-weight: 700;
		margin-bottom: 0.75rem;
	}

	.markdown-editor__textarea,
	.markdown-editor__result-html {
		box-sizing: inherit;
		height: 100%;
		width: 100%;
		padding: 1rem;
		border: 1px solid black;
	}

	.markdown-editor__textarea {
		margin: 0;
	}

	.markdown-editor__result-html {
		overflow-y: scroll;
	}
</style>
