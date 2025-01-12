<script lang="ts">
	import Codeblock from './Codeblock.svelte';
	import { slide } from 'svelte/transition';

	interface Props {
		code: string;
	}

	let { code }: Props = $props();
	let showCode = $state(false);
</script>

<div class="flex flex-col items-center 2xl:items-start">
	<button
		type="button"
		class={[
			'inline-flex items-center px-6 py-1.5 gap-1 border border-indigo-600 rounded-md mb-8 text-sm font-semibold shadow-lg shadow-indigo-600/25 [&>svg]:-ml-2',
			showCode ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-600 hover:text-white'
		]}
		onclick={() => (showCode = !showCode)}
		data-interactive-cursor="hidden"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-5 {showCode ? 'hidden' : 'block'}"
			aria-hidden="true"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
		</svg>

		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-5 {!showCode ? 'hidden' : 'block'}"
			aria-hidden="true"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
		</svg>

		<span>Source Code</span>
	</button>

	{#if showCode}
		<div transition:slide class="mb-16">
			<Codeblock {code} />
		</div>
	{/if}
</div>
