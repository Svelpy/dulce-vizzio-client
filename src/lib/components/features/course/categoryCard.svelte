<script lang="ts">
	interface Props {
		title: string;
		icon: string;
		description?: string;
		//	onclick?: () => void;
	}

	let { title, icon, description }: Props = $props();
</script>

<button class=" overflow-hidden rounded-xl p-6">
	<!-- Icon -->
	<div class="mb-4 text-5xl">{icon}</div>

	<!-- Title -->
	<h3 class=" mb-1 text-lg font-bold text-gray-900">
		{title}
	</h3>

	<!-- Description -->
	{#if description}
		<p class="text-sm text-gray-600">{description}</p>
	{/if}
</button>
