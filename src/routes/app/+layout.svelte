<script lang="ts">
	import { Navbar, Sidebar } from '$lib/components/ui';
	import { sidebarState } from '$lib/stores';

	let { children } = $props();

	// Calculate margin based on sidebar state
	const mainMargin = $derived(
		$sidebarState === 'hidden' ? 'ml-0' : $sidebarState === 'icon-only' ? 'ml-16' : 'ml-16'
	);
</script>

<div class="min-h-dvh bg-light-one dark:bg-dark-one">
	<Navbar />
	<Sidebar />

	<main class="mx-auto p-4 pt-20 transition-all duration-300 {mainMargin}">
		{@render children?.()}
	</main>
</div>
