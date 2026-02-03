<script lang="ts">
	import type { Lesson } from '$lib/interfaces';
	import { Badge } from '$lib/components/ui';
	import { CheckIcon, ClockIcon, PlayerPlayIcon } from '$lib/icons/outline';
	import { LockIcon } from '$lib/icons/solid';

	interface Props {
		lessons: Lesson[];
		currentLessonId?: string;
		completedLessonIds?: string[];
		isEnrolled?: boolean;
		onLessonClick?: (lesson: Lesson) => void;
	}

	let {
		lessons,
		currentLessonId,
		completedLessonIds = [],
		isEnrolled = false,
		onLessonClick
	}: Props = $props();

	// Format duration
	const formatDuration = (seconds?: number): string => {
		if (!seconds) return '0:00';
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	// Check if lesson is accessible
	const isAccessible = (lesson: Lesson): boolean => {
		return isEnrolled || lesson.is_preview;
	};

	// Check if lesson is completed
	const isCompleted = (lessonId: string): boolean => {
		return completedLessonIds.includes(lessonId);
	};

	// Check if lesson is current
	const isCurrent = (lessonId: string): boolean => {
		return lessonId === currentLessonId;
	};
</script>

<div class="space-y-2">
	{#each lessons as lesson (lesson.id)}
		<button
			class="w-full rounded-lg border text-left transition-all duration-200 {isCurrent(lesson.id)
				? 'border-rose bg-rose/5'
				: isCompleted(lesson.id)
					? 'border-green-200 bg-green-50/50'
					: 'border-grey/30 hover:border-taupe/50 hover:bg-cream/30 bg-white'} {!isAccessible(
				lesson
			)
				? 'cursor-not-allowed opacity-60'
				: 'cursor-pointer'}"
			disabled={!isAccessible(lesson)}
			onclick={() => {
				if (isAccessible(lesson)) {
					onLessonClick?.(lesson);
				}
			}}
		>
			<div class="flex items-center gap-3 p-4">
				<!-- Lesson Number/Icon -->
				<div class="flex-shrink-0">
					{#if isCompleted(lesson.id)}
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
							<CheckIcon class="h-5 w-5 text-white" />
						</div>
					{:else if !isAccessible(lesson)}
						<div class="bg-grey/40 flex h-8 w-8 items-center justify-center rounded-full">
							<LockIcon class="h-5 w-5 text-gray-500" />
						</div>
					{:else if isCurrent(lesson.id)}
						<div class="bg-rose flex h-8 w-8 items-center justify-center rounded-full">
							<PlayerPlayIcon class="h-5 w-5 text-white" />
						</div>
					{:else}
						<div
							class="bg-taupe/20 text-taupe flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold"
						>
							{lesson.order}
						</div>
					{/if}
				</div>

				<!-- Lesson Info -->
				<div class="min-w-0 flex-1">
					<div class="mb-1 flex items-start justify-between gap-2">
						<h4
							class="line-clamp-1 text-sm font-semibold text-gray-900 {isCurrent(lesson.id)
								? 'text-rose'
								: ''}"
						>
							{lesson.title}
						</h4>

						<!-- Badges -->
						<div class="flex flex-shrink-0 items-center gap-1">
							{#if lesson.is_preview}
								<span class="bg-gold/20 text-gold rounded px-2 py-0.5 text-xs font-semibold">
									Preview
								</span>
							{/if}
						</div>
					</div>

					<!-- Summary -->
					{#if lesson.summary}
						<p class="mb-1 line-clamp-1 text-xs text-gray-600">
							{lesson.summary}
						</p>
					{/if}

					<!-- Duration and Materials -->
					<div class="flex items-center gap-3 text-xs text-gray-500">
						{#if lesson.duration_seconds}
							<div class="flex items-center gap-1">
								<ClockIcon class="h-3.5 w-3.5" />
								<span>{formatDuration(lesson.duration_seconds)}</span>
							</div>
						{/if}

						{#if lesson.materials.length > 0}
							<span
								>{lesson.materials.length} material{lesson.materials.length > 1 ? 'es' : ''}</span
							>
						{/if}
					</div>
				</div>
			</div>
		</button>
	{/each}
</div>
