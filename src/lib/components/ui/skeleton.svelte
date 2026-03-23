<script lang="ts">
	interface Props {
		class?: string;
		shape?: 'rect' | 'circle';
		animate?: boolean;
	}

	let { 
		class: className = '', 
		shape = 'rect', 
		animate = true 
	}: Props = $props();
</script>

<div
	class="bg-stone-200 {className} {shape === 'circle' ? 'rounded-full' : 'rounded-md'} {animate ? 'animate-pulse' : ''}"
></div>

<style>
	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>
