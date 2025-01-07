<script lang="ts">
	const navitems = [
		{
			name: 'Github',
			href: 'https://github.com/LoStis-World/svelte-interactive-cursor',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...$$props}><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`
		},
		{
			name: 'NPM',
			href: 'https://www.npmjs.com/package/@lostisworld/svelte-interactive-cursor',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...$$props}><path fill="currentColor" d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019l-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"/></svg>`
		}
	];
</script>

<nav class="fixed top-0 left-0 w-full bg-gray-950/75 backdrop-blur-sm px-4 z-50">
	<ul
		class="flex justify-center items-center before:block before:h-px before:flex-1 before:bg-gray-600"
	>
		{#each navitems as { name, href, icon }}
			<li>
				<a
					{href}
					class="px-6 py-4 inline-flex items-center gap-2 text-gray-400 hover:text-gray-100"
					rel="noreferrer noopener"
					title={name}
					data-interactive-cursor="link"
				>
					{@html icon}
					<span>{name}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
