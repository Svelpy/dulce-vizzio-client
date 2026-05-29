<script lang="ts">
	import { Navbar, Sidebar, MobileBottomNav } from '$lib/components/ui';

	let { children } = $props();
</script>

<div class="flex h-screen bg-light-one">
	<Sidebar />
	<div class="flex flex-1 flex-col overflow-hidden transition-all duration-300">
		<Navbar />

		<main class="flex-1 overflow-y-auto p-2 md:p-6">
			{@render children?.()}
		</main>
	</div>
</div>
<!-- <div class="flex h-dvh w-full overflow-hidden bg-light-one dark:bg-dark-one">
	<Sidebar />
	<div class="flex min-w-0 flex-1 flex-col transition-all duration-300">
		<Navbar />

		<main class="mb-20 flex-1 overflow-y-auto p-4 md:mb-8 md:p-8">
			<div class="mx-auto h-full">
				{@render children?.()}
			</div>
		</main>
	</div>
</div> -->

<MobileBottomNav />
