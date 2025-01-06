# Changelog

## Version 0.2.0 (Current Release)

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

---

## Summary of Changes Between 0.1.1 and 0.2.0

1. **Enhanced Customization**: Added icon rendering and dynamic styling based on cursor state.
2. **Data Element Rect Tracking**: Introduced `useDataElementRect` for dynamic cursor resizing and alignment with target elements.
3. **Expanded State Tracking**: Enhanced `activeDataValue` to provide more detailed information about active interactions.
4. **Improved Usability**: Simplified integration and configuration through additional props and improved internal logic.
5. **Animation and Performance**: Refined animation logic for smoother transitions and better performance.

---

### Upgrade Path

To upgrade from version 0.1.1 to 0.2.0:

1. Replace the `InteractiveCursor` component code with the updated version.
2. Add `useDataElementRect` and customize icons or styles for specific cursor interactions as needed.
3. Update bindings to the new `activeDataValue` format for detailed interaction tracking.
