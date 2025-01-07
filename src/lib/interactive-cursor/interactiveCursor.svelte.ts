interface InteractiveCursorOptions {
	defaultSize?: number;
	activeSizeMultiplicator?: number;
	duration?: number;
	useDataElementRect?: string[];
}

type CursorState = {
	pointerCoords: { x: number; y: number };
	isActive: boolean;
	isHoveringDataElementRect: boolean;
	activeDataElement: HTMLElement | null;
	activeDataName: string;
	dataElementRect: DOMRect | null;
};

type ActiveDataValue = {
	activeDataName: string;
	activeDataElement: HTMLElement | null;
};

type InitiaCursor = {
	readonly isActive: boolean;
	readonly activeDataValue: ActiveDataValue;
	init: () => void;
	destroy: () => void;
};

const interactiveCursor = (cursor: HTMLElement, options: InteractiveCursorOptions) => {
	// set default cursor options
	const { defaultSize, activeSizeMultiplicator, duration, useDataElementRect = [] } = options;

	// set initial state
	const state = $state<CursorState>({
		pointerCoords: { x: 0, y: 0 },
		isActive: false,
		isHoveringDataElementRect: false,
		activeDataElement: null,
		activeDataName: '',
		dataElementRect: null
	});

	let currentAnimation: Animation | undefined;
	const triggerAreas = document.querySelectorAll<HTMLElement>('[data-interactive-cursor-area]');

	const animateCursor = (target: HTMLElement) => {
		if (target.closest('[data-interactive-cursor]')) {
			state.activeDataElement = target.closest('[data-interactive-cursor]') as HTMLElement;
			state.activeDataName = state.activeDataElement.getAttribute('data-interactive-cursor') || '';
			state.isHoveringDataElementRect =
				state.activeDataName !== '' && useDataElementRect.includes(state.activeDataName);
			state.dataElementRect = state.activeDataElement.getBoundingClientRect();
		} else {
			state.activeDataElement = null;
			state.activeDataName = '';
			state.isHoveringDataElementRect = false;
		}

		// Get cursor element and set animation options
		const animationKeyframes = state.isHoveringDataElementRect
			? {
					width: `${state.dataElementRect!.width}px`,
					height: `${state.dataElementRect!.height}px`,
					transform: `translate3D(${state.dataElementRect!.left}px, ${state.dataElementRect!.top}px, 0) scale3D(1,1,1)`
				}
			: {
					width: `${defaultSize}px`,
					height: `${defaultSize}px`,
					transform: `translate3D(${state.pointerCoords.x}px, ${state.pointerCoords.y}px, 0) scale3D(${state.activeDataName !== '' ? activeSizeMultiplicator : 1}, ${state.activeDataName !== '' ? activeSizeMultiplicator : 1}, 1)`
				};
		const animationTiming: KeyframeAnimationOptions = {
			duration: duration,
			fill: 'forwards' as FillMode
		};

		// animate cursor
		currentAnimation = cursor.animate(animationKeyframes, animationTiming);
	};

	// start cursor tracking
	const startCursorTracking = (event: MouseEvent) => {
		const { clientX, clientY, target } = event;
		state.pointerCoords = {
			x: clientX - cursor.offsetWidth / 2,
			y: clientY - cursor.offsetHeight / 2
		};
		state.isActive = true;

		// Get the active data element
		animateCursor(target as HTMLElement);
	};

	// stop cursor tracking
	const stopCursorTracking = () => {
		state.pointerCoords = { x: 0, y: 0 };
		state.isActive = false;
		state.activeDataElement = null;
		state.activeDataName = '';
		state.isHoveringDataElementRect = false;
		currentAnimation?.cancel();
	};

	// setup event listeners
	const init = () => {
		triggerAreas.forEach((triggerArea) => {
			triggerArea.addEventListener('mousemove', startCursorTracking, { passive: true });
			triggerArea.addEventListener('mouseleave', stopCursorTracking);
		});
	};

	// cleanup event listeners
	const cleanup = () => {
		triggerAreas.forEach((triggerArea) => {
			triggerArea.removeEventListener('mousemove', startCursorTracking);
			triggerArea.removeEventListener('mouseleave', stopCursorTracking);
		});
	};

	return {
		get isActive() {
			return state.isActive;
		},
		get activeDataValue() {
			return {
				activeDataName: state.activeDataName,
				activeDataElement: state.activeDataElement
			};
		},
		init,
		destroy() {
			cleanup();
		}
	};
};

export {
	interactiveCursor,
	type InteractiveCursorOptions,
	type InitiaCursor,
	type ActiveDataValue
};
