<script lang="ts">
	import { Skeleton } from '$lib/components/ui';
	import { TableRow, TableCell } from '$lib/components/ui';

	interface Props {
		rows?: number;
	}

	let { rows = 5 }: Props = $props();
</script>

{#each Array.from({ length: rows }, (_, i) => i) as i (i)}
	<TableRow>
		<TableCell>
			<div class="flex items-center gap-3">
				<Skeleton shape="circle" class="h-10 w-10 shrink-0" />
				<div class="flex flex-col gap-2">
					<Skeleton class="h-4 w-32" />
					<Skeleton class="h-3 w-48" />
				</div>
			</div>
		</TableCell>
		<TableCell class="hidden md:table-cell">
			<Skeleton class="h-4 w-24" />
		</TableCell>
		<TableCell class="hidden lg:table-cell">
			<Skeleton class="h-4 w-20" />
		</TableCell>
		<TableCell>
			<Skeleton class="h-6 w-16 rounded-full" />
		</TableCell>
		<TableCell class="text-right">
			<div class="flex justify-end gap-2">
				<Skeleton class="h-8 w-8 rounded-md" />
				<Skeleton class="h-8 w-8 rounded-md" />
			</div>
		</TableCell>
	</TableRow>
{/each}
