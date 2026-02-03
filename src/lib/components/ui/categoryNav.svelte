<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	const categories = [
		{ title: 'Todos', icon: '📚', slug: '' },
		{ title: 'Pasteles', icon: '🎂', slug: 'pasteles' },
		{ title: 'Macarons', icon: '🍪', slug: 'macarons' },
		{ title: 'Chocolatería', icon: '🍫', slug: 'chocolateria' },
		{ title: 'Panes', icon: '🥖', slug: 'panes' },
		{ title: 'Decoración', icon: '🎨', slug: 'decoracion' },
		{ title: 'Postres', icon: '🍰', slug: 'postres' },
		{ title: 'Galletas', icon: '🍪', slug: 'galletas' },
		{ title: 'Tartas', icon: '🥧', slug: 'tartas' }
	];

	const handleCategoryClick = (slug: string) => {
		if (slug) {
			goto(`/app/courses?category=${encodeURIComponent(slug)}`);
		} else {
			goto('/app/courses');
		}
	};

	const isActiveCategory = (slug: string) => {
		const params = new URLSearchParams($page.url.search);
		const currentCategory = params.get('category');
		return currentCategory === slug || (!currentCategory && !slug);
	};
</script>

<div class="border-b border-gray-200 bg-white shadow-sm">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="scrollbar-hide flex gap-2 overflow-x-auto py-3">
			{#each categories as category}
				<button
					onclick={() => handleCategoryClick(category.slug)}
					class="flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all {isActiveCategory(
						category.slug
					)
						? 'bg-rose-500 text-white shadow-md'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				>
					<span class="text-lg">{category.icon}</span>
					<span>{category.title}</span>
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	/* Hide scrollbar for Chrome, Safari and Opera */
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
