<script lang="ts">
	import { WhatsappIcon, UsersIcon, ClockIcon } from '$lib/icons/outline';
	import { BookIcon, StarIcon } from '$lib/icons/solid';
	import type { CourseDetail } from '$lib/interfaces';

	interface Props {
		course: CourseDetail;
	}

	let { course }: Props = $props();

	const difficultyColors = {
		BEGINNER: 'bg-emerald-50 text-emerald-700 border-emerald-200',
		INTERMEDIATE: 'bg-amber-50 text-amber-700 border-amber-200',
		ADVANCED: 'bg-rose-50 text-rose-700 border-rose-200'
	};

	const difficultyLabels = {
		BEGINNER: 'Principiante',
		INTERMEDIATE: 'Intermedio',
		ADVANCED: 'Avanzado'
	};

	function formatDuration(hours: number): string {
		if (hours < 1) {
			const minutes = Math.round(hours * 60);
			return `${minutes} min`;
		}
		return `${hours.toFixed(1)} hrs`;
	}
</script>

<header
	class="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white"
>
	<!-- Pattern Background -->
	<div class="absolute inset-0 opacity-10">
		<div
			class="absolute inset-0"
			style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;);"
		></div>
	</div>

	<div class="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:px-8">
		<div class="grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
			<!-- Cover Image -->
			{#if course.cover_image_url}
				<div
					class="aspect-video w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/30 backdrop-blur-sm lg:aspect-auto"
				>
					<img src={course.cover_image_url} alt={course.title} class="h-full w-full object-cover" />
				</div>
			{:else}
				<div
					class="flex aspect-video w-full items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm lg:aspect-auto"
				>
					<BookIcon class="h-24 w-24 text-white/40" />
				</div>
			{/if}

			<!-- Course Info -->
			<div class="flex flex-col gap-4">
				<!-- Category & Difficulty -->
				<div class="flex flex-wrap items-center gap-3">
					<span
						class="rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
					>
						{course.category} • {course.subcategory}
					</span>
					<span
						class="rounded-full border px-4 py-1.5 text-sm font-semibold {difficultyColors[
							course.difficulty
						]}"
					>
						{difficultyLabels[course.difficulty]}
					</span>
				</div>

				<!-- Title -->
				<h1 class="text-4xl leading-tight font-extrabold tracking-tight drop-shadow-lg lg:text-5xl">
					{course.title}
				</h1>

				<!-- Description -->
				<p class="text-lg leading-relaxed text-white/95">
					{course.description}
				</p>

				<!-- Stats -->
				<div class="flex flex-wrap gap-4">
					<div class="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 backdrop-blur-sm">
						<ClockIcon class="h-5 w-5" />
						<span class="font-medium">{formatDuration(course.total_duration_hours)}</span>
					</div>

					<div class="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 backdrop-blur-sm">
						<BookIcon class="h-5 w-5" />
						<span class="font-medium">{course.lessons_count} lecciones</span>
					</div>

					<div class="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 backdrop-blur-sm">
						<UsersIcon class="h-5 w-5" />
						<span class="font-medium">{course.enrollment_count} estudiantes</span>
					</div>

					{#if course.rating_average}
						<div class="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 backdrop-blur-sm">
							<StarIcon class="h-5 w-5 fill-current" />
							<span class="font-medium">{course.rating_average.toFixed(1)}</span>
						</div>
					{/if}
				</div>

				<!-- Tags -->
				{#if course.tags.length > 0}
					<div class="flex flex-wrap gap-2">
						{#each course.tags as tag}
							<span
								class="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium"
							>
								#{tag}
							</span>
						{/each}
					</div>
				{/if}

				<!-- Actions -->
				{#if course.whatsapp_group_url}
					<div class="mt-2">
						<a
							href={course.whatsapp_group_url}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-semibold text-white shadow-lg shadow-green-500/40 transition-all hover:-translate-y-0.5 hover:bg-green-600 hover:shadow-xl hover:shadow-green-500/50"
						>
							<WhatsappIcon class="h-5 w-5" />
							Unirse al grupo
						</a>
					</div>
				{/if}
			</div>
		</div>
	</div>
</header>
