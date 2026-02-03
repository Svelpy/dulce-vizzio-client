<script lang="ts">
	import { PlayerPlayIcon } from '$lib/icons/outline';
	import type { Course } from '$lib/interfaces';

	interface Props {
		course: Course;
		progress: number;
		lastLessonTitle?: string;
		onclick?: () => void;
	}

	let { course, progress, lastLessonTitle, onclick }: Props = $props();

	// Calculate completed lessons
	const completedLessons = $derived(Math.round((progress / 100) * course.lessons_count));
</script>

<div
	class="group border-grey/30 relative cursor-pointer overflow-hidden rounded-xl border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg"
	role="button"
	tabindex="0"
	{onclick}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick?.();
		}
	}}
>
	<div class="flex gap-4">
		<!-- Course Cover -->
		<div class="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg">
			{#if course.cover_image_url}
				<img src={course.cover_image_url} alt={course.title} class="h-full w-full object-cover" />
			{:else}
				<div class="from-rose/20 to-gold/20 h-full w-full bg-gradient-to-br"></div>
			{/if}

			<!-- Play Overlay -->
			<div
				class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
			>
				<PlayerPlayIcon class="h-10 w-10 text-white" />
			</div>
		</div>

		<!-- Content -->
		<div class="min-w-0 flex-1">
			<!-- Title -->
			<h3
				class="group-hover:text-rose mb-1 line-clamp-1 text-base font-bold text-gray-900 transition-colors"
			>
				{course.title}
			</h3>

			<!-- Last Lesson -->
			{#if lastLessonTitle}
				<p class="mb-3 line-clamp-1 text-xs text-gray-500">
					Última lección: <span class="text-taupe font-medium">{lastLessonTitle}</span>
				</p>
			{/if}

			<!-- Progress Info -->
			<div class="mb-2 flex items-center justify-between text-xs text-gray-600">
				<span>{completedLessons} de {course.lessons_count} lecciones</span>
				<span class="text-rose font-semibold">{progress}% completado</span>
			</div>

			<!-- Progress Bar -->
			<div class="bg-grey/30 h-2 w-full overflow-hidden rounded-full">
				<div
					class="from-rose to-gold h-full bg-gradient-to-r transition-all duration-500"
					style="width: {progress}%"
				></div>
			</div>

			<!-- Continue Button -->
			<button
				class="text-rose hover:text-rose/80 mt-3 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
				onclick={(e) => {
					e.stopPropagation();
					onclick?.();
				}}
			>
				<PlayerPlayIcon class="h-4 w-4" />
				Continuar aprendiendo
			</button>
		</div>
	</div>
</div>
