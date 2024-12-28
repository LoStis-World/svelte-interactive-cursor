import InteractiveCursor from './interactive-cursor.svelte';

type interactiveStateItem = {
	data: 'link' | 'image' | 'video' | string;
	icon?: string | HTMLElement;
	cursorClass?: string;
};

interface InteractiveCursorProps {
	class?: string;
	setInteractiveState?: interactiveStateItem[];
	duration?: number;
	defaultSize?: number;
	activeSizeMultiplicator?: number;
	triggerAreas: string[] | HTMLElement[];
	target?: HTMLElement | string;
}

export { InteractiveCursor, type InteractiveCursorProps, type interactiveStateItem };
