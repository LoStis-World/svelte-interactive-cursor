# InteractiveCursor Component

The `InteractiveCursor` is a Svelte 5 component that provides a customizable, interactive cursor effect. It dynamically changes its position and size based on user interactions within specified trigger areas. This component is ideal for enhancing user experiences with visually engaging cursor animations.

### [Live Demo](https://www.sveltelab.dev/q87mj86bv7ka69y)

![](./static/images/interactive-cursor.gif)

---

## Installation

You can install the `InteractiveCursor` component using npm or pnpm:

### Using npm

```bash
npm install @lostisworld/svelte-interactive-cursor
```

### Using pnpm

```bash
pnpm add @lostisworld/svelte-interactive-cursor
```

---

---

## Usage

Import the component into your Svelte project:

```svelte
<script lang="ts">
	import InteractiveCursor from '@lostisworld/svelte-interactive-cursor';
</script>

<InteractiveCursor
	class="custom-cursor"
	duration={300}
	triggerAreas={['.button', '.link']}
	defaultSize={40}
	activeSizeMultiplicator={2.5}
/>
```

---

## Props

| Prop Name                 | Type         | Default        | Description                                                                                                 |
| ------------------------- | ------------ | -------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `class`                   | `string`     | `undefined`    | Additional classes to style the cursor.                                                                     |
| `activeDataName`          | `string`     | `''`           | A reactive prop holding the `data-interactive-cursor` attribute value of the currently active trigger area. |
| `duration`                | `number`     | `500`          | Animation duration in milliseconds for the cursor's transitions.                                            |
| `defaultSize`             | `number`     | `32`           | The default size of the cursor in pixels.                                                                   |
| `activeSizeMultiplicator` | `number`     | `3`            | Scale factor applied to the cursor when it becomes active.                                                  |
| `triggerAreas`            | `string[]    | HTMLElement[]` | `undefined`                                                                                                 | CSS selectors or DOM elements that define the areas where the cursor effect is active.    |
| `children`                | `Snippet`    | `undefined`    | Content to render inside the cursor (e.g., custom icons or text).                                           |
| `activeDataElement`       | `HTMLElement | null`          | `null`                                                                                                      | A reactive prop holding the DOM element associated with the current trigger area, if any. |

---

## Slot

The `InteractiveCursor` component supports a default slot to allow custom content to be rendered within the cursor.

```svelte
<InteractiveCursor triggerAreas={['.button']}>
	<span>🔥</span>
</InteractiveCursor>
```

---

## Behavior

1. **Dynamic Cursor Positioning**  
   The cursor follows the pointer and remains centered at the pointer position.

2. **Active State Animation**  
   When the pointer enters a trigger area, the cursor enlarges by the specified `activeSizeMultiplicator`. Exiting the area resets its size.

3. **Trigger Area Matching**  
   The component detects elements with a `data-interactive-cursor` attribute and updates the `activeDataName` and `activeDataElement` properties reactively.

4. **Accessible Defaults**  
   The cursor is hidden by default for screen readers, ensuring compliance with accessibility standards.

---

## Styling

Customize the cursor's appearance via the `class` prop or by overriding the default styles. Example:

```css
.lw-interactive-cursor {
	background-color: rgba(0, 0, 0, 0.7);
	border-radius: 50%;
	border: 2px solid white;
}
```

---

## Example

Here's a complete example demonstrating the component in action:

```html
<script lang="ts">
	import InteractiveCursor from '@lostisworld/svelte-interactive-cursor';

	let currentCursorState = $state('');

	const triggerAreas = ['#triggersection'];
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
		}
	];
</script>

<div class="grid grid-rows-[auto_1fr] p-8 min-h-screen">
	<section class="py-8">
		<h2 class="font-semibold text-2xl">
			Hover the green section to start tracking the mouse position, activate the cursor animation by
			hovering one of the red bordered elements!
		</h2>
	</section>

	<section
		id="triggersection"
		class="flex justify-center items-center gap-8 2xl:gap-16 p-16 border border-green-500"
	>
		<div
			class="flex-1 h-96 border border-red-500 flex flex-col text-xs text-center p-8"
			data-interactive-cursor="image"
		>
			<h2 class="m-auto font-semibold uppercase">Image</h2>
			<p><strong>data-interactive-cursor="image"</strong></p>
		</div>

		<div
			class="flex-1 h-96 border border-red-500 flex flex-col text-xs text-center p-8"
			data-interactive-cursor="video"
		>
			<h2 class="m-auto font-semibold uppercase">Video</h2>
			<p><strong>data-interactive-cursor="video"</strong></p>
		</div>

		<div
			class="flex-1 h-96 border border-red-500 flex flex-col text-xs text-center p-8"
			data-interactive-cursor="link"
		>
			<h2 class="m-auto font-semibold uppercase">Link</h2>
			<p><strong>data-interactive-cursor="link"</strong></p>
		</div>
	</section>
</div>

<InteractiveCursor
	{triggerAreas}
	bind:activeDataName="{currentCursorState}"
	class="rounded-full {currentCursorState === ''
		? 'bg-white text-black'
		: customCursorProps.find((state) => state.data === currentCursorState)?.cursorClass ||
			'bg-white text-black'}"
>
	{#each customCursorProps as { icon, data }} {#if data === currentCursorState && icon} {@html icon}
	{/if} {/each}
</InteractiveCursor>
```

---

## Accessibility

The component respects the user's reduced motion preference by disabling animations if the `prefers-reduced-motion` media query is active.

---

## Contributing

Contributions are welcome! Please ensure all changes are well-documented and tested.

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear and descriptive messages.
4. Submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).
