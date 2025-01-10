<script lang="ts">
	import { onDestroy } from 'svelte';

	let { images } = $props();
	const sliderList = [images[images.length - 1], ...images, images[0]];

	// Global variables
	let changeDirection = $state(false);
	let timeout: ReturnType<typeof setTimeout>;
	let currentSlideIndex = $state(1);
	let stopAnimation = $state(false);

	function changeSlide(slideDirection: number) {
		if (changeDirection) return;
		changeDirection = true;
		slideDirection === 1 ? currentSlideIndex++ : currentSlideIndex--;
	}

	function updateSlides() {
		clearTimeout(timeout);
		if (currentSlideIndex === sliderList.length - 1 || currentSlideIndex === 0) {
			stopAnimation = true;
		}

		if (currentSlideIndex === sliderList.length - 1) currentSlideIndex = 1;
		if (currentSlideIndex === 0) currentSlideIndex = sliderList.length - 2;

		timeout = setTimeout(() => {
			stopAnimation = false;
			changeDirection = false;
		});
	}

	onDestroy(() => timeout && clearTimeout(timeout));
</script>

<div class="container px-0 relative flex overflow-clip aspect-video">
	<button
		type="button"
		aria-label="previeous slide"
		class="absolute top-0 left-0 w-1/2 h-full cursor-none z-10"
		data-interactive-cursor="prevslide"
		onclick={() => changeSlide(-1)}
	>
	</button>

	<div
		class="h-full flex justify-start"
		style="--slide:{currentSlideIndex * 100}%;"
		ontransitionend={updateSlides}
	>
		{#each sliderList as { title, description, image }, idx}
			<img
				src={image}
				alt={title}
				class={[
					'size-full object-cover translate-x-[calc(-1_*_var(--slide))] transform-gpu shrink-0 motion-safe:transition-transform motion-safe:duration-300',
					stopAnimation && 'motion-safe:transition-none motion-safe:duration-0'
				]}
			/>
		{/each}
	</div>

	<button
		type="button"
		aria-label="next slide"
		class="absolute top-0 right-0 w-1/2 h-full cursor-none z-10"
		data-interactive-cursor="nextslide"
		onclick={() => changeSlide(1)}
	>
	</button>
</div>

<div class="container">
	<ul class=" flex justify-center gap-4 mt-8">
		{#each images as _, idx}
			<li
				class={['h-4 w-12', idx + 1 === currentSlideIndex ? 'bg-indigo-600' : 'bg-gray-800']}
			></li>
		{/each}
	</ul>
</div>
