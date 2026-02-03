<script lang="ts">
	interface Props {
		name: string;
		role: string;
		comment: string;
		rating: number;
		avatarUrl?: string;
	}

	let { name, role, comment, rating, avatarUrl }: Props = $props();
</script>

<div class="border-grey/30 rounded-xl border bg-white p-6 shadow-sm">
	<!-- Header -->
	<div class="mb-4 flex items-center gap-4">
		<!-- Avatar -->
		<div class="bg-cream h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
			{#if avatarUrl}
				<img src={avatarUrl} alt={name} class="h-full w-full object-cover" />
			{:else}
				<div
					class="from-rose/20 to-gold/20 text-taupe flex h-full w-full items-center justify-center bg-gradient-to-br text-lg font-bold"
				>
					{name.charAt(0)}
				</div>
			{/if}
		</div>

		<!-- Name and Role -->
		<div class="flex-1">
			<h4 class="font-bold text-gray-900">{name}</h4>
			<p class="text-sm text-gray-600">{role}</p>
		</div>

		<!-- Rating -->
		<div class="flex gap-0.5">
			{#each Array(5) as _, i}
				<span class="text-lg {i < rating ? 'text-gold' : 'text-grey/40'}">★</span>
			{/each}
		</div>
	</div>

	<!-- Comment -->
	<p class="text-gray-700 italic">"{comment}"</p>
</div>
