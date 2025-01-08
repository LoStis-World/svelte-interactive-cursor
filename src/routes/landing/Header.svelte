<script lang="ts">
	import { onMount } from 'svelte';
	import Nav from './Nav.svelte';

	let timeout: ReturnType<typeof setTimeout>;
	let isCopied = $state(false);
	let toCopiedText: string | null = $state('');

	const itemsToCopy = [
		{
			text: '<span class="text-indigo-400">npm</span> <span>i @lostisworld/svelte-interactive-cursor</span>'
		},
		{
			text: '<span class="text-indigo-400">pnpm</span> <span>add @lostisworld/svelte-interactive-cursor</span>'
		}
	];

	const getClipboardText = (text: string): void => {
		if (toCopiedText || isCopied) return;
		clearTimeout(timeout);

		toCopiedText = text;
		copyToClipboard(toCopiedText);
	};

	const copyToClipboard = async (txt: string): Promise<void> => {
		if (!navigator.clipboard) {
			return Promise.reject(new Error('Clipboard API not available'));
		}

		try {
			await navigator.clipboard.writeText(txt);
			isCopied = true;
			timeout = setTimeout(() => {
				isCopied = false;
				toCopiedText = null;
			}, 1000);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	};

	onMount(() => {
		return () => {
			clearTimeout(timeout);
		};
	});
</script>

<header
	class={[
		'lg:min-h-screen px-4 py-32 flex flex-col items-center justify-center bg-gray-900 relative',
		'before:block before:w-px before:bg-gray-700 before:mx-auto before:mb-8 before:flex-1',
		'after:block after:w-px after:h-9 after:bg-gray-700 after:mx-auto after:mt-8 after:flex-1'
	]}
	data-interactive-cursor-area
>
	<Nav />

	<h1 class="text-3xl font-extrabold sm:text-5xl lg:text-8xl text-center">
		Svelte
		<strong class="font-extrabold text-orange-700 sm:block">Interactive Cursor</strong>
	</h1>

	<p class="mt-8 sm:text-xl text-pretty max-w-xl mx-auto text-center text-gray-400">
		The <strong>InteractiveCursor</strong> is a Svelte 5 component that provides a customizable, interactive
		cursor effect. It dynamically changes its position and size based on user interactions within specified
		trigger areas.
	</p>

	<div
		class="mt-16 flex flex-wrap justify-center gap-4 lg:max-w-lg max-w-md border border-gray-700 rounded-md p-4 lg:p-6"
		data-interactive-cursor="copyarea"
	>
		{#each itemsToCopy as { text }, idx (idx)}
			<div class="flex w-full rounded-md shadow-sm">
				<pre
					class="bg-gray-800 p-2 rounded-l-md text-sm flex w-full overflow-auto border-t border-l border-b border-gray-700">
					<code>{@html text}</code>
				</pre>
				<button
					type="button"
					class="h-full p-2 rounded-r-md shrink-0 {isCopied && toCopiedText === text
						? 'bg-indigo-600'
						: 'bg-gray-600 hover:bg-indigo-600'}"
					aria-label="copy to clipboard"
					onclick={() => getClipboardText(text)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="h-full"
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

	<div class="absolute bottom-24 left-1/2 -translate-x-1/2 text-gray-700">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1"
			stroke="currentColor"
			class="size-6 lg:animate-bounce"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
		</svg>
	</div>
</header>
