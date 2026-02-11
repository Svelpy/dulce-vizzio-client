<script lang="ts">
	import { XMarkIcon } from '$lib/icons/outline';
	import type { CourseLesson } from '$lib/interfaces';

	interface Props {
		lesson: CourseLesson | null;
		onClose: () => void;
	}

	let { lesson, onClose }: Props = $props();

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}
</script>

{#if lesson}
	<!-- Modal Backdrop -->
	<div
		class="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 duration-200"
		onclick={handleBackdropClick}
	>
		<!-- Modal Content -->
		<div
			class="animate-in slide-in-from-bottom-4 w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl duration-300"
		>
			<!-- Header -->
			<div class="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 p-6">
				<div class="flex-1">
					<h3 class="text-xl font-bold text-slate-900">
						{lesson.title}
					</h3>
					<p class="mt-1 text-sm leading-relaxed text-slate-600">
						{lesson.summary}
					</p>
				</div>

				<button
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
					onclick={onClose}
					type="button"
					aria-label="Cerrar reproductor"
				>
					<XMarkIcon class="h-6 w-6" />
				</button>
			</div>

			<!-- Video Player -->
			<div class="relative w-full bg-black" style="padding-bottom: 56.25%;">
				<iframe
					src={lesson.video_url}
					title={lesson.title}
					allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
					allowfullscreen
					class="absolute top-0 left-0 h-full w-full border-0"
				></iframe>
			</div>

			<!-- Materials -->
			{#if lesson.materials.length > 0}
				<div class="border-t border-slate-200 bg-slate-50 p-6">
					<h4 class="mb-4 text-base font-semibold text-slate-900">Materiales de la lección</h4>
					<ul class="flex flex-col gap-2">
						{#each lesson.materials as material}
							<li>
								<a
									href={material.url}
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 font-medium text-violet-600 transition-all hover:border-violet-500 hover:shadow-md hover:shadow-violet-500/10"
								>
									<span>{material.title}</span>
									<span
										class="rounded bg-slate-100 px-2 py-1 text-xs font-semibold tracking-wide text-slate-600 uppercase"
									>
										{material.type}
									</span>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	@media (max-width: 768px) {
		.animate-in.slide-in-from-bottom-4 {
			animation: none;
		}
	}
</style>
