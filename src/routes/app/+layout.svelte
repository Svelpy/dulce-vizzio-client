<script lang="ts">
	import { Navbar, Sidebar } from '$lib/components/ui';

	let { children } = $props();
</script>

<div class="flex h-dvh w-full overflow-hidden bg-light-one dark:bg-dark-one">
	<!-- Sidebar handles its own resizing and styling (Hidden on mobile) -->
	<Sidebar />

	<!-- Right Side: Main Content Context -->
	<div class="flex min-w-0 flex-1 flex-col transition-all duration-300">
		<Navbar />

		<!-- Scrollable Area -->
		<main class="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
			<div class="mx-auto h-full max-w-[1600px]">
				{@render children?.()}
			</div>
		</main>
	</div>
</div>
