<script lang="ts">
	import type { Enrollment } from '$lib/interfaces';
	import { Button } from '$lib/components/ui';

	let { enrollment, onAction } = $props<{
		enrollment: Enrollment;
		onAction?: (enrollment: Enrollment) => void;
	}>();

	const statusColors = {
		ACTIVE: 'bg-green-100 text-green-700',
		EXPIRED: 'bg-amber-100 text-amber-700',
		CANCELLED: 'bg-rose-100 text-rose-700'
	};

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<div class="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition-all hover:border-stone-300">
	<div class="flex items-start justify-between gap-3">
		<div class="flex items-center gap-3">
			{#if enrollment.course?.cover_image_url}
				<img
					src={enrollment.course.cover_image_url}
					alt={enrollment.course.title}
					class="h-12 w-12 rounded-lg object-cover"
				/>
			{:else}
				<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100">
					<svg class="h-6 w-6 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
					</svg>
				</div>
			{/if}
			<div>
				<h3 class="line-clamp-1 font-semibold text-stone-800">{enrollment.course?.title || 'Curso desconocido'}</h3>
				<p class="text-sm text-stone-500">{enrollment.user?.full_name || enrollment.user?.username || 'Usuario desconocido'}</p>
			</div>
		</div>
		<span class="rounded-full px-2 py-0.5 text-xs font-medium {statusColors[enrollment.status as keyof typeof statusColors] || 'bg-stone-100 text-stone-600'}">
			{enrollment.status}
		</span>
	</div>

	<div class="grid grid-cols-2 gap-4 border-t border-stone-100 pt-3">
		<div>
			<p class="text-[10px] font-medium uppercase tracking-wider text-stone-400">Inscripción</p>
			<p class="text-sm font-medium text-stone-700">{formatDate(enrollment.enrolled_at)}</p>
		</div>
		<div>
			<p class="text-[10px] font-medium uppercase tracking-wider text-stone-400">Vence</p>
			<p class="text-sm font-medium text-stone-700">{formatDate(enrollment.expires_at)}</p>
		</div>
	</div>

	{#if onAction}
		<div class="flex justify-end pt-2">
			<Button variant="outline" size="sm" class="w-full text-stone-600 border-stone-200" onclick={() => onAction(enrollment)}>
				Detalles
			</Button>
		</div>
	{/if}
</div>
