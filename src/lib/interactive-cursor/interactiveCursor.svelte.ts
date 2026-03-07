interface InteractiveCursorOptions {
	defaultSize?: number;
	scaleOnActive?: ScaleOnActiveElement[];
	duration?: number;
	easing?: string;
	useDataElementRect?: string[];
	hideNativeCursor?: boolean;
}

type ScaleOnActiveElement = {
	element: string;
	scaleMultiplicator?: number;
};

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

type InitialCursor = {
	readonly isActive: boolean;
	readonly activeDataValue: ActiveDataValue;
	init: () => void;
	destroy: () => void;
};

const interactiveCursor = (cursor: HTMLElement, options: InteractiveCursorOptions) => {
	const {
		defaultSize,
		scaleOnActive = [],
		duration,
		easing,
		useDataElementRect = [],
		hideNativeCursor = true
	} = options;

	// O(1) lookup map instead of repeated Array.find() on every frame
	const scaleMap = new Map(scaleOnActive.map((s) => [s.element, s.scaleMultiplicator ?? 3]));

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
	let rafId: number | undefined;
	let pendingTarget: HTMLElement | null = null;

	const triggerAreas = document.querySelectorAll<HTMLElement>('[data-interactive-cursor-area]');

	const animateCursor = (target: HTMLElement) => {
		const newDataElement = target.closest('[data-interactive-cursor]') as HTMLElement | null;

		if (newDataElement) {
			const newDataName = newDataElement.getAttribute('data-interactive-cursor') || '';
			// Only recalculate rect when the hovered element actually changes — avoids forced reflow on every move
			if (newDataElement !== state.activeDataElement) {
				state.activeDataElement = newDataElement;
				state.activeDataName = newDataName;
				state.dataElementRect = newDataElement.getBoundingClientRect();
				state.isHoveringDataElementRect =
					newDataName !== '' && useDataElementRect.includes(newDataName);
			}
		} else if (state.activeDataElement !== null) {
			state.activeDataElement = null;
			state.activeDataName = '';
			state.isHoveringDataElementRect = false;
		}

		const animationKeyframes = () => {
			if (state.isHoveringDataElementRect) {
				return {
					width: `${state.dataElementRect!.width}px`,
					height: `${state.dataElementRect!.height}px`,
					transform: `translate3D(${state.dataElementRect!.left}px, ${state.dataElementRect!.top}px, 0) scale3D(1,1,1)`
				};
			}

			if (scaleMap.has(state.activeDataName)) {
				const mult = scaleMap.get(state.activeDataName)!;
				return {
					width: `${defaultSize}px`,
					height: `${defaultSize}px`,
					transform: `translate3D(${state.pointerCoords.x}px, ${state.pointerCoords.y}px, 0) scale3D(${mult}, ${mult}, 1)`
				};
			}

			return {
				width: `${defaultSize}px`,
				height: `${defaultSize}px`,
				transform: `translate3D(${state.pointerCoords.x}px, ${state.pointerCoords.y}px, 0) scale3D(1,1,1)`
			};
		};

		const animationTiming: KeyframeAnimationOptions = {
			duration,
			easing,
			fill: 'forwards' as FillMode
		};

		currentAnimation = cursor.animate(animationKeyframes(), animationTiming);
	};

	// start cursor tracking — throttled to one animation call per frame via RAF
	const startCursorTracking = (event: MouseEvent) => {
		const { clientX, clientY, target } = event;
		state.pointerCoords = {
			x: clientX - cursor.offsetWidth / 2,
			y: clientY - cursor.offsetHeight / 2
		};
		state.isActive = true;
		pendingTarget = target as HTMLElement;

		if (rafId !== undefined) return;
		rafId = requestAnimationFrame(() => {
			if (pendingTarget) animateCursor(pendingTarget);
			rafId = undefined;
		});
	};

	// stop cursor tracking
	const stopCursorTracking = () => {
		state.pointerCoords = { x: 0, y: 0 };
		state.isActive = false;
		state.activeDataElement = null;
		state.activeDataName = '';
		state.isHoveringDataElementRect = false;
		if (rafId !== undefined) {
			cancelAnimationFrame(rafId);
			rafId = undefined;
		}
		currentAnimation?.cancel();
	};

	// Invalidate cached rect on resize/scroll so useDataElementRect stays accurate
	const invalidateRect = () => {
		if (state.activeDataElement) {
			state.dataElementRect = state.activeDataElement.getBoundingClientRect();
		}
	};

	// setup event listeners
	const init = () => {
		triggerAreas.forEach((triggerArea) => {
			triggerArea.addEventListener('mousemove', startCursorTracking, { passive: true });
			triggerArea.addEventListener('mouseleave', stopCursorTracking);
			if (hideNativeCursor) triggerArea.style.cursor = 'none';
		});
		window.addEventListener('resize', invalidateRect, { passive: true });
		window.addEventListener('scroll', invalidateRect, { passive: true, capture: true });
	};

	// cleanup event listeners
	const cleanup = () => {
		triggerAreas.forEach((triggerArea) => {
			triggerArea.removeEventListener('mousemove', startCursorTracking);
			triggerArea.removeEventListener('mouseleave', stopCursorTracking);
			if (hideNativeCursor) triggerArea.style.cursor = '';
		});
		window.removeEventListener('resize', invalidateRect);
		window.removeEventListener('scroll', invalidateRect, { capture: true });
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
	type InitialCursor,
	type ActiveDataValue,
	type ScaleOnActiveElement
};
