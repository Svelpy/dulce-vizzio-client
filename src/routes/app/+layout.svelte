<script lang="ts">
	import { Navbar, Sidebar } from '$lib/components/ui';
	import { sidebarState } from '$lib/stores';

	let { children } = $props();

	const mainMargin = $derived(`
		transition-all duration-300
		${$sidebarState === 'hidden' ? 'ml-0' : $sidebarState === 'icon-only' ? 'lg:ml-16 ml-0' : 'lg:ml-64 ml-0'}
	`);
</script>

<div class="min-h-dvh bg-light-one dark:bg-dark-one">
	<Navbar />
	<Sidebar />

	<main class="mx-auto mt-16 p-4 transition-all duration-300 md:p-8 {mainMargin}">
		{@render children?.()}
	</main>
</div>
