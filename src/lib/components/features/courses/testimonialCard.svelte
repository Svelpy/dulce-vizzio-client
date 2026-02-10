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

<div class="p-6">
	<!-- Header -->
	<div class="mb-4 flex flex-col items-center gap-4 lg:flex-row">
		<!-- Avatar -->
		<div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-light-three">
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
	</div>

	<!-- Comment -->
	<p class="text-gray-700 italic">"{comment}"</p>
</div>
