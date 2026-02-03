<script lang="ts">
	interface Props {
		title: string;
		icon: string;
		description?: string;
		onclick?: () => void;
	}

	let { title, icon, description, onclick }: Props = $props();
</script>

<button
	class="group border-grey/30 hover:border-rose/50 relative cursor-pointer overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
	{onclick}
>
	<!-- Icon -->
	<div class="mb-4 text-5xl">{icon}</div>

	<!-- Title -->
	<h3 class="group-hover:text-rose mb-1 text-lg font-bold text-gray-900 transition-colors">
		{title}
	</h3>

	<!-- Description -->
	{#if description}
		<p class="text-sm text-gray-600">{description}</p>
	{/if}

	<!-- Hover Effect -->
	<div
		class="from-rose/5 to-gold/5 absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100"
	></div>
</button>
