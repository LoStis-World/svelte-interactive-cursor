<script lang="ts">
	import ShowCode from './ShowCode.svelte';
	import Slider from './Slider.svelte';

	import img1 from '/images/slider/image-1.webp';
	import img2 from '/images/slider/image-2.webp';
	import img3 from '/images/slider/image-3.webp';

	const sectionDefaultOptions = 'py-32 lg:min-h-screen';

	const cards = [
		{
			title: 'Slide 1',
			description: 'Slide 1 description',
			image: img1
		},
		{
			title: 'Slide 2',
			description: 'Slide 2 description',
			image: img2
		},
		{
			title: 'Slide 3',
			description: 'Slide 3 description',
			image: img3
		}
	];
</script>

<section
	class={[
		'flex flex-col justify-center items-center 2xl:items-start px-6 lg:px-16',
		sectionDefaultOptions
	]}
	data-interactive-cursor="cardarea"
>
	<header class="mb-16">
		<ShowCode
			code={`
				<script>
					import InteractiveCursor from '@lostisworld/svelte-interactive-cursor';

					let activeDataValue = $state({ activeDataName: '', activeDataElement: null });

					const cards = [
						{
							title: 'Slide 1',
							description: 'Slide 1 description',
							image: '/images/slider/image-1.webp'
						},
						{
							title: 'Slide 2',
							description: 'Slide 2 description',
							image: '/images/slider/image-2.webp'
						},
						{
							title: 'Slide 3',
							description: 'Slide 3 description',
							image: '/images/slider/image-3.webp'
						}
					];

					const scaleOnActive = [ 
						{ element: 'prevslide', scaleMultiplicator: 5 }, 
						{ element: 'nextslide', scaleMultiplicator: 5 } 
					];

					const customCursorProps = [
						{
							data: 'cardarea',
							cursorClass: 'size-6 outline outline-2 outline-gray-300'
						},
						{
							data: 'image',
							content: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>'
						},
						{
							data: 'video',
							content: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>',
							cursorClass: 'bg-indigo-500 text-white'
						},
						{
							data: 'link',
							content: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" /></svg>',
							cursorClass: 'bg-sky-500 text-white'
						},
					]
				</script>

				<section data-interactive-cursor-area>
					<div class="container grid gap-6 lg:gap-16 lg:grid-cols-3" data-interactive-cursor="cardarea">
						{#each cards as { title, description, image }, idx}
							<figure
								class="flex items-center justify-center rounded-lg overflow-clip aspect-[8/10] motion-safe:transition-all transform-gpu motion-safe:duration-300 hover:scale-105"
								data-interactive-cursor={idx === 0 ? 'video' : idx === 1 ? 'image' : 'link'}
							>
								<img src={image} alt="" class="size-full object-cover object-center" />
							</figure>
						{/each}
					</div>
				</section>

				<InteractiveCursor
					bind:activeDataValue
					{scaleOnActive}
					class={[
						'rounded-full flex items-center justify-center', 
						activeDataValue.activeDataName === '' 
							? 'bg-white text-black' 
							: customCursorProps.find((state) => state.data === activeDataValue.activeDataName)?.cursorClass || 'bg-white text-black'
					]}
				>
					{#each customCursorProps as { content, data }}
						{#if data === activeDataValue.activeDataName && content !== undefined}
							{@html content}
						{/if}
					{/each}
				</InteractiveCursor>
			`}
		/>
		<h2 class="text-4xl text-center 2xl:text-left text-white font-bold leading-relaxed">
			Creating a new way to interact with your elements!<br /> With Svelte Interactive Cursor
		</h2>
		<p class="text-center 2xl:text-left mt-4">
			Enhance your experience with interactive cursor styles based on the hovered element.
		</p>
	</header>
	<div class="container grid gap-6 lg:gap-16 lg:grid-cols-3">
		{#each cards as { title, description, image }, idx}
			<figure
				class="flex items-center justify-center rounded-lg overflow-clip aspect-[8/10] motion-safe:transition-all transform-gpu motion-safe:duration-300 hover:scale-105"
				data-interactive-cursor={idx === 0 ? 'video' : idx === 1 ? 'image' : 'link'}
			>
				<img src={image} alt="" class="size-full object-cover object-center" />
			</figure>
		{/each}
	</div>
</section>

<section
	class={[
		'flex justify-center flex-col items-center 2xl:items-start bg-gray-200 px-6 lg:px-16',
		sectionDefaultOptions
	]}
>
	<header>
		<ShowCode
			code={`
				<script>
					import InteractiveCursor from '@lostisworld/svelte-interactive-cursor';

					let activeDataValue = $state({ activeDataName: '', activeDataElement: null });
				</script>

				<section data-interactive-cursor-area>
					<ul>
						<li><button data-interactive-cursor="navitem">Navitem</button></li>
						<li><button data-interactive-cursor="navitem">Navitem</button></li>
						<li><button data-interactive-cursor="navitem">Navitem</button></li>
						<li><button data-interactive-cursor="navitem">Navitem</button></li>
					</ul>
				</section>

				<InteractiveCursor
					bind:activeDataValue
					useDataElementRect={['navitem']}
					class={
						activeDataValue.activeDataName === 'navitem' 
							? 'rounded-none outline outline-1 outline-indigo-600' 
							: 'rounded-full bg-white'
					}
				/>
			`}
		/>
		<h2
			class="text-center 2xl:text-left text-indigo-600 text-4xl font-bold leading-relaxed text-balance mb-16"
		>
			Hover over the navigation and add items to the <strong>useDataElementRect</strong> to dynamically
			obtain the element's dimensions.
		</h2>
	</header>
	<ul
		class="flex justify-center shadow-lg shadow-gray-400 rounded-md text-gray-700 p-6 border-t border-white"
	>
		<li>
			<button class="px-6 py-2 hover:text-indigo-600 uppercase" data-interactive-cursor="navitem"
				>Home</button
			>
		</li>
		<li>
			<button class="px-6 py-2 hover:text-indigo-600 uppercase" data-interactive-cursor="navitem"
				>Products</button
			>
		</li>
		<li>
			<button class="px-6 py-2 hover:text-indigo-600 uppercase" data-interactive-cursor="navitem"
				>About</button
			>
		</li>
		<li>
			<button class="px-6 py-2 hover:text-indigo-600 uppercase" data-interactive-cursor="navitem"
				>Community</button
			>
		</li>
		<li>
			<button class="px-6 py-2 hover:text-indigo-600 uppercase" data-interactive-cursor="navitem"
				>Shop</button
			>
		</li>
	</ul>
</section>

<section
	class={[
		'flex justify-center flex-col items-center 2xl:items-start px-6 lg:px-16',
		sectionDefaultOptions
	]}
>
	<ShowCode
		code={`
			<script>
				import InteractiveCursor from '@lostisworld/svelte-interactive-cursor';

				let activeDataValue = $state({ activeDataName: '', activeDataElement: null });
			</script>

			<section class="bg-gray-950 text-white" data-interactive-cursor-area>
				<h2 data-interactive-cursor="mixblend">
					Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequuntur quos eligendi corrupti
					nulla doloribus omnis nemo quasi officia, laborum accusantium pariatur harum ex suscipit.
					Molestiae, vero tempora. Debitis, numquam ipsum.
				</h2>
			</section>

			<InteractiveCursor
				bind:activeDataValue
				scaleOnActive={[ { element: 'mixblend', scaleMultiplicator: 8 } ]}
				class={[
					'rounded-full bg-white', 
					activeDataValue.activeDataName === 'mixblend' && 'mix-blend-difference'
				]}
			/>
		`}
	/>
	<h2
		data-interactive-cursor="mixblend"
		class="text-3xl text-center 2xl:text-left text-white font-extrabold lg:text-6xl lg:leading-tight text-pretty"
	>
		This package enhances user experience by providing a customizable and interactive cursor.<br
		/>It is perfect for adding unique cursor effects to your Svelte applications, making them more
		engaging and visually appealing. Built with Svelte and TypeScript, it leverages modern web
		technologies to ensure smooth performance and easy integration.
	</h2>
</section>

<section class="bg-gray-900 py-32 px-6 2xl:items-start lg:px-16">
	<ShowCode
		code={`
			<script>
				import InteractiveCursor from '@lostisworld/svelte-interactive-cursor';

				let activeDataValue = $state({ activeDataName: '', activeDataElement: null });

				const scaleOnActive = [ 
					{ element: 'prevslide', scaleMultiplicator: 5 }, 
					{ element: 'nextslide', scaleMultiplicator: 5 } 
				];

				const customCursorProps = [
					{
						data: 'prevslide',
						cursorClass: 'bg-white/25 backdrop-blur-sm text-gray-950 text-[6px]',
						content: '<span>prev</span>'
					},
					{
						data: 'nextslide',
						cursorClass: 'bg-white/25 backdrop-blur-sm text-gray-950 text-[6px]',
						content: '<span>next</span>'
					},
				]
			</script>

			<section data-interactive-cursor-area>
				<div class="container relative">
					<button
						type="button"
						aria-label="previeous slide"
						class="absolute top-0 left-0 w-1/2 h-full cursor-none z-10"
						data-interactive-cursor="prevslide">
					</button>

					<Slider images={cards} />

					<button
						type="button"
						aria-label="next slide"
						class="absolute top-0 right-0 w-1/2 h-full cursor-none z-10"
						data-interactive-cursor="nextslide">
					</button>
				</div>
			</section>

			<InteractiveCursor
				bind:activeDataValue
				{scaleOnActive}
				class={[
					'rounded-full flex items-center justify-center', 
					activeDataValue.activeDataName === '' 
						? 'bg-white text-black' 
						: customCursorProps.find((state) => state.data === activeDataValue.activeDataName)?.cursorClass || 'bg-white text-black'
				]}
			>
				{#each customCursorProps as { content, data }}
					{#if data === activeDataValue.activeDataName && content !== undefined}
						{@html content}
					{/if}
				{/each}
			</InteractiveCursor>
		`}
	/>
	<h2 class="text-4xl text-center 2xl:text-left text-white font-bold leading-relaxed mb-16">
		Creating a new way to interact with your elements!<br /> With Svelte Interactive Cursor
	</h2>
	<Slider images={cards} />
</section>
