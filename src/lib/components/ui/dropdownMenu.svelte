<script lang="ts">
	import type { DropdownOption } from '$lib/interfaces';
	import { clickOutside } from '$lib/utils';
	import { scale } from 'svelte/transition';

	interface Props {
		options: DropdownOption[];
		width?: number;
		class: string;
		isOpen: boolean;
		text?: string;
	}

	let { options, width = 50, class: className, isOpen, text = '' }: Props = $props();

	function handleSelect(option: DropdownOption) {
		if (option.disabled) return;
		if (option.action) {
			option.action();
		}
		close();
	}

	function close(): void {
		isOpen = false;
	}
</script>

{#if isOpen}
	<div
		use:clickOutside={() => close()}
		class="z-20 rounded-md bg-light-one shadow-lg ring-1 ring-light-four focus:outline-none {className}"
		role="menu"
		aria-orientation="vertical"
		tabindex="-1"
		style="width: {width}px;"
		transition:scale={{ duration: 120, start: 0.95, opacity: 0 }}
	>
		{#if text}
			<div class="truncate px-4 py-2 text-sm font-bold text-light-two">{text}</div>
		{/if}
		{#each options as option, i (option.id)}
			{#if option.divider && i > 0}
				<div class="border-t border-light-four"></div>
			{/if}
			<div class="py-1" role="none">
				<button
					class={`group flex w-full cursor-pointer items-center px-4 py-2 text-sm ${
						option.disabled
							? 'cursor-not-allowed text-light-two'
							: option.variant === 'destructive'
								? 'text-red-600 hover:bg-red-50'
								: 'text-light-two hover:bg-light-one_d'
					}`}
					role="menuitem"
					tabindex="-1"
					onclick={() => handleSelect(option)}
					disabled={option.disabled}
				>
					{#if option.icon}
						<span
							class={`mr-3 size-5 ${
								option.variant === 'destructive'
									? 'text-red-500 group-hover:text-red-600'
									: 'text-light-two group-hover:text-light-two_d'
							}`}
						>
							{#await Promise.resolve(option.icon) then Icon}
								<Icon />
							{/await}
						</span>
					{/if}
					{option.label}
				</button>
			</div>
		{/each}
	</div>
{/if}
