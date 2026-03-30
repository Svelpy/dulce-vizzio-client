<script lang="ts">
	import { Button } from '$lib/components/ui';
	import { BookIcon, ClockIcon, UsersIcon, ChefHatIcon } from '$lib/icons/outline';
	import { StarIcon } from '$lib/icons/solid';
	import type { Course } from '$lib/interfaces';
	import { formatDuration } from '$lib/utils';

	interface Props {
		course: Course;
		showProgress?: boolean;
		progress?: number;
		onclick?: () => void;
		priceVisible?: boolean;
		difficultyVisible?: boolean;
		contentVisible?: boolean;
		actions?: import('svelte').Snippet;
	}

	let {
		course,
		showProgress = false,
		progress = 0,
		onclick,
		priceVisible = true,
		difficultyVisible = true,
		contentVisible = true,
		actions
	}: Props = $props();

	const handleCtaClick = (e: MouseEvent) => {
		e.stopPropagation();
		if (course.is_enrolled) {
			onclick?.();
		} else {
			const message = `Hola, estoy interesado en el curso \n ${course.title}`;
			const encodedMessage = encodeURIComponent(message);
			const whatsappURL = `https://api.whatsapp.com/send?phone=59175618048&text=${encodedMessage}`;

			window.open(whatsappURL, '_blank');
		}
	};
	const getDifficultyLevel = (): number => {
		if (course.difficulty === 'ADVANCED') return 3;
		if (course.difficulty === 'INTERMEDIATE') return 2;
		return 1;
	};

	const difficultyLabels: Record<string, string> = {
		BEGINNER: 'Principiante',
		INTERMEDIATE: 'Intermedio',
		ADVANCED: 'Avanzado'
	};
</script>

<div
	class="group relative flex h-full cursor-pointer flex-col rounded-2xl border border-light-five/30 bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:border-dark-five dark:bg-dark-two"
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
	<div class="relative h-48 min-h-48 w-full overflow-hidden rounded-t-2xl">
		{#if course.cover_image_url}
			<img
				src={course.cover_image_url}
				alt={course.title}
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
			/>
		{:else}
			<div class="from-rose/20 to-gold/20 flex h-full w-full items-center justify-center">
				<BookIcon class="h-20 w-20 text-light-five dark:text-dark-five" />
			</div>
		{/if}

		{#if priceVisible}
			<div class="absolute right-3 bottom-3">
				<span class="rounded-full bg-light-three px-3 py-1.5 text-sm font-bold text-white">
					{course.price}
					<span class="text-xs">{course.currency}</span>
				</span>
			</div>
		{/if}
	</div>
	{#if actions}
		<div class="absolute top-3 right-3 z-10">
			{@render actions()}
		</div>
	{/if}

	{#if contentVisible}
		<div class="flex flex-1 flex-col p-4">
			<div class="flex-1">
				<div class="mb-2 flex items-center justify-between">
					<p class="text-taupe text-xs font-medium tracking-wide uppercase">
						{course.category}
					</p>
					{#if difficultyVisible}
						<div
							class="flex items-center gap-0.5 text-rose-500"
							title={difficultyLabels[course.difficulty]}
						>
							{#each Array.from({ length: getDifficultyLevel() }, (_, i) => i) as i (i)}
								<ChefHatIcon class="size-4" />
							{/each}
						</div>
					{/if}
				</div>

				<h3
					class="group-hover:text-rose mb-2 line-clamp-2 text-lg font-bold text-gray-900 transition-colors"
				>
					{course.title}
				</h3>

				<!-- Description -->
				<p class="mb-4 line-clamp-2 text-sm text-gray-600">
					{course.description}
				</p>

				<!-- Stats Row -->
				<div class="mb-4 flex items-center gap-4 text-xs text-gray-500">
					<!-- Rating -->
					{#if course.rating_average}
						<div class="flex items-center gap-1">
							<StarIcon class="text-gold fill-gold h-4 w-4" />
							<span class="font-semibold text-gray-700">{course.rating_average.toFixed(1)}</span>
						</div>
					{/if}

					<!-- Duration -->
					<div class="flex items-center gap-1">
						<ClockIcon class="h-4 w-4" />
						<span>{formatDuration(course.total_duration_hours)}</span>
					</div>

					<!-- Lessons -->
					<div class="flex items-center gap-1">
						<BookIcon class="h-4 w-4" />
						<span>{course.lessons_count} lecciones</span>
					</div>

					<!-- Students -->
					{#if course.enrollment_count > 0}
						<div class="flex items-center gap-1">
							<UsersIcon class="h-4 w-4" />
							<span>{course.enrollment_count}</span>
						</div>
					{/if}
				</div>

				<!-- Progress Bar (if enrolled) -->
				{#if showProgress}
					<div class="mt-4">
						<div class="mb-1 flex items-center justify-between text-xs text-gray-600">
							<span>Progreso</span>
							<span class="font-semibold">{progress}%</span>
						</div>
						<div class="bg-grey/30 h-2 w-full overflow-hidden rounded-full">
							<div
								class="from-rose to-gold h-full bg-linear-to-r transition-all duration-500"
								style="width: {progress}%"
							></div>
						</div>
					</div>
				{/if}
			</div>

			<div class="mt-4 pt-2">
				<Button onclick={handleCtaClick} variant="primary" fullWidth>
					{course.is_enrolled ? 'Ver curso' : 'Comprar ahora'}
				</Button>
			</div>
		</div>
	{/if}
</div>
