<script lang="ts">
	import { type Snippet, onMount } from 'svelte';
	import type { InteractiveCursorOptions, InitialCursor } from './interactiveCursor.svelte.js';

	// Cache the dynamic import at module level — shared across all component instances
	let moduleCache:
		| Promise<{
				interactiveCursor: (
					cursor: HTMLElement,
					options: InteractiveCursorOptions
				) => InitialCursor;
		  }>
		| undefined;

	interface Props extends InteractiveCursorOptions {
		class?: string;
		children?: Snippet;
		breakpoint?: number;
		isActive?: boolean;
		activeDataValue?: {
			activeDataName: string;
			activeDataElement: HTMLElement | null;
		};
	}

	// Component props
	let {
		scaleOnActive = [],
		defaultSize = 32,
		duration = 500,
		easing = 'linear',
		useDataElementRect = [],
		hideNativeCursor = false,
		breakpoint = 1024,
		class: classes,
		activeDataValue = $bindable({ activeDataName: '', activeDataElement: null }),
		isActive = $bindable(false),
		children
	}: Props = $props();

	// DOM element reference
	let cursor: HTMLDivElement;
	let initialCursor = $state<InitialCursor | null>(null);

	onMount(() => {
		if (
			!cursor ||
			!document.querySelector('[data-interactive-cursor-area]') ||
			window.innerWidth < breakpoint
		)
			return;

		const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (reducedMotionQuery.matches) return;

		// Re-use the cached import if already loaded, otherwise start a new one
		moduleCache ??= import('./interactiveCursor.svelte.js');
		moduleCache.then(({ interactiveCursor }) => {
			const options: InteractiveCursorOptions = {
				defaultSize,
				scaleOnActive,
				duration,
				easing,
				useDataElementRect,
				hideNativeCursor
			};

			initialCursor = interactiveCursor(cursor, options);
			initialCursor?.init();
		});

		// Destroy cursor if the user enables reduced motion mid-session
		const handleReducedMotionChange = (e: MediaQueryListEvent) => {
			if (e.matches) {
				initialCursor?.destroy();
				initialCursor = null;
			}
		};
		reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

		return () => {
			initialCursor?.destroy();
			reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
		};
	});

	// sync bindable props from internal cursor state
	$effect(() => {
		if (initialCursor) {
			activeDataValue = {
				activeDataName: initialCursor.activeDataValue.activeDataName,
				activeDataElement: initialCursor.activeDataValue.activeDataElement
			};
			isActive = initialCursor.isActive;
		} else {
			isActive = false;
		}
	});
</script>

<div
	bind:this={cursor}
	style="--size:{defaultSize}px;"
	class="lw-interactive-cursor {classes ?? ''}"
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
		width: var(--size);
		height: var(--size);
		opacity: 0;
		visibility: hidden;
	}
	.lw-interactive-cursor.active {
		opacity: 1;
		visibility: visible;
		will-change: auto;
	}

	@media (prefers-reduced-motion: no-preference) {
		.lw-interactive-cursor {
			transition: opacity 500ms cubic-bezier(0.4, 0, 0.2, 1);
		}
	}
</style>
