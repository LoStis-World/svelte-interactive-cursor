<script lang="ts">
	import { type Snippet, onMount } from 'svelte';
	import type { InteractiveCursorOptions, InitialCursor } from './interactiveCursor.svelte.js';

	interface Props extends InteractiveCursorOptions {
		class?: string;
		children?: Snippet;
		activeDataValue?: {
			activeDataName: string;
			activeDataElement: HTMLElement | null;
		};
	}

	// Component props
	let {
		activeSizeMultiplicator = 3,
		defaultSize = 32,
		duration = 500,
		useDataElementRect = [],
		class: classes,
		activeDataValue = $bindable({ activeDataName: '', activeDataElement: null }),
		children
	}: Props = $props();

	// DOM element reference
	let cursor: HTMLDivElement;
	let initialCursor = $state<InitialCursor | null>(null);
	// Dynamic cursor props
	let isActive = $derived(initialCursor?.isActive ?? false);

	onMount(() => {
		// check if cursor is available and if reduced motion is enabled or if there is no interactive cursor area
		if (
			!cursor ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
			!document.querySelector('[data-interactive-cursor-area]') ||
			window.innerWidth < 1024
		)
			return;

		// import the interactive cursor module
		import('./interactiveCursor.svelte.js').then(({ interactiveCursor }) => {
			const options: InteractiveCursorOptions = {
				defaultSize,
				activeSizeMultiplicator,
				duration,
				useDataElementRect
			};

			initialCursor = interactiveCursor(cursor, options);
			initialCursor?.init();
		});

		// cleanup
		return () => initialCursor?.destroy();
	});

	// update active data value
	$effect(() => {
		if (initialCursor) {
			activeDataValue = {
				activeDataName: initialCursor?.activeDataValue.activeDataName ?? '',
				activeDataElement: initialCursor?.activeDataValue.activeDataElement ?? null
			};
		}
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
		width: var(--size);
		height: var(--size);
		opacity: 0;
		visibility: hidden;
		will-change: auto;
	}
	.lw-interactive-cursor.active {
		opacity: 1;
		visibility: visible;
	}

	@media (prefers-reduced-motion: no-preference) {
		.lw-interactive-cursor {
			transition: opacity 500ms cubic-bezier(0.4, 0, 0.2, 1);
		}
	}
</style>
