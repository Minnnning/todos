import { browser } from '$app/environment';
import { DELETE, GET, POST } from '$lib/services/http';
import { get, writable } from 'svelte/store';
import { PUBLIC_API_HOST } from '$env/static/public';

const { subscribe, set, update } = writable<Project[]>([]);

export const projectStore = {
	subscribe,
	set,
	get: (id: number) => {
		const projects = get(projectStore);
		return projects.find((project) => project.id === id) || null;
	},
	createProject: async (dto: CreateProjectDto) => {
		await POST( PUBLIC_API_HOST  + '/project', dto);
		const projects = await GET( PUBLIC_API_HOST  + '/project/get'); //해당 유저의 프로젝트를 가져온다
		//console.log(projects);

		set(projects as any);
	},
	removeProject: async (id: number) => {
		const projects = await DELETE( PUBLIC_API_HOST  + `/project/${id}`);
		set(projects as any);
	},

	addMember: async (id: number, dto: AddMemberDto) => {
		await POST( PUBLIC_API_HOST  + `/project/${id}/member`, dto);
		const projects = await GET( PUBLIC_API_HOST  + '/project/get');
		set(projects as any);
	}
};

if (browser) {
	setTimeout(async () => {
		try {
			const projects = await GET( PUBLIC_API_HOST  + '/project/get');
			projectStore.set(projects as any);
			console.log(projects);
		} catch (e) {
			console.trace(e);
		}
	}, 1000);
}
