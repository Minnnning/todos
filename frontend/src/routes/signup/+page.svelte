<script lang="ts">
	import { POST } from '$lib/services/http';
	import { z, type ZodError } from 'zod';
// export let data: PageData;
	import { goto } from '$app/navigation';

	let errors: { [key in keyof typeof signupForm]?: string[] } | null = null;
	let submitted = false;

	const signupForm = {
		email: '',
		password: '',
		confirmPassword: '',
		name: ''
	};

	export const signup = async () => {
		submitted = true;
		if (errors) return;
		const { confirmPassword, ...signupData } = signupForm;

		await POST<User>('/api/auth/signup', signupData);
		goto('/login');
	};

	$: {
		try {
			schema.parse(signupForm);
			errors = null;
		} catch (e) {
			const { fieldErrors } = (e as ZodError).flatten();
			errors = fieldErrors;
		}
	}

	const schema = z
		.object({
			email: z
				.string()
				.min(1, { message: '이메일을 입력하세요' })
				.email({ message: '올바른 이메일 형식이 아닙니다' }),
			password: z.string().min(1, { message: '비밀번호를 입력해주세요' }),
			confirmPassword: z.string(),
			name: z.string().min(1, { message: '닉네임을 입력해주세요' })
		})
		.superRefine((data, ctx) => {
			const { password, confirmPassword } = data;
			if (password !== confirmPassword) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: '비밀번호가 일치하지 않습니다',
					path: ['confirmPassword']
				});
			}
		});
</script>

<form
	on:submit|preventDefault={signup}
	novalidate
	action="/signup"
	method="POST"
	class="flex flex-col gap-4 w-[500px] mx-auto my-20 rounded-3xl p-8 bg-cyan-500 text-white shadow-sm"
>
	<h1 class="text-3xl font-blod mb-10">Todo Application Signup</h1>
	<input
		bind:value={signupForm.email}
		type="email"
		class="text-gray-800 rounded-full px-6 py-2 focus: outline-none"
		placeholder="이메일 입력"
	/>
	{#if submitted && errors?.email}
		<span class="text-xs text-red-500 mt-3 ps-4">{errors?.email[0]}</span>
	{/if}
	<input
		bind:value={signupForm.password}
		type="password"
		class="text-gray-800 rounded-full px-6 py-2 focus: outline-none"
		placeholder="비밀번호 입력"
	/>
	{#if submitted && errors?.password}
		<span class="text-xs text-red-500 mt-3 ps-4">{errors?.password[0]}</span>
	{/if}
	<input
		bind:value={signupForm.confirmPassword}
		type="password"
		class="text-gray-800 rounded-full px-6 py-2 focus: outline-none"
		placeholder="비밀번호 한번 더 입력"
	/>
	{#if submitted && errors?.confirmPassword}
		<span class="text-xs text-red-500 mt-3 ps-4">{errors.confirmPassword[0]}</span>
	{/if}
	<input
		bind:value={signupForm.name}
		type="text"
		class="text-gray-800 rounded-full px-6 py-2 focus: outline-none"
		placeholder="닉네임"
	/>
	{#if submitted && errors?.name}
		<span class="text-xs text-red-500 mt-3 ps-4">{errors?.name[0]}</span>
	{/if}
	<span class="self-end">이미 회원이신가요? <a href="/login" class="underline">로그인 하기</a></span
	>
	<button type="submit" class="rounded-full px-6 py-2 bg-amber-500">회원 가입하기</button>
</form>
