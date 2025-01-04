<script lang="ts">
	import type { Snippet } from 'svelte';
	import { InteractiveCursorClass, type CursorStateChange } from './InteractiveCursorClass.svelte';

	let cursor: HTMLDivElement;
	let activeDataElement = $state<HTMLElement | null>(null);
	let activeDataName = $state('');

	const props = $props<{
		defaultSize?: number;
		activeSizeMultiplicator?: number;
		duration?: number;
		useDataElementRect?: string[];
		class?: string;
		children?: Snippet;
	}>();

	$effect(() => {
		const cursorInstance = new InteractiveCursorClass({
			cursor,
			...props
		});

		cursorInstance.init();
		return () => cursorInstance.destroy();
	});
</script>

<div
	bind:this={cursor}
	style="--size:{props.defaultSize ?? 20}px;"
	class="lw-interactive-cursor {props.class}"
	aria-hidden="true"
>
	{@render props.children?.()}
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
