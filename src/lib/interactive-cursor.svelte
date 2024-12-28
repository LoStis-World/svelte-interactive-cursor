<script lang="ts">
	import type { InteractiveCursorProps, interactiveStateItem } from './index.js';
	import { twMerge } from 'tailwind-merge';
	import { clsx } from 'clsx';

	// Props
	let {
		class: classes,
		duration = 500,
		setInteractiveState = [],
		triggerAreas,
		activeSizeMultiplicator = 3,
		defaultSize = 32
	}: InteractiveCursorProps = $props();

	// Reactive state
	let pointerCords = $state({ x: 0, y: 0 });
	let isActive = $state(false);
	let currentInteractiveState = $state('');

	// DOM elements
	let cursor: HTMLDivElement | null;
	let triggerAreaElements: HTMLElement[] | null;

	// Set default interactive values
	const defaultInteractiveStates: interactiveStateItem[] = [
		{
			data: 'image',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>`
		},
		{
			data: 'video',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>`,
		},
		{
			data: 'link',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" /></svg>`,
		}
	];

	// Combined interactive values
	const finalInteractiveStates = new Map<string, interactiveStateItem>([
		...defaultInteractiveStates.map((item) => [item.data, item] as [string, interactiveStateItem]),
		...setInteractiveState.map((item) => [item.data, item] as [string, interactiveStateItem])
	]).values();

	// Start cursor tracking
	const startCursorTracking = (e: PointerEvent) => {
		if (!cursor) return;
		const target = e.target as HTMLElement;
		pointerCords = {
			x: e.clientX - cursor.offsetWidth / 2,
			y: e.clientY - cursor.offsetHeight / 2 + (window.scrollY || window.pageYOffset)
		};
		isActive = true;

		// check if target has interactive cursor data attribute
		if (target.closest('[data-interactive-cursor]')) {
			currentInteractiveState =
				target.closest('[data-interactive-cursor]')?.getAttribute('data-interactive-cursor') || '';
		} else {
			currentInteractiveState = '';
		}

		// Get cursor element and set animation options
		const animationKeyframes = {
			transform: `translate3D(${pointerCords.x}px, ${pointerCords.y}px, 0) scale3D(${currentInteractiveState !== '' ? activeSizeMultiplicator : 1}, ${currentInteractiveState !== '' ? activeSizeMultiplicator : 1}, 1)`
		};

		const animationTiming: KeyframeAnimationOptions = {
			duration: duration,
			fill: 'forwards' as FillMode
		};

		// Animate cursor
		cursor.animate(animationKeyframes, animationTiming);
	};

	// Stop cursor tracking
	const stopCursorTracking = () => {
		pointerCords = { x: 0, y: 0 };
		isActive = false;
	};

	$effect(() => {
		if (!triggerAreas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		// Set triggerAreas elements as array of HTMLElements
		triggerAreaElements = (
			triggerAreas.map((area) =>
				typeof area === 'string' ? document.querySelector(area as string) : (area as HTMLElement)
			) || []
		).filter((el): el is HTMLElement => el !== null);

		// Add event listeners
		triggerAreaElements?.forEach((triggerAreaElement) => {
			triggerAreaElement?.addEventListener('mousemove', startCursorTracking as EventListener, {
				passive: true
			});
			triggerAreaElement?.addEventListener('mouseleave', stopCursorTracking as EventListener);
		});

		// Remove event listeners on destroy
		return () => {
			triggerAreaElements?.forEach((triggerAreaElement) => {
				triggerAreaElement?.removeEventListener(
					'mousemove',
					startCursorTracking as EventListener
				);
				triggerAreaElement?.removeEventListener(
					'mouseleave',
					stopCursorTracking as EventListener
				);
			});
		};
	});
</script>

{#snippet activeicon(icon: string | HTMLElement | null = null)}
	{#if typeof icon === 'string' && icon.startsWith('<svg')}
		{@html icon}
	{:else}
		{icon}
	{/if}
{/snippet}

<div
	bind:this={cursor}
	style="--size:{defaultSize}px;"
	class="lw-interactive-cursor {twMerge(
		classes,
		setInteractiveState.find((state) => state.data === currentInteractiveState)?.cursorClass || ''
	)}"
	class:active={isActive}
	aria-hidden="true"
>
	{#each finalInteractiveStates as { icon, data }}
		{#if data === currentInteractiveState && icon}
			{@render activeicon(icon)}
		{/if}
	{/each}
</div>

<style>
	.lw-interactive-cursor {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		pointer-events: none;
		display: flex;
		justify-content: center;
		align-items: center;
		width: var(--size);
		height: var(--size);
		opacity: 0;
		visibility: hidden;
	}
	.lw-interactive-cursor.active {
		opacity: 1;
		visibility: visible;
	}
	@media (prefers-reduced-motion: no-preference) {
		.lw-interactive-cursor {
			transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
		}
	}
	</style>