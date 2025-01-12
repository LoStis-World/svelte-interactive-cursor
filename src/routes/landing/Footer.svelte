<script lang="ts">
	const packages = [
		{ name: 'Tailwind Mask', href: 'https://github.com/LoStis-World/tailwind-mask' },
		{ name: 'Astro Magneto', href: 'https://github.com/LoStisWorld/astro-magneto' },
		{ name: 'Astro TextCircle', href: 'https://github.com/LoStisWorld/astro-textcircle' }
	];
</script>

<footer class="py-16 px-6 lg:px-16 2xl:ml-[40%]">
	<p class="text-gray-100 font-semibold">
		Thanks for checking out the<br />Svelte Interactive Cursor
	</p>
	<p class="text-gray-400 mt-4">
		If you find this project useful, consider <a
			href="https://github.com/LoStis-World/svelte-interactive-cursor"
			class="text-gray-300 underline underline-offset-2 hover:text-white"
			rel="noreferrer noopener"
			title="Star on GitHub">starring it on GitHub</a
		>.
	</p>
	<p class="text-gray-400">
		You might also be interested in exploring our other projects on GitHub.
	</p>
	<ul class="mt-8 flex flex-wrap gap-8">
		{#each packages as { name, href }}
			<li>
				<a
					{href}
					class="text-gray-300 underline underline-offset-2 hover:text-white"
					rel="noreferrer noopener"
					title={name}
				>
					{name}
				</a>
			</li>
		{/each}
	</ul>
</footer>
