<script lang="ts">
	// Loading skeleton component with Tailwind
</script>

<div class="mx-auto max-w-7xl px-6 py-12 lg:px-8">
	<div class="flex flex-col gap-12">
		<!-- Header Skeleton -->
		<div class="grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
			<!-- Image Skeleton -->
			<div
				class="aspect-video w-full animate-pulse rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] lg:aspect-auto"
			></div>

			<!-- Content Skeleton -->
			<div class="flex flex-col gap-4">
				<!-- Badge -->
				<div
					class="h-7 w-32 animate-pulse rounded-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
				></div>

				<!-- Title -->
				<div
					class="h-12 w-3/4 animate-pulse rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
				></div>

				<!-- Description -->
				<div class="space-y-2">
					<div
						class="h-5 w-full animate-pulse rounded bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
					></div>
					<div
						class="h-5 w-4/5 animate-pulse rounded bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
					></div>
				</div>

				<!-- Stats -->
				<div class="flex flex-wrap gap-4">
					{#each Array(4) as _}
						<div
							class="h-10 w-28 animate-pulse rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
						></div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Lessons Skeleton -->
		<div class="rounded-2xl border border-slate-200 bg-slate-50 p-8">
			<div class="mb-6">
				<div
					class="mb-2 h-9 w-64 animate-pulse rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
				></div>
				<div
					class="h-5 w-80 animate-pulse rounded bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
				></div>
			</div>

			<div class="flex flex-col gap-3">
				{#each Array(5) as _, i}
					<div
						class="flex gap-4 rounded-xl border-2 border-slate-200 bg-white p-5"
						style="animation-delay: {i * 100}ms;"
					>
						<div
							class="h-12 w-12 shrink-0 animate-pulse rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
						></div>
						<div class="flex flex-1 flex-col gap-2">
							<div
								class="h-6 w-3/5 animate-pulse rounded bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
							></div>
							<div
								class="h-4 w-4/5 animate-pulse rounded bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
							></div>
						</div>
					</div>
				{/each}
			</div>
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
		animation: shimmer 2s infinite;
	}
</style>
