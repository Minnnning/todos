import { PUBLIC_API_HOST } from '$env/static/public';
import type { LayoutServerLoad } from './$types';
//import { redirect } from '@sveltejs/kit';

export const load = (async ({ fetch, cookies }) => {
	const apiHost = PUBLIC_API_HOST;
	const token = cookies.get('accessToken') || null;
	let user: UserDto | null = null;
	if (token) {
		user = await fetch(PUBLIC_API_HOST + '/auth/getme', {
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		}).then((response) => response.json());
	}

	return { apiHost, token, user }; // 이데이터는 +layout.svelte파일에 의해 page.data로 접근 가능
}) satisfies LayoutServerLoad;

//accesstoken만
