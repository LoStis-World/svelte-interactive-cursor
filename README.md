# InteractiveCursor Component

The `InteractiveCursor` is a Svelte 5 component that provides a customizable, interactive cursor effect. It dynamically changes its position and size based on user interactions within specified trigger areas. This component is ideal for enhancing user experiences with visually engaging cursor animations.

### [Live Demo](https://svelte.dev/playground/b48cf7b118204c8ea21e8b0c15e324cd?version=5.16.2)

[CHANGELOG](./CHANGELOG.md)

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

## Usage

### Basic Setup

Import the `InteractiveCursor` component and include it in your Svelte application:

```svelte
<script lang="ts">
	import InteractiveCursor from '@lostisworld/svelte-interactive-cursor';
</script>

<InteractiveCursor useDataElementRect={['tablist']} />
```

### Advanced Example

Here is an example with custom cursor behavior and styles:

```svelte
<script lang="ts">
	import InteractiveCursor from '@lostisworld/svelte-interactive-cursor';

	let currentCursorState = $state({ activeDataName: '', activeDataElement: null });

	const customCursorProps = [
		{ data: 'image', icon: '<svg>...</svg>' },
		{ data: 'video', icon: '<svg>...</svg>', cursorClass: 'bg-red-500 text-white' },
		{ data: 'link', icon: '<svg>...</svg>', cursorClass: 'bg-sky-500 text-white' },
		{ data: 'tablist', cursorClass: 'rounded-none outline outline-2 outline-purple-500' }
	];
</script>

<div>
	<!-- Interactive Cursor Target Areas -->
	<section data-interactive-cursor-area>
		<div data-interactive-cursor="image">Image</div>
		<div data-interactive-cursor="video">Video</div>
		<div data-interactive-cursor="link">Link</div>
		<ul data-interactive-cursor="tablist">
			<li>Tab 1</li>
			<li>Tab 2</li>
		</ul>
	</section>

	<!-- Interactive Cursor Component -->
	<InteractiveCursor
		bind:activeDataValue={currentCursorState}
		useDataElementRect={['tablist']}
		class="rounded-full flex items-center justify-center {currentCursorState.activeDataName === ''
			? 'bg-white text-black'
			: customCursorProps.find((state) => state.data === currentCursorState.activeDataName)
					?.cursorClass || 'bg-white text-black'}"
	>
		{#each customCursorProps as { icon, data }}
			{#if data === currentCursorState.activeDataName && icon}
				{@html icon}
			{/if}
		{/each}
	</InteractiveCursor>
</div>
```

---

## Component Props

### `InteractiveCursor` Props

| Prop                      | Type                                                                 | Default                                           | Description                                                                                 |
| ------------------------- | -------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `class`                   | `string`                                                             | `''`                                              | Additional CSS classes for the cursor.                                                      |
| `defaultSize`             | `number`                                                             | `32`                                              | Default size of the cursor in pixels.                                                       |
| `activeSizeMultiplicator` | `number`                                                             | `3`                                               | Scale multiplier when the cursor is active.                                                 |
| `duration`                | `number`                                                             | `500`                                             | Animation duration in milliseconds.                                                         |
| `useDataElementRect`      | `string[]`                                                           | `[]`                                              | List of `data-interactive-cursor` attribute values that should trigger the cursor resizing. |
| `activeDataValue`         | `{ activeDataName: string, activeDataElement: HTMLElement or null }` | `{ activeDataName: '', activeDataElement: null }` | Tracks the currently active cursor data and element.                                        |

---

## Data Attributes

### Cursor Areas

- Add `data-interactive-cursor-area` to define areas where the cursor can interact.
- Add `data-interactive-cursor="value"` to target specific elements and associate them with custom cursor behaviors.

Example:

```html
<div data-interactive-cursor-area>
	<div data-interactive-cursor="image">Image Element</div>
	<div data-interactive-cursor="video">Video Element</div>
</div>
```

---

## Styling

The `InteractiveCursor` component includes default styles that can be customized using the `class` prop or overriding CSS variables.

### Default Classes

- `.lw-interactive-cursor`: Base cursor styles.
- `.lw-interactive-cursor.active`: Active state styles.

### Example Custom Styles

```css
.lw-interactive-cursor {
	background-color: white;
	color: black;
}
.lw-interactive-cursor.active {
	background-color: blue;
	color: white;
}
```

---

## API for `interactiveCursor` (Module)

If you need more control over the cursor logic, use the `interactiveCursor` module directly.

### Function Signature

```ts
interactiveCursor(
	cursor: HTMLElement,
	options: InteractiveCursorOptions
): InitiaCursor
```

### `InteractiveCursorOptions`

| Option                    | Type       | Default | Description                                                                                    |
| ------------------------- | ---------- | ------- | ---------------------------------------------------------------------------------------------- |
| `defaultSize`             | `number`   | `32`    | Default cursor size in pixels.                                                                 |
| `activeSizeMultiplicator` | `number`   | `3`     | Scale multiplier for active state.                                                             |
| `duration`                | `number`   | `500`   | Animation duration in milliseconds.                                                            |
| `useDataElementRect`      | `string[]` | `[]`    | Specifies elements (by `data-interactive-cursor`) that should adjust cursor size and position. |

---

## Events and Methods

### Properties

- `isActive`: Boolean indicating whether the cursor is currently active.
- `activeDataValue`: Tracks the current `data-interactive-cursor` name and element.

### Methods

- `init()`: Initializes event listeners and cursor tracking.
- `destroy()`: Cleans up event listeners and animations.

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

This project is licensed under the [MIT License](https://github.com/LoStis-World/svelte-interactive-cursor/blob/main/LICENCE).
