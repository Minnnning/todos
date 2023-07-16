<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import type { LayoutData } from './$types';
	import Modalportal from '$lib/components/Modalportal.svelte';
	export let data: LayoutData; //이부분은 통해서 데이터를 밖에서 사용가능
	//해당 컴포넌트에서 import { page } from '$app/stores'를 통해서 page.data이용가능

	$: console.log('user data', data);
</script>

<Header />
<!-- <SideBar /> -->
<main>
	<slot />
</main>

<Modalportal />
