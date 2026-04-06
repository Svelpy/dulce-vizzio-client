<script lang="ts">
</script>

<div class="space-y-12 pb-12">
	<!-- Welcome Skeleton -->
	<div class="space-y-3">
		<div
			class="animate-shimmer h-10 w-64 rounded-xl bg-linear-to-r from-sweet-pink-50 via-white to-sweet-pink-50 bg-size-[200%_100%]"
		></div>
		<div
			class="animate-shimmer h-4 w-48 rounded-lg bg-linear-to-r from-sweet-pink-50 via-white to-sweet-pink-50 bg-size-[200%_100%] opacity-50"
		></div>
	</div>

	<!-- Enrolled Courses Section (Horizontal Scroll) -->
	<div class="space-y-6">
		<div
			class="animate-shimmer h-8 w-40 rounded-xl bg-linear-to-r from-sweet-pink-50 via-white to-sweet-pink-50 bg-size-[200%_100%]"
		></div>
		<div class="scrollbar-hide flex gap-4 overflow-x-auto pb-4">
			{#each { length: 4 } as _, i (i)}
				<div
					class="animate-shimmer h-48 w-64 shrink-0 rounded-3xl bg-linear-to-r from-sweet-pink-50 via-white to-sweet-pink-50 bg-size-[200%_100%]"
				></div>
			{/each}
		</div>
	</div>

	<!-- Recommended Courses Section (Grid) -->
	<div class="space-y-6">
		<div
			class="animate-shimmer h-8 w-60 rounded-xl bg-linear-to-r from-sweet-pink-50 via-white to-sweet-pink-50 bg-size-[200%_100%]"
		></div>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
			{#each { length: 4 } as _, i (i)}
				<div
					class="animate-shimmer h-64 w-full rounded-3xl bg-linear-to-r from-sweet-pink-50 via-white to-sweet-pink-50 bg-size-[200%_100%]"
				></div>
			{/each}
		</div>
	</div>
</div>

<style>
	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}

	.animate-shimmer {
		animation: shimmer 2.5s infinite linear;
	}
</style>
