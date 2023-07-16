<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { GET, POST } from '$lib/services/http';
	import { userStore } from '$lib/stores/user.store';
	import { ZodError, z } from 'zod';
	import { onDestroy } from 'svelte';

	let errors: { [key in keyof typeof loginForm]?: string[] } | null = null;
	let submitted = false;

	const loginForm = {
		email: '',
		password: ''
	};

	export const login = async () => {
		//비동기 작업 async
		submitted = true; //입력 값이 제대로 다 작성이 되었을때 true로 변경
		if (errors) return; //정상 입력이라면 error에 null이 들어간다
		const { accessToken } = await POST<{ accessToken: string }>('/api/auth/login', loginForm); //Post함수 실행 http.ts파일
		sessionStorage.setItem('accessToken', accessToken); // 함수를 실행한 뒤에 accesstoken을 받아와 세션 스토리지에 저장

		const user = await GET<UserDto>($page.data.apiHost + '/user/me');
		console.log('asdf', user);
		userStore.set(user);
		goto('/'); //메인 페이지로 이동
	};

	$: {
		try {
			schema.parse(loginForm);
			errors = null;
		} catch (e) {
			const { fieldErrors } = (e as ZodError).flatten();
			errors = fieldErrors;
		}
	}

	const schema = z //스키마는 하나의 형식관리
		.object({
			email: z
				.string()
				.min(1, { message: '이메일을 입력하세요' })
				.email({ message: '올바른 이메일 형식이 아닙니다' }),
			password: z.string().min(1, { message: '비밀번호를 입력해주세요' })
		});

	const unsubscribe = userStore.subscribe(($user) => {
		if ($user) {
			goto('/');
		}
	});

	onDestroy(unsubscribe);
</script>

<form
	novalidate
	on:submit|preventDefault={login}
	class="flex flex-col gap-4 w-[500px] mx-auto my-20 rounded-3xl p-8 bg-cyan-500 text-white shadow-sm"
>
	<h1 class="text-3xl font-blod mb-10">Todo Application Login</h1>
	<input
		type="email"
		bind:value={loginForm.email}
		class="text-gray-800 rounded-full px-6 py-2 focus: outline-none"
		placeholder="이메일 입력"
	/>
	{#if submitted && errors?.email}
		<span class="text-xs text-red-500 mt-3 ps-4">{errors?.email[0]}</span>
	{/if}
	<input
		type="password"
		bind:value={loginForm.password}
		class="text-gray-800 rounded-full px-6 py-2 focus: outline-none"
		placeholder="비밀번호 입력"
	/>
	{#if submitted && errors?.password}
		<span class="text-xs text-red-500 mt-3 ps-4">{errors?.password[0]}</span>
	{/if}
	<span class="self-end"
		>계정이 없으신가요? <a href="/signup" class="underline">회원가입하기</a></span
	>
	<button type="submit" class="rounded-full px-6 py-2 bg-amber-500">Login</button>
</form>

<!-- 입력은 input을 이용해서 입력하고 bind를 이용해서 객체에 값을 넣는다
from전체는 on:submit을 이용해서 login함수와 연결
login함수는 값이 저장된 객체를 이용해서 함수를 실행 -->
