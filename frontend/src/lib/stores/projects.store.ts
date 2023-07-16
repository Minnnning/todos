import { browser } from '$app/environment';
import { DELETE, GET, POST } from '$lib/services/http';
import { get, writable } from 'svelte/store';

const { subscribe, set, update } = writable<Project[]>([]);



export const projectStore = {
	subscribe,
	set,
	get: (id: number) => {
		const projects = get(projectStore);
		return projects.find((project) => project.id === id) || null;
	},
	createProject: async (dto: CreateProjectDto) => {

        await POST('http://localhost:3333/project',dto);
        const projects = await GET('http://localhost:3333/project/get'); //해당 유저의 프로젝트를 가져온다
        //console.log(projects);

        set(projects as any);
	},
	removeProject: async (id: number) => {
        const projects = await DELETE(`http://localhost:3333/project/${id}`)
        set(projects as any);
	}
};

if (browser) {
	setTimeout(async() => {
		try {
			const projects = await GET('http://localhost:3333/project/get');
			projectStore.set(projects as any);
			console.log(projects)
		} catch (e) {
			console.trace(e);
		}
	}, 1000);
}
