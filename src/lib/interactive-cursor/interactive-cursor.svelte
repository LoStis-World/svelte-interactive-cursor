<script lang="ts">
	import type { InteractiveCursorProps } from './index.js';

	// Props
	let {
		class: classes,
		duration = 500,
		triggerAreas,
		activeSizeMultiplicator = 3,
		defaultSize = 32,
		activeDataName = $bindable(''),
		activeDataElement = $bindable(null),
		useDataElementRect,
		children
	}: InteractiveCursorProps = $props();

	// Reactive state
	let pointerCords = $state({ x: 0, y: 0 });
	let isActive = $state(false);

	// DOM elements
	let cursor: HTMLDivElement | null;
	let triggerAreaElements: HTMLElement[] | null;

	// Start cursor tracking
	const startCursorTracking = (e: PointerEvent) => {
		if (!cursor) return;

		const target = e.target as HTMLElement;
		pointerCords = {
			x: e.clientX - cursor.offsetWidth / 2,
			y: e.clientY - cursor.offsetHeight / 2 + window.scrollY
		};

		// toggle active state
		isActive = true;

		// get active element bounding rect
		let dataElementRect = { x: 0, y: 0, width: 0, height: 0 };

		// check if target has interactive cursor data attribute
		if (target.closest('[data-interactive-cursor]')) {
			activeDataName =
				target.closest('[data-interactive-cursor]')?.getAttribute('data-interactive-cursor') || '';
			activeDataElement = target.closest('[data-interactive-cursor]');
			if (useDataElementRect?.includes(activeDataName)) {
				dataElementRect = activeDataElement?.getBoundingClientRect() || {
					x: 0,
					y: 0,
					width: 0,
					height: 0
				};
			}
		} else {
			activeDataName = '';
			activeDataElement = null;
		}

		// Get cursor element and set animation options
		const animationKeyframes = useDataElementRect?.includes(activeDataName)
			? [
					{ top: `${dataElementRect.y}px` },
					{ left: `${dataElementRect.x}px` },
					{ width: `${dataElementRect.width}px` },
					{ height: `${dataElementRect.height}px` },
					{
						transform: `translate3D(0, 0, 0) scale3D(1,1,1)`
					}
				]
			: [
					{ width: `${defaultSize}px` },
					{ height: `${defaultSize}px` },
					{
						transform: `translate3D(${pointerCords.x}px, ${pointerCords.y}px, 0) scale3D(${activeDataName !== '' ? activeSizeMultiplicator : 1}, ${activeDataName !== '' ? activeSizeMultiplicator : 1}, 1)`
					}
				];

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
				triggerAreaElement?.removeEventListener('mousemove', startCursorTracking as EventListener);
				triggerAreaElement?.removeEventListener('mouseleave', stopCursorTracking as EventListener);
			});
		};
	});
</script>

<div
	bind:this={cursor}
	style="--size:{defaultSize}px;"
	class="lw-interactive-cursor {classes}"
	class:active={isActive}
	aria-hidden="true"
>
	{@render children?.()}
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
