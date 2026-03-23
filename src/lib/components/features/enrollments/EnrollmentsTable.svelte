<script lang="ts">
	import type { Enrollment } from '$lib/interfaces';
	import { Button } from '$lib/components/ui';

	let { enrollments, onAction } = $props<{
		enrollments: Enrollment[];
		onAction: (enrollment: Enrollment) => void;
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

<div class="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
	<div class="overflow-x-auto">
		<table class="w-full text-left text-sm">
			<thead class="bg-stone-50 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
				<tr>
					<th class="px-6 py-4">Usuario</th>
					<th class="px-6 py-4">Curso</th>
					<th class="px-6 py-4">Estado</th>
					<th class="px-6 py-4 text-center">Inscripción</th>
					<th class="px-6 py-4 text-center">Vencimiento</th>
					<th class="px-6 py-4 text-right">Acciones</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-stone-100">
				{#each enrollments as enrollment (enrollment.id)}
					<tr class="transition-colors hover:bg-stone-50/50">
						<td class="whitespace-nowrap px-6 py-4">
							<div class="flex flex-col">
								<span class="font-medium text-stone-800">{enrollment.user?.full_name || 'Sin nombre'}</span>
								<span class="text-xs text-stone-400">@{enrollment.user?.username || 'S/U'}</span>
							</div>
						</td>
						<td class="px-6 py-4">
							<div class="flex items-center gap-3">
								{#if enrollment.course?.cover_image_url}
									<img
										src={enrollment.course.cover_image_url}
										alt={enrollment.course.title}
										class="h-8 w-8 rounded object-cover"
									/>
								{/if}
								<span class="line-clamp-1 max-w-[200px] font-medium text-stone-700">
									{enrollment.course?.title || 'Curso desconocido'}
								</span>
							</div>
						</td>
						<td class="whitespace-nowrap px-6 py-4">
							<span class="rounded-full px-2.5 py-1 text-xs font-semibold {statusColors[enrollment.status as keyof typeof statusColors] || 'bg-stone-100 text-stone-600'}">
								{enrollment.status}
							</span>
						</td>
						<td class="whitespace-nowrap px-6 py-4 text-center text-stone-600">
							{formatDate(enrollment.enrolled_at)}
						</td>
						<td class="whitespace-nowrap px-6 py-4 text-center text-stone-600">
							{formatDate(enrollment.expires_at)}
						</td>
						<td class="whitespace-nowrap px-6 py-4 text-right">
							<Button variant="ghost" size="sm" class="text-stone-400 hover:text-stone-800" onclick={() => onAction(enrollment)}>
								<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
							</Button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
