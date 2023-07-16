import { error } from '@sveltejs/kit';
import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';

//이 파일은 svelte에서 요청을 보낼때 이부분을 통과 하도록 만듦 요청 방식에 따라 axios요청을 보낸다

export const GET = async <R>(url: string, config?: AxiosRequestConfig): Promise<R> => {
	return handleRequest('get', url, config);
};

export const POST = async <R>(
	url: string,
	body?: unknown,
	config?: AxiosRequestConfig
): Promise<R> => {
	return handleRequest('post', url, config, body);
};

export const PATCH = async <R>(
	url: string,
	body?: unknown,
	config?: AxiosRequestConfig
): Promise<R> => {
	return handleRequest('patch', url, config, body);
};
export const PUT = async <R>(
	url: string,
	body?: unknown,
	config?: AxiosRequestConfig
): Promise<R> => {
	return handleRequest('put', url, config, body);
};
export const DELETE = async <R>(url: string, config?: AxiosRequestConfig): Promise<R> => {
	return handleRequest('delete', url, config);
};

async function handleRequest<R>(
	method: 'get' | 'post' | 'put' | 'patch' | 'delete',
	url: string,
	config?: AxiosRequestConfig,
	body?: unknown
): Promise<R> {
	let response: AxiosResponse<R>;

	try {
		if (['get', 'delete'].includes(method)) {
			//이 요청는 바디가 필요 없어서 따로 나눔
			response = await axios[method]<R>(url, config);
		} else {
			response = await axios[method]<R>(url, body, config);
		}
		return response.data; //accesstoken을 받아온다
	} catch (err) {
		const status = (err as AxiosError).status || 500;
		const message = (err as AxiosError).message || 'unkown';
		throw error(status, message);
	}
}

axios.interceptors.request.use(function (config) {
	const accessToken = sessionStorage.getItem('accessToken');
	if (accessToken) config.headers.set('Authorization', `Bearer ${accessToken}`);
	return config;
});
//axios.interceptors.response.use(function (response) {});
//refresh token 받기
