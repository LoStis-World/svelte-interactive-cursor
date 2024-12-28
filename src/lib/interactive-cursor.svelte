<script lang="ts">
	import type { InteractiveCursorProps, interactiveStateItem } from './index.js';

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
			y: e.clientY - cursor.offsetHeight / 2 + scrollY
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
			triggerAreaElement?.addEventListener('pointermove', startCursorTracking as EventListener, {
				passive: true
			});
			triggerAreaElement?.addEventListener('pointerleave', stopCursorTracking as EventListener);
		});

		// Remove event listeners on destroy
		return () => {
			triggerAreaElements?.forEach((triggerAreaElement) => {
				triggerAreaElement?.removeEventListener(
					'pointermove',
					startCursorTracking as EventListener
				);
				triggerAreaElement?.removeEventListener(
					'pointerleave',
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
	class={[
		'pointer-events-none fixed left-0 top-0 z-100',
		'motion-safe:transition-all motion-safe:duration-500',
		'flex size-[var(--size)] items-center justify-center rounded-full bg-white text-black',
		isActive ? 'visible opacity-100' : 'invisible opacity-0',
		classes,
		setInteractiveState.find((state) => state.data === currentInteractiveState)?.cursorClass || ''
	]}
	aria-hidden="true"
>
	{#each finalInteractiveStates as { icon, data }}
		{#if data === currentInteractiveState && icon}
			{@render activeicon(icon)}
		{/if}
	{/each}
</div>

<style>
	:global {
		.pointer-events-none {
			pointer-events: none;
		}
		.fixed {
			position: fixed;
		}
		.left-0 {
			left: 0;
		}
		.top-0 {
			top: 0;
		}
		.z-100 {
			z-index: 100;
		}
		.visible {
			visibility: visible;
		}
		.invisible {
			visibility: hidden;
		}
		.opacity-0 {
			opacity: 0;
		}
		.opacity-100 {
			opacity: 1;
		}
		.flex {
			display: flex;
		}
		.items-center {
			align-items: center;
		}
		.justify-center {
			justify-content: center;
		}
		.rounded-full {
			border-radius: 9999px;
		}
		.bg-white {
			background-color: #fff;
		}
		.text-black {
			color: #000;
		}
		.size-\[var(--size)\] {
			width: var(--size);
			height: var(--size);
		}

		@media (prefers-reduced-motion: no-preference) {
			.motion-safe\:transition-all {
				transition-property: all;
				transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
				transition-duration: 150ms;
			}
			.motion-safe\:duration-500 {
				transition-duration: 500ms;
			}
		}
	}

</style>