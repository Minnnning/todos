import { API_HOST } from '$env/static/private';
import type { LayoutServerLoad } from './$types';
//import { redirect } from '@sveltejs/kit';

export const load = (async ({ fetch, cookies }) => {
	const apiHost = API_HOST;
	const token = cookies.get('accessToken') || null;
	let user: UserDto | null = null;
	if (token) {
		user = await fetch(API_HOST + '/auth/getme', {
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
