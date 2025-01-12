<script lang="ts">
	import { HighlightSvelte } from 'svelte-highlight';
	import 'svelte-highlight/styles/github-dark.css';
	import { formatCode, copyToClipboard } from '../../helpers.js';
	import CopyToClipboard from './CopyToClipboard.svelte';

	interface Props {
		code: string;
		class?: string;
	}

	let { code, class: classes }: Props = $props();
	let isCopied = $state(false);
</script>

<div
	class="rounded-md border border-gray-800 overflow-clip bg-neutral-950 max-w-full lg:max-w-4xl {classes}"
	data-interactive-cursor="hidden"
>
	<div class="flex justify-between items-center px-3 py-2">
		<p class="text-xs">Copy to clipboard</p>
		<CopyToClipboard
			bind:isCopied
			{code}
			class="size-8 p-1.5 rounded shrink-0 hover:bg-indigo-600 hover:text-white {isCopied
				? 'bg-indigo-600'
				: 'bg-gray-600'}"
		/>
	</div>

	<HighlightSvelte code={formatCode(code)} class="font-mono text-sm" />
</div>
