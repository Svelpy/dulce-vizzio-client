<script lang="ts">
	import type { Enrollment } from '$lib/interfaces';
	import { Button } from '$lib/components/ui';

	let { enrollments, actions } = $props<{
		enrollments: Enrollment[];
		actions?: import('svelte').Snippet<[Enrollment]>;
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

<div class="overflow-hidden rounded-xl">
	<div class="overflow-x-auto">
		<table class="w-full text-left text-sm">
			<thead class="bg-stone-50 text-[10px] font-semibold tracking-wider text-stone-500 uppercase">
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
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="flex flex-col">
								<span class="font-medium text-stone-800"
									>{enrollment.user?.full_name || 'Sin nombre'}</span
								>
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
						<td class="px-6 py-4 whitespace-nowrap">
							<span
								class="rounded-full px-2.5 py-1 text-xs font-semibold {statusColors[
									enrollment.status as keyof typeof statusColors
								] || 'bg-stone-100 text-stone-600'}"
							>
								{enrollment.status}
							</span>
						</td>
						<td class="px-6 py-4 text-center whitespace-nowrap text-stone-600">
							{formatDate(enrollment.enrolled_at)}
						</td>
						<td class="px-6 py-4 text-center whitespace-nowrap text-stone-600">
							{formatDate(enrollment.expires_at)}
						</td>
						<td class="px-6 py-4 text-right whitespace-nowrap">
							{#if actions}
								{@render actions(enrollment)}
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
