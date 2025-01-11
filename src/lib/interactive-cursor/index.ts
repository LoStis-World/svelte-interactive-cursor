import InteractiveCursor from './interactive-cursor.svelte';
import {
	type ScaleOnActiveElement,
	type InteractiveCursorOptions,
	type InitialCursor,
	type ActiveDataValue,
	interactiveCursor as interactiveCursorFN
} from './interactiveCursor.svelte';

export default InteractiveCursor;
export {
	interactiveCursorFN,
	type InteractiveCursorOptions,
	type ScaleOnActiveElement,
	type InitialCursor,
	type ActiveDataValue
};
