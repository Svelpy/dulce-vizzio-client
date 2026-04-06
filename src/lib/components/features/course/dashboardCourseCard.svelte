<script lang="ts">
	import { BookIcon, ChefHatIcon } from '$lib/icons/outline';
	import type { Course } from '$lib/interfaces';
	import { cn } from '$lib/utils';

	interface Props {
		course: Course;
		variant?: 'enrolled' | 'recommended';
		onclick?: () => void;
	}

	let { course, variant = 'enrolled', onclick }: Props = $props();
</script>

<div
	class={cn(
		'group relative flex flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:scale-[1.02]',
		variant === 'enrolled' ? 'w-64 shrink-0 bg-white shadow-sm' : 'w-full bg-white shadow-md'
	)}
	onclick={() => onclick?.()}
>
	<!-- Card Image -->
	<div
		class={cn(
			'relative overflow-hidden',
			variant === 'enrolled' ? 'h-32 rounded-t-3xl' : 'h-48 rounded-t-3xl'
		)}
	>
		{#if course.cover_image_url}
			<img
				src={course.cover_image_url}
				alt={course.title}
				class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
			/>
		{:else}
			<div class="flex h-full w-full items-center justify-center bg-sweet-pink-50">
				<BookIcon class="h-10 w-10 text-sweet-pink-200" />
			</div>
		{/if}

		<div
			class="absolute top-2 right-2 flex items-center gap-0.5 px-3 py-1.5 text-xs font-bold text-light-three"
		>
			<ChefHatIcon class="h-4 w-4" />
			{#if course.difficulty === 'INTERMEDIATE' || course.difficulty === 'ADVANCED'}
				<ChefHatIcon class="h-4 w-4" />
			{/if}
			{#if course.difficulty === 'ADVANCED'}
				<ChefHatIcon class="h-4 w-4" />
			{/if}
		</div>
	</div>

	<!-- Card Content -->
	<div class="flex flex-1 flex-col p-4">
		<h3 class="mb-1 line-clamp-1 text-base font-bold text-light-three">
			{course.title}
		</h3>

		{#if variant === 'enrolled'}
			<p class="mt-auto mb-3 text-xs font-medium text-light-four">
				{course.lessons_count || 0} Lecciones
			</p>
		{:else}
			<span class="line-clamp-2 text-sm font-medium text-light-five">
				{course.description}
			</span>
		{/if}
	</div>
</div>
