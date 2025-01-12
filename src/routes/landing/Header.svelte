<script lang="ts">
	import { onMount } from 'svelte';
	import { copyToClipboard } from '../../helpers.js';

	let timeout: ReturnType<typeof setTimeout>;
	let isCopied = $state(false);
	let toCopiedText: string | null = $state('');

	const itemsToCopy = [
		{
			text: '<span class="text-amber-600">npm</span> <span>i @lostisworld/svelte-interactive-cursor</span>'
		},
		{
			text: '<span class="text-amber-600">pnpm</span> <span>add @lostisworld/svelte-interactive-cursor</span>'
		}
	];

	const getClipboardText = (text: string): void => {
		if (toCopiedText || isCopied) return;
		clearTimeout(timeout);

		toCopiedText = text;
		const finalText = toCopiedText.includes('>npm<')
			? 'npm i @lostisworld/svelte-interactive-cursor'
			: 'pnpm add @lostisworld/svelte-interactive-cursor';
		copyToClipboard(finalText, () => {
			isCopied = true;
			timeout = setTimeout(() => {
				isCopied = false;
				toCopiedText = '';
			}, 1000);
		});
	};

	onMount(() => {
		return () => {
			clearTimeout(timeout);
		};
	});
</script>

<aside
	class={[
		'2xl:fixed 2xl:top-0 2xl:left-0 2xl:bottom-0 2xl:w-2/5 bg-indigo-600',
		'flex justify-center 2xl:justify-end text-indigo-100 max-w-full'
	]}
>
	<div
		class="h-full 2xl:overflow-y-auto lg:pt-64 min-h-screen pb-32 lg:pb-16 flex flex-col justify-center 2xl:items-end items-center px-6 2xl:pr-16"
	>
		<h1 class="font-extrabold text-5xl lg:text-8xl text-center 2xl:text-right text-white mb-16">
			<span class="drop-shadow-lg">Svelte</span>
			<strong class="block drop-shadow-lg text-indigo-950">Interactive</strong>
			<span class="drop-shadow-lg text-indigo-950">Cursor</span>
		</h1>

		<p class="sm:text-xl text-pretty max-w-xl mx-auto text-center 2xl:text-right">
			This package enhances user experience by providing a customizable and interactive cursor. It
			is perfect for adding unique cursor effects to your Svelte applications, making them more
			engaging and visually appealing.
		</p>

		<div class="flex flex-col items-center justify-center gap-4 mt-8 overflow-clip max-w-full">
			{#each itemsToCopy as { text }, idx (idx)}
				<div class="flex rounded-md shadow-sm w-full max-w-full overflow-auto">
					<pre class="flex bg-gray-900 p-2 rounded-l-md text-xs flex-1 w-full">
						<code>{@html text}</code>
					</pre>
					<button
						type="button"
						class="h-full p-2 rounded-r-md shrink-0 {isCopied && toCopiedText === text
							? 'bg-amber-600'
							: 'bg-gray-600 hover:bg-amber-600'}"
						aria-label="copy to clipboard"
						onclick={() => getClipboardText(text)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							class="size-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m4.5 12.75 6 6 9-13.5"
								class={isCopied && toCopiedText === text ? 'block' : 'hidden'}
							/>

							<path
								class={!isCopied || toCopiedText !== text ? 'block' : 'hidden'}
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
							/>
						</svg>
					</button>
				</div>
			{/each}
		</div>
	</div>
</aside>
