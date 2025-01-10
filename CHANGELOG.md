# Changelog

## Version 0.3.0 (Latest Release)

#### Added

- **State Management Enhancements**:
  - Introduced `activeDataValue` to expose the currently active interactive element's name and DOM reference.
- **Custom Rendering Support**:
  - Added `children` property to allow custom rendering inside the cursor element.
- **Enhanced Responsiveness**:
  - Automatically disables the interactive cursor for small screens (width < 1024px) or when `prefers-reduced-motion` is enabled.
- **Dynamic Scaling**:
  - Cursor dynamically adjusts size and position when interacting with elements specified in `useDataElementRect`.
- **Custom Animation Control**:
  - Support for `KeyframeAnimationOptions` to define animation properties like duration and fill mode.

#### Changed

- **Reactivity Refactor**:
  - Improved reactive state handling using `$state` and `$effect` for smoother updates.
- **Cursor Initialization**:
  - Moved initialization logic to `onMount` to ensure the component properly handles dynamic DOM updates.

#### Fixed

- **Event Listeners**:
  - Ensured proper cleanup of event listeners to avoid memory leaks.
- **Bounding Rect Handling**:
  - Fixed issues with incorrect calculations for element bounding rectangles when using `useDataElementRect`.

---

## Version 0.2.0 (Latest Release)

### New Features

- **Support for `dataElementRect` Tracking**:
  - Cursor now adjusts its size and position dynamically to match target element dimensions when specified in the `useDataElementRect` prop.
  - New logic in `interactiveCursor` handles target bounding rectangle retrieval and animation.
- **Custom Icons and Styles**:
  - Added support for rendering custom icons and styles based on `data-interactive-cursor` values, allowing highly customized interaction feedback.
  - Example properties include `cursorClass` for styles and `icon` for rendering inline SVG icons.
- **Improved API**:
  - Reworked `activeDataValue` to include both `activeDataName` and `activeDataElement`, providing more detailed feedback for active states.
- **Smoother Animations**:
  - Enhanced animation behavior with cleaner transitions between states.
  - Leveraged `KeyframeAnimationOptions` for fine-grained control.
- **Prop Enhancements**:
  - New `useDataElementRect` array prop specifies elements by their `data-interactive-cursor` name to trigger custom size adjustments.
  - Updated `activeDataValue` binding to enable live tracking of active interaction states.

### Code Improvements

- **Refactored State Management**:
  - Centralized state logic using `$state` and `$effect` for reactive bindings.
  - Simplified cursor animation logic for better maintainability.
- **Improved Cleanup**:
  - Ensured proper cleanup of event listeners and animations during component destruction.
- **Accessibility Enhancements**:
  - The cursor component is now `aria-hidden` by default, ensuring it does not interfere with screen readers.

---

## Version 0.1.1 (Previous Release)

### Features

- **Basic Interactive Cursor**:
  - Initial implementation of a custom cursor component with hover tracking.
  - Basic animation on hover over `data-interactive-cursor-area` elements.
- **Configurable Props**:
  - Included props for `defaultSize`, `activeSizeMultiplicator`, and `duration` to customize cursor appearance and behavior.
- **Area Tracking**:
  - Allowed the cursor to activate when hovering over designated `data-interactive-cursor-area` elements.

### Limitations

- No support for resizing or repositioning the cursor based on target element dimensions.
- Lacked advanced customization for icons or styles associated with specific `data-interactive-cursor` values.
- Minimal state feedback for interaction.
