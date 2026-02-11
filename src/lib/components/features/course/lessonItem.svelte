<script lang="ts">
	import { EyeOffIcon, PlayerPlayIcon } from '$lib/icons/outline';
	import { FileDescriptionIcon } from '$lib/icons/solid';
	import type { CourseLesson } from '$lib/interfaces';

	interface Props {
		lesson: CourseLesson;
		isEnrolled: boolean;
		onPlayLesson?: (lesson: CourseLesson) => void;
	}

	let { lesson, isEnrolled, onPlayLesson }: Props = $props();

	const canPlay = $derived(lesson.is_preview || isEnrolled);

	function formatDuration(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;

		if (minutes === 0) {
			return `${remainingSeconds}s`;
		}

		return remainingSeconds > 0
			? `${minutes}:${remainingSeconds.toString().padStart(2, '0')} min`
			: `${minutes} min`;
	}

	function handleClick() {
		if (canPlay && onPlayLesson) {
			onPlayLesson(lesson);
		}
	}
</script>

<button
	class="group w-full text-left transition-all duration-200 {canPlay
		? 'cursor-pointer hover:translate-x-1'
		: 'cursor-not-allowed opacity-60'}"
	onclick={handleClick}
	disabled={!canPlay}
	type="button"
>
	<div
		class="flex gap-4 rounded-xl border-2 bg-white p-5 {canPlay
			? 'border-slate-200 hover:border-violet-500 hover:shadow-lg hover:shadow-violet-500/10'
			: 'border-slate-200 bg-slate-50'}"
	>
		<!-- Icon -->
		<div
			class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg {canPlay
				? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white'
				: 'bg-slate-300 text-white'}"
		>
			{#if canPlay}
				<PlayerPlayIcon class="h-6 w-6" />
			{:else}
				<EyeOffIcon class="h-6 w-6" />
			{/if}
		</div>

		<!-- Content -->
		<div class="flex min-w-0 flex-1 flex-col gap-2">
			<div class="flex flex-wrap items-start justify-between gap-3">
				<h3 class="text-lg font-semibold text-slate-900">
					{lesson.order}. {lesson.title}
				</h3>

				<div class="flex shrink-0 items-center gap-2">
					{#if lesson.is_preview}
						<span
							class="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-blue-700 uppercase"
						>
							Vista previa
						</span>
					{/if}

					<span class="rounded-md bg-slate-100 px-2.5 py-1 text-sm font-medium text-slate-600">
						{formatDuration(lesson.duration_seconds)}
					</span>
				</div>
			</div>

			<p class="text-sm leading-relaxed text-slate-600">
				{lesson.summary}
			</p>

			{#if lesson.materials.length > 0}
				<div class="mt-1 flex items-center gap-1.5 text-sm font-medium text-violet-600">
					<FileDescriptionIcon class="h-4 w-4" />
					<span>{lesson.materials.length} material{lesson.materials.length !== 1 ? 'es' : ''}</span>
				</div>
			{/if}
		</div>
	</div>
</button>
