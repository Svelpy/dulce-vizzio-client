<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		value: string | number;
		icon?: Snippet;
		trend?: {
			value: number;
			isPositive: boolean;
		};
		color?: 'rose' | 'gold' | 'taupe' | 'green';
	}

	let { title, value, icon, trend, color = 'rose' }: Props = $props();

	const colorClasses = {
		rose: 'bg-rose/10 text-rose',
		gold: 'bg-gold/10 text-gold',
		taupe: 'bg-taupe/10 text-taupe',
		green: 'bg-green-500/10 text-green-600'
	};

	const iconBgClasses = {
		rose: 'bg-rose',
		gold: 'bg-gold',
		taupe: 'bg-taupe',
		green: 'bg-green-500'
	};
</script>

<div
	class="border-grey/30 rounded-xl border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
>
	<div class="flex items-start justify-between">
		<div class="flex-1">
			<p class="mb-1 text-sm font-medium text-gray-600">{title}</p>
			<p class="mb-2 text-3xl font-bold text-gray-900">{value}</p>

			{#if trend}
				<div class="flex items-center gap-1 text-sm">
					<span class={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
						{trend.isPositive ? '↑' : '↓'}
						{Math.abs(trend.value)}%
					</span>
					<span class="text-gray-500">vs. mes anterior</span>
				</div>
			{/if}
		</div>

		{#if icon}
			<div class="flex h-12 w-12 items-center justify-center rounded-lg {iconBgClasses[color]}">
				<div class="text-white">
					{@render icon()}
				</div>
			</div>
		{/if}
	</div>
</div>
