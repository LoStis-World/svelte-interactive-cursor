<script lang="ts">
	import type { Snippet } from 'svelte';
	import {
		InteractiveCursorClass,
		type InteractiveCursorClassProps
	} from './interactiveCursor.svelte.js';

	interface Props extends Partial<InteractiveCursorClassProps> {
		class?: string;
		children?: Snippet;
	}

	// Props
	let {
		class: classes,
		duration = 500,
		activeSizeMultiplicator = 3,
		defaultSize = 32,
		useDataElementRect = [],
		children
	}: Props = $props();

	let cursor: HTMLDivElement;
	let activeDataElement: HTMLElement | null = $state(null);
	let activeDataName: string = $state('');

	// $inspect({ activeDataElement, activeDataName });

	$effect(() => {
		// Initialize the
		if (!cursor) return;

		const interactiveCursor = new InteractiveCursorClass({
			cursor,
			duration,
			activeSizeMultiplicator,
			defaultSize,
			useDataElementRect
		} as InteractiveCursorClassProps);

		// Initialize the cursor
		interactiveCursor.init();
		activeDataElement = interactiveCursor.activeDataElement;
		activeDataName = interactiveCursor.activeDataName;
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
