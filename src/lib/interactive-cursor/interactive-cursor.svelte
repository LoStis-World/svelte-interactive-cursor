<script lang="ts">
	import type { InteractiveCursorProps } from './index.js';
	import {
		InteractiveCursorClass,
		type InteractiveCursorClassProps
	} from './interactiveCursor.svelte.js';

	// Props
	let {
		class: classes,
		duration = 500,
		activeSizeMultiplicator = 3,
		defaultSize = 32,
		activeDataName = $bindable(''),
		activeDataElement = $bindable(null),
		useDataElementRect = [],
		children
	}: InteractiveCursorProps = $props();

	let cursor: HTMLDivElement;

	$effect(() => {
		// Initialize the
		if (!cursor) return;

		const interactiveCursor = new InteractiveCursorClass({
			cursor,
			triggerAreas: document.querySelectorAll('[data-interactive-cursor-trigger]'),
			duration,
			activeSizeMultiplicator,
			defaultSize,
			useDataElementRect
		} as InteractiveCursorClassProps);

		// Initialize the cursor
		interactiveCursor.init();
		// Remove event listeners on destroy
		return () => interactiveCursor.destroy();
	});
</script>

<div
	bind:this={cursor}
	style="--size:{defaultSize}px;"
	class="lw-interactive-cursor {classes}"
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
