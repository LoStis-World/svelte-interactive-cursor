<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { InteractiveCursorOptions, InitiaCursor } from './interactiveCursor.svelte.js';

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
	let initialCursor = $state<InitiaCursor | null>(null);
	// Dynamic cursor instance
	let activeDataElement = $derived<HTMLElement | null>(initialCursor?.activeDataElement ?? null);
	let activeDataName = $derived<string>(initialCursor?.activeDataName ?? '');
	let isActive = $derived<boolean>(initialCursor?.isActive ?? false);

	$inspect({ activeDataElement, activeDataName, isActive });

	$effect(() => {
		// check if cursor is available and if reduced motion is enabled
		if (
			!cursor ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
			!document.querySelector('[data-interactive-cursor-area]')
		)
			return;

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

		return () => initialCursor?.destroy();
	});
</script>

<div
	bind:this={cursor}
	style="--size:{defaultSize ?? 32}px;"
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
