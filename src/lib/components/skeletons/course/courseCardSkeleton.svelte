<script lang="ts">
	// Course card skeleton with shimmer effect
</script>

<div
	class="flex h-full flex-col overflow-hidden rounded-2xl border border-light-five/20 bg-white dark:border-dark-five dark:bg-dark-two"
>
	<!-- Image area -->
	<div
		class="relative h-48 w-full animate-pulse bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 bg-size-[200%_100%] dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"
	></div>

	<!-- Content area -->
	<div class="flex flex-1 flex-col p-4">
		<div class="flex-1 space-y-3">
			<!-- Category -->
			<div
				class="h-3 w-20 animate-pulse rounded bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 bg-size-[200%_100%] dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"
			></div>

			<!-- Title -->
			<div
				class="h-6 w-full animate-pulse rounded bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 bg-size-[200%_100%] dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"
			></div>

			<!-- Description (2 lines) -->
			<div class="space-y-2">
				<div
					class="h-4 w-full animate-pulse rounded bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 bg-size-[200%_100%] dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"
				></div>
				<div
					class="h-4 w-4/5 animate-pulse rounded bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 bg-size-[200%_100%] dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"
				></div>
			</div>

			<!-- Stats row -->
			<div class="flex gap-4 pt-2">
				<div
					class="h-4 w-12 animate-pulse rounded bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 bg-size-[200%_100%] dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"
				></div>
				<div
					class="h-4 w-12 animate-pulse rounded bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 bg-size-[200%_100%] dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"
				></div>
			</div>
		</div>

		<!-- Button -->
		<div class="mt-4 pt-2">
			<div
				class="h-10 w-full animate-pulse rounded-xl bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 bg-size-[200%_100%] dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"
			></div>
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

	.animate-pulse {
		animation: shimmer 2s infinite linear;
	}
</style>
