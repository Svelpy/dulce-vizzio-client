<script lang="ts">
	import { CourseCardSkeleton } from '$lib/components/skeletons/course';
</script>

<div class="space-y-12 pb-12">
	<!-- Welcome Skeleton -->
	<div class="space-y-3">
		<div
			class="h-10 w-64 animate-shimmer rounded-lg bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 bg-size-[200%_100%] dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"
		></div>
		<div
			class="h-4 w-48 animate-shimmer rounded bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 bg-size-[200%_100%] dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 opacity-50"
		></div>
	</div>

	<!-- My Courses Section -->
	<div class="space-y-6">
		<div
			class="h-8 w-40 animate-shimmer rounded-lg bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 bg-size-[200%_100%] dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"
		></div>
		<div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
			{#each { length: 5 } as _, i (i)}
				<CourseCardSkeleton />
			{/each}
		</div>
	</div>

	<!-- Recommended Courses Section -->
	<div class="space-y-6">
		<div
			class="h-8 w-60 animate-shimmer rounded-lg bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 bg-size-[200%_100%] dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"
		></div>
		<div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
			{#each { length: 5 } as _, i (i)}
				<CourseCardSkeleton />
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
