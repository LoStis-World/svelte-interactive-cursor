<script lang="ts">
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
	class={['flex flex-col justify-center items-center', sectionDefaultOptions]}
	data-interactive-cursor="cardarea"
>
	<header class="container mb-16">
		<h2 class="text-4xl text-center text-white font-bold leading-relaxed">
			Creating a new way to interact with your elements!<br /> With Svelte Interactive Cursor
		</h2>
		<p class="text-center mt-4">
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

<section class="bg-gray-900 py-32">
	<h2 class="text-4xl text-center text-white font-bold leading-relaxed mb-16">
		Creating a new way to interact with your elements!<br /> With Svelte Interactive Cursor
	</h2>
	<Slider images={cards} />
</section>

<section class={['flex justify-center items-center container', sectionDefaultOptions]}>
	<h2
		data-interactive-cursor="mixblend"
		class="text-3xl text-center text-white font-extrabold lg:text-6xl leading-loose"
	>
		Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequuntur quos eligendi corrupti
		nulla doloribus omnis nemo quasi officia, laborum accusantium pariatur harum ex suscipit.
		Molestiae, vero tempora. Debitis, numquam ipsum.
	</h2>
</section>
