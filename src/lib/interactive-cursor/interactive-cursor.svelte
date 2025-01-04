<script lang="ts">
	import type { Snippet } from 'svelte';
	import { type InteractiveCursorOptions, interactiveCursor } from './interactiveCursor.svelte.js';

	interface Props extends InteractiveCursorOptions {
		class?: string;
		children?: Snippet;
	}

	let {
		activeSizeMultiplicator,
		defaultSize,
		duration,
		useDataElementRect,
		class: classes,
		children
	}: Props = $props();

	// DOM element reference
	let cursor: HTMLDivElement;
	let initialCursor: ReturnType<typeof interactiveCursor> | undefined;
	// Dynamic cursor instance
	let activeDataElement = $state<HTMLElement | null>(null);
	let activeDataName = $state('');
	let isActive = $derived.by(() => initialCursor?.isActive ?? false);

	$inspect({ activeDataElement, activeDataName, isActive });

	$effect(() => {
		if (!document.querySelector('[data-interactive-cursor-area]')) return;

		import('./interactiveCursor.svelte.js').then(({ interactiveCursor }) => {
			const options: InteractiveCursorOptions = {
				defaultSize,
				activeSizeMultiplicator,
				duration,
				useDataElementRect
			};

			initialCursor = interactiveCursor(cursor, options);
			initialCursor?.init();

			// Update activeDataElement and activeDataName when cursor state changes
			$derived.by(() => {
				if (!initialCursor) return;
				activeDataElement = initialCursor.activeDataElement;
				activeDataName = initialCursor.activeDataName;
			});
		});

		return () => {
			initialCursor?.destroy();
		};
	});
</script>

<div
	bind:this={cursor}
	style="--size:{defaultSize ?? 24}px;"
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
