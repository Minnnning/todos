// See https://kit.svelte.dev/docs/types#app

import type { PrismaClient } from '@prisma/client';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
	type User = {
		email: string;
		name: string;
		password: string;
		image: steing | null;
	};

	type UserDto = {
		email: string;
		name: string;
		image: steing | null;
	};

	type LoginDto = {
		email: string;
		password: string;
	};

	type Project = {
		id: number;
		name: string;
		description: string;
		createdAt: Date;
		members: UserDto[];
		tasks: ProjectTask[];
		creator: UserDto;
	};

	type CreateProjectDto = Pick<Project, 'name' | 'description'>;

	type ProjectTask = {
		id: number;
		status: ProjectTaskStatus;
		users: User[];
	};

	enum ProjectTaskStatus {
		not_started = 'not_started',
		in_progress = 'in_porgerss',
		done = 'done'
	}
}

export {};
