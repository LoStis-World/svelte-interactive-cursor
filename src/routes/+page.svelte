<script lang="ts">
	import InteractiveCursor from '$lib/interactive-cursor/index.js';
	import Header from './landing/Header.svelte';

	let currentCursorState = $state({ activeDataName: '', activeDataElement: null });

	const customCursorProps = [
		{
			data: 'image',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>`
		},
		{
			data: 'video',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>`,
			cursorClass: 'bg-red-500 text-white'
		},
		{
			data: 'link',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" /></svg>`,
			cursorClass: 'bg-sky-500 text-white'
		},
		{
			data: 'copyarea',
			cursorClass: 'rounded-md outline outline-dashed outline-1 outline-orange-700 outline-offset-8'
		}
	];
</script>

<Header />

<main data-interactive-cursor-area></main>

<footer class="border-t border-gray-800 py-16">
	<div class="container">hello</div>
</footer>

<InteractiveCursor
	bind:activeDataValue={currentCursorState}
	useDataElementRect={['copyarea']}
	defaultSize={24}
	class="rounded-full flex items-center justify-center {currentCursorState.activeDataName === ''
		? 'bg-white text-black'
		: customCursorProps.find((state) => state.data === currentCursorState.activeDataName)
				?.cursorClass || 'bg-white text-black'}"
>
	{#each customCursorProps as { icon, data }}
		{#if data === currentCursorState.activeDataName && icon}
			{@html icon}
		{/if}
	{/each}
</InteractiveCursor>
