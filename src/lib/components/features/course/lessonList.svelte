<script lang="ts">
	import type { CourseLesson } from '$lib/interfaces';
	import { LessonItem } from '.';

	interface Props {
		lessons: CourseLesson[];
		isEnrolled: boolean;
		onPlayLesson?: (lesson: CourseLesson) => void;
	}

	let { lessons, isEnrolled, onPlayLesson }: Props = $props();

	const totalDuration = $derived(lessons.reduce((acc, lesson) => acc + lesson.duration_seconds, 0));

	const completedLessons = $derived(
		lessons.filter((lesson) => lesson.is_preview || isEnrolled).length
	);

	function formatTotalDuration(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);

		if (hours === 0) {
			return `${minutes} minutos`;
		}

		return `${hours}h ${minutes}m`;
	}
</script>

<section class="rounded-2xl border border-slate-200 bg-slate-50 p-8">
	<div class="mb-6 flex flex-wrap items-start justify-between gap-4">
		<div>
			<h2 class="text-3xl font-bold text-slate-900">Contenido del curso</h2>
			<p class="mt-2 text-base font-medium text-slate-600">
				{lessons.length} lecciones • {formatTotalDuration(totalDuration)} de contenido total
			</p>
		</div>

		{#if !isEnrolled}
			<div class="shrink-0">
				<span
					class="inline-block rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900"
				>
					{completedLessons} de {lessons.length} disponibles en vista previa
				</span>
			</div>
		{/if}
	</div>

	<div class="flex flex-col gap-3">
		{#each lessons as lesson (lesson.id)}
			<LessonItem {lesson} {isEnrolled} {onPlayLesson} />
		{/each}
	</div>
</section>
