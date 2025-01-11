<script lang="ts">
	import InteractiveCursor, {
		type ScaleOnActiveElement,
		type ActiveDataValue
	} from '$lib/interactive-cursor/index.js';
	import Header from './landing/Header.svelte';
	import Nav from './landing/Nav.svelte';
	import Sections from './landing/Sections.svelte';

	let currentCursorState: ActiveDataValue = $state({ activeDataName: '', activeDataElement: null });

	// Custom cursor props
	const scaleOnActive: ScaleOnActiveElement[] = [
		{ element: 'image' },
		{ element: 'video', scaleMultiplicator: 4 },
		{ element: 'link' },
		{ element: 'mixblend', scaleMultiplicator: 8 },
		{ element: 'prevslide', scaleMultiplicator: 5 },
		{ element: 'nextslide', scaleMultiplicator: 5 }
	];

	const customCursorProps: { data: string; content?: string; cursorClass?: string }[] = [
		{
			data: 'image',
			content: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>`
		},
		{
			data: 'video',
			content: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>`,
			cursorClass: 'bg-indigo-500 text-white'
		},
		{
			data: 'link',
			content: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" /></svg>`,
			cursorClass: 'bg-sky-500 text-white'
		},
		{
			data: 'copyarea',
			cursorClass: 'rounded-md outline outline-dashed outline-1 outline-orange-700 outline-offset-8'
		},
		{
			data: 'cardarea',
			cursorClass: 'size-6 outline outline-2 outline-gray-300'
		},
		{
			data: 'mixblend',
			cursorClass: 'bg-white mix-blend-difference'
		},
		{
			data: 'prevslide',
			cursorClass: 'bg-white/25 backdrop-blur-sm text-gray-950 text-[6px]',
			content: `<span>prev</span>`
		},
		{
			data: 'nextslide',
			cursorClass: 'bg-white/25 backdrop-blur-sm text-gray-950 text-[6px]',
			content: `<span>next</span>`
		},
		{
			data: 'hidden',
			cursorClass: 'bg-transparent'
		},
		{
			data: 'navitem',
			cursorClass: 'rounded-none outline outline-1 outline-indigo-600'
		}
	];
</script>

<Nav />

<Header />

<main data-interactive-cursor-area>
	<Sections />
</main>

<footer class="border-t border-gray-800 py-16">
	<div class="container">
		<p class="text-center text-gray-500">Svelte Interactive Cursor</p>
		<p class="text-center text-gray-500 mt-4">
			This package enhances user experience by providing a customizable and interactive cursor. It
			is perfect for adding unique cursor effects to your Svelte applications, making them more
			engaging and visually appealing. Built with Svelte and TypeScript, it leverages modern web
			technologies to ensure smooth performance and easy integration.
		</p>
	</div>
</footer>

<InteractiveCursor
	bind:activeDataValue={currentCursorState}
	useDataElementRect={['copyarea', 'navitem']}
	{scaleOnActive}
	defaultSize={24}
	class="rounded-full flex items-center justify-center [&>svg]:h-3 {currentCursorState.activeDataName ===
	''
		? 'bg-white text-black'
		: customCursorProps.find((state) => state.data === currentCursorState.activeDataName)
				?.cursorClass || 'bg-white text-black'}"
>
	{#each customCursorProps as { content, data }}
		{#if data === currentCursorState.activeDataName && content !== undefined}
			{@html content}
		{/if}
	{/each}
</InteractiveCursor>
