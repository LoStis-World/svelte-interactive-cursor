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

const interactiveCursor = (cursor: HTMLElement, options: InteractiveCursorOptions) => {
	// check if cursor is available and if reduced motion is enabled
	if (!cursor || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	// set default cursor options
	const {
		defaultSize = 20,
		activeSizeMultiplicator = 2,
		duration = 300,
		useDataElementRect = []
	} = options;

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
		if (target.closest('[data-interactive-cursor-data]')) {
			state.activeDataElement = target.closest('[data-interactive-cursor-data]') as HTMLElement;
			state.activeDataName =
				state.activeDataElement.getAttribute('data-interactive-cursor-data') || '';
			state.isHoveringDataElementRect =
				state.activeDataName !== '' && useDataElementRect.includes(state.activeDataName);
			state.dataElementRect = state.activeDataElement.getBoundingClientRect();
		} else {
			state.activeDataElement = null;
			state.activeDataName = '';
		}

		// Get cursor element and set animation options
		const animationKeyframes = state.isHoveringDataElementRect
			? {
					transform: `translate3D(${state.dataElementRect!.left}px, ${state.dataElementRect!.top}px, 0) scale3D(1,1,1)`,
					width: `${state.dataElementRect!.width}px`,
					height: `${state.dataElementRect!.height}px`
				}
			: {
					width: `${defaultSize}px`,
					height: `${defaultSize}px`,
					transform: `translate3D(${state.pointerCoords.x}px, ${state.pointerCoords.y}px, 0) scale3D(${state.activeDataName !== '' ? activeSizeMultiplicator : 1}, ${state.activeDataName !== '' ? activeSizeMultiplicator : 1}, 1)`
				};

		const animationTiming: KeyframeAnimationOptions = {
			duration: state.isHoveringDataElementRect ? 50 : duration,
			fill: 'forwards' as FillMode
		};

		// animate cursor
		currentAnimation?.cancel();
		currentAnimation = cursor.animate(animationKeyframes, animationTiming);
	};

	// start cursor tracking
	const startCursorTracking = (event: MouseEvent) => {
		const { clientX, clientY, target } = event;
		state.pointerCoords = {
			x: clientX - cursor.offsetWidth / 2,
			y: clientY - cursor.offsetHeight / 2 + window.scrollY
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
		get activeDataElement() {
			return state.activeDataElement;
		},
		get activeDataName() {
			return state.activeDataName;
		},
		init,
		destroy() {
			cleanup();
		}
	};
};

export { interactiveCursor, type InteractiveCursorOptions };
