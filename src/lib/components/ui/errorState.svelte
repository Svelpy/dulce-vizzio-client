<script lang="ts">
	import { Button } from '$lib/components/ui';
	import { ExclamationCircleIcon } from '$lib/icons/solid';

	interface Props {
		message: string;
		onRetry?: () => void;
	}

	let { message, onRetry }: Props = $props();
</script>

<div class="flex min-h-[400px] items-center justify-center p-8">
	<div class="max-w-md text-center">
		<div class="mb-6 inline-flex rounded-full bg-red-50 p-6 text-red-600">
			<ExclamationCircleIcon class="h-16 w-16" />
		</div>

		<h2 class="mb-3 text-3xl font-bold text-slate-900">Oops! Algo salió mal</h2>

		<p class="mb-8 text-lg leading-relaxed text-slate-600">
			{message}
		</p>

		{#if onRetry}
			<Button onclick={onRetry} class="px-6 py-3">Intentar nuevamente</Button>
		{/if}
	</div>
</div>
