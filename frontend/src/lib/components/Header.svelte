<script lang="ts">
	import { userStore } from '$lib/stores/user.store.js';
	import { GET, POST } from '$lib/services/http.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { PUBLIC_API_HOST } from '$env/static/public';

	let fileInput: HTMLInputElement;

	const logout = async () => {
		const yes = confirm('로그아웃하시겠습니까?');
		if (!yes) return;
		await POST('api/auth/logout');
		sessionStorage.removeItem('accessToken');
		userStore.set(null);
		goto('/login');
	};
	//type InputEvent -> any 변경
	const uploadImage = async (event: any) => {
		const file = (event.currentTarget as any).files[0];
		const formData = new FormData();
		formData.append('file', file);
		await POST($page.data.apiHost + '/user/me/image', formData);
		const u: UserDto = await GET($page.data.apiHost + '/user/me');
		userStore.set(u);
	};
	const selectImage = () => {
		fileInput.click();
	};
	//$: console.log('user store', $page.data.user);
	//받아온 데이터가 있다면 userStore에 값을 저장시켜야한다
	if ($page.data.user) {
		userStore.set($page.data.user);
	}
</script>

<header class="py-4 px-8 bg-purple-500 text-white flex items-center w-full">
	<h1 class="mr-auto text-3xl font-blod z-50">
		<a href="/">Todo Application</a>
	</h1>
	{#if $userStore}
		<form class="flex gap-4 items-center" action="?/logout" method="POST">
			<button type="button" on:click={selectImage}>
				<!-- svelte-ignore a11y-missing-attribute -->
				<img
					src="{PUBLIC_API_HOST}/static/{$userStore.image}"
					class="h-10 aspect-square rounded-full"
				/>
				<input
					type="file"
					bind:this={fileInput}
					accept="image/*"
					on:change={uploadImage}
					class="hidden"
				/>
			</button>
			<span>{$userStore.name} 님 환영합니다</span>
			<button type="button" on:click={logout}>로그아웃</button>
		</form>
	{:else}
		<a href="/login">Login</a>
	{/if}
</header>
