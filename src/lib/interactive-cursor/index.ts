import InteractiveCursor from './interactive-cursor.svelte';
import { type Snippet } from 'svelte';

interface InteractiveCursorProps {
	class?: string;
	activeDataName?: string;
	duration?: number;
	defaultSize?: number;
	activeSizeMultiplicator?: number;
	triggerAreas: string[] | HTMLElement[];
	children?: Snippet;
	activeDataElement?: HTMLElement | null;
}

export default InteractiveCursor;

export { type InteractiveCursorProps };
