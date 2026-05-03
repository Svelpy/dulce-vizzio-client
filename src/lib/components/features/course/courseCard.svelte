<script lang="ts">
	import { Button } from '$lib/components/ui';
	import { ClockIcon, ChefHatIcon, CakeIcon } from '$lib/icons/outline';
	import type { Course, CourseStatus } from '$lib/interfaces';
	import { formatDuration } from '$lib/utils';
	import { cn } from '$lib/utils';

	interface Props {
		course: Course;
		showProgress?: boolean;
		progress?: number;
		onclick?: () => void;
		priceVisible?: boolean;
		difficultyVisible?: boolean;
		contentVisible?: boolean;
		statusVisible?: boolean;
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
		statusVisible = false,
		actions
	}: Props = $props();

	const statusMap: Record<CourseStatus, { label: string; class: string; dot: string }> = {
		DRAFT: { label: 'Borrador', class: 'text-slate-400', dot: 'bg-slate-300' },
		REVIEW: { label: 'En Revisión', class: 'text-indigo-400', dot: 'bg-indigo-400' },
		PUBLISHED: { label: 'Publicado', class: 'text-sweet-pink-400', dot: 'bg-sweet-pink-400' },
		ARCHIVED: {
			label: 'Archivado',
			class: 'text-amber-500',
			dot: 'bg-amber-500'
		},
		RETIRED: { label: 'Retirado', class: 'text-rose-500', dot: 'bg-rose-500' }
	};

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
	class="group relative flex h-full cursor-pointer flex-col rounded-[32px] border-none bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-sweet"
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
	<!-- Image Container -->
	<div class="relative h-56 min-h-56 w-full overflow-hidden rounded-[32px] p-2">
		<div class="h-full w-full overflow-hidden rounded-[24px]">
			{#if course.cover_image_url}
				<img
					src={course.cover_image_url}
					alt={course.title}
					class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
				/>
			{:else}
				<div
					class="flex h-full w-full items-center justify-center bg-sweet-pink-50 text-sweet-pink-200"
				>
					<CakeIcon class="h-16 w-16" />
				</div>
			{/if}
		</div>
	</div>

	{#if actions}
		<div
			class="absolute top-5 right-5 z-20 transition-transform hover:scale-110"
			onclick={(e) => e.stopPropagation()}
		>
			{@render actions()}
		</div>
	{/if}

	<!-- Content -->
	{#if contentVisible}
		<div class="flex flex-1 flex-col p-6 pt-2">
			<div class="flex-1">
				<h3 class="mb-2 line-clamp-2 text-xl font-black text-sweet-brown transition-colors">
					{course.title}
				</h3>

				<p class="mb-4 line-clamp-2 text-sm font-bold text-sweet-brown/40">
					{course.description}
				</p>

				<!-- Meta Row -->
				<div class="mb-6 flex items-center justify-between border-t border-sweet-pink-50 pt-4">
					<div class="flex flex-col gap-2">
						<div class="flex items-center gap-3 text-[11px] font-black text-sweet-brown/60">
							<div class="flex items-center gap-1.5">
								<ClockIcon class="h-4 w-4 text-sweet-pink-400" />
								<span>{course.lessons_count} Lección</span>
							</div>
							{#if difficultyVisible}
								<div class="ml-1 flex items-center gap-0.5 text-sweet-pink-400">
									{#each Array.from({ length: getDifficultyLevel() }, (_, i) => i) as i (i)}
										<ChefHatIcon class="size-3.5 fill-current" />
									{/each}
								</div>
							{/if}
						</div>
						{#if statusVisible}
							<div class="flex items-center gap-1.5">
								<div
									class={cn(
										'h-1.5 w-1.5 rounded-full',
										statusMap[course.status]?.dot || 'bg-gray-400'
									)}
								></div>
								<span
									class={cn(
										'text-[9px] font-black tracking-widest uppercase',
										statusMap[course.status]?.class || 'text-gray-500'
									)}
								>
									{statusMap[course.status]?.label || course.status}
								</span>
							</div>
						{/if}
					</div>

					<div class="flex items-center gap-1 text-sm font-black text-sweet-brown">
						{#if priceVisible}
							<span>${course.price}</span>
							<span class="text-[10px] text-sweet-brown/40">{course.currency}</span>
						{:else}
							<ClockIcon class="h-4 w-4 text-sweet-pink-400" />
							<span>{formatDuration(course.total_duration_hours)}</span>
						{/if}
					</div>
				</div>

				{#if showProgress}
					<div class="mb-4">
						<div
							class="mb-2 flex items-center justify-between text-[11px] font-black text-sweet-brown/60"
						>
							<span>Progreso</span>
							<span class="text-sweet-pink-500">{progress}%</span>
						</div>
						<div class="h-2 w-full overflow-hidden rounded-full bg-sweet-pink-50">
							<div
								class="sweet-gradient-intense h-full transition-all duration-1000"
								style="width: {progress}%"
							></div>
						</div>
					</div>
				{/if}
			</div>

			<div class="mt-2">
				<Button
					onclick={handleCtaClick}
					class={cn(
						'sweet-gradient-intense flex h-12 w-full items-center justify-center rounded-2xl text-sm font-black text-white shadow-sweet active:scale-95',
						course.is_enrolled && 'from-sweet-pink-300 to-sweet-pink-400 opacity-90'
					)}
				>
					{course.is_enrolled ? 'Ver curso' : 'Inscribirse'}
				</Button>
			</div>
		</div>
	{/if}
</div>
