import { writable } from 'svelte/store';
import { Subject, type Observable, first } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Component = any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { subscribe, set, update } = writable<Modal<any, any>[]>([]);

type ModalOptions<Input> = {
	data?: Input;
};

type Modal<Input, Output> = {
	component: Component;
	options?: ModalOptions<Input>;
	_subject: Subject<Output | undefined>;
};

export const modalStore = {
	subscribe,
	open: <Input, Output>(
		component: Component,
		options?: ModalOptions<Input>
	): Observable<Output | undefined> => {
		const modal: Modal<Input, Output> = {
			component,
			options,
			_subject: new Subject<Output | undefined>()
		};
		update((modals) => {
			return [...modals, modal];
		});
		return modal._subject.asObservable().pipe(first());
	},
	close: <Output>(data?: Output) => {
		update((modals) => {
			const modal = modals.pop();
			modal?._subject.next(data);
			return [...modals];
		});
	},
	clear: () => {
		set([]);
	}
};
