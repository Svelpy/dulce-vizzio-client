<script lang="ts">
	import { Badge } from '$lib/components/ui';
	import { BookIcon, ClockIcon, UsersIcon } from '$lib/icons/outline';
	import { StarIcon } from '$lib/icons/solid';
	import type { Course } from '$lib/interfaces';

	interface Props {
		course: Course;
		showProgress?: boolean;
		progress?: number;
		onclick?: () => void;
	}

	let { course, showProgress = false, progress = 0, onclick }: Props = $props();

	// Format duration to hours and minutes
	const formatDuration = (hours: number): string => {
		const h = Math.floor(hours);
		const m = Math.round((hours - h) * 60);
		if (h === 0) return `${m}min`;
		if (m === 0) return `${h}h`;
		return `${h}h ${m}min`;
	};

	// Format price
	const formatPrice = (price: number, currency: string): string => {
		if (price === 0) return 'Gratis';
		return `${currency === 'USD' ? '$' : currency} ${price.toFixed(2)}`;
	};

	// Difficulty badge colors
	const difficultyColors = {
		BEGINNER: 'bg-green-100 text-green-800',
		INTERMEDIATE: 'bg-blue-100 text-blue-800',
		ADVANCED: 'bg-orange-100 text-orange-800',
		EXPERT: 'bg-red-100 text-red-800'
	};

	const difficultyLabels = {
		BEGINNER: 'Principiante',
		INTERMEDIATE: 'Intermedio',
		ADVANCED: 'Avanzado',
		EXPERT: 'Experto'
	};
</script>

<div
	class="group border-grey/30 relative cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
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
	<!-- Cover Image -->
	<div class="bg-cream relative h-48 w-full overflow-hidden">
		{#if course.cover_image_url}
			<img
				src={course.cover_image_url}
				alt={course.title}
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
			/>
		{:else}
			<div
				class="from-rose/20 to-gold/20 flex h-full w-full items-center justify-center bg-gradient-to-br"
			>
				<BookIcon class="text-taupe/40 h-20 w-20" />
			</div>
		{/if}

		<!-- Gradient Overlay -->
		<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

		<!-- Difficulty Badge -->
		<div class="absolute top-3 left-3">
			<span
				class="rounded-full px-3 py-1 text-xs font-semibold {difficultyColors[course.difficulty]}"
			>
				{difficultyLabels[course.difficulty]}
			</span>
		</div>

		<!-- Price Badge -->
		<div class="absolute top-3 right-3">
			<span class="bg-gold rounded-full px-3 py-1.5 text-sm font-bold text-white shadow-lg">
				{formatPrice(course.price, course.currency)}
			</span>
		</div>
	</div>

	<!-- Content -->
	<div class="p-5">
		<!-- Category -->
		<p class="text-taupe mb-2 text-xs font-medium tracking-wide uppercase">
			{course.category}
		</p>

		<!-- Title -->
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
						class="from-rose to-gold h-full bg-gradient-to-r transition-all duration-500"
						style="width: {progress}%"
					></div>
				</div>
			</div>
		{/if}
	</div>
</div>
