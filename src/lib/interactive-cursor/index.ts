import InteractiveCursor from './interactive-cursor.svelte';
import { type Snippet } from 'svelte';

interface InteractiveCursorProps {
	class?: string;
	activeDataName?: string;
	duration?: number;
	defaultSize?: number;
	activeSizeMultiplicator?: number;
	children?: Snippet;
	activeDataElement?: HTMLElement | null;
	useDataElementRect?: string[];
}

export default InteractiveCursor;
export { type InteractiveCursorProps };
