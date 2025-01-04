export interface InteractiveCursorClassProps {
	defaultSize?: number;
	activeSizeMultiplicator?: number;
	duration?: number;
	useDataElementRect?: string[];
	cursor: HTMLElement | null;
}

type PointerCoords = {
	x: number;
	y: number;
};

export class InteractiveCursorClass {
	private pointerCoords = $state<PointerCoords>({ x: 0, y: 0 });
	private isActive = $state(false);
	private isHoveringDataElementRect = $state(false);
	activeDataElement = $state<HTMLElement | null>(null);
	activeDataName = $state('');
	defaultSize: number;
	activeSizeMultiplicator: number;
	duration: number;
	useDataElementRect: string[];
	cursor: HTMLElement | null;
	triggerAreas: NodeListOf<Element>;

	constructor(props: InteractiveCursorClassProps) {
		const {
			defaultSize = 20,
			activeSizeMultiplicator = 2,
			duration = 0.3,
			useDataElementRect = [],
			cursor = null
		} = props;

		this.defaultSize = defaultSize;
		this.activeSizeMultiplicator = activeSizeMultiplicator;
		this.duration = duration;
		this.useDataElementRect = useDataElementRect;
		this.triggerAreas = document.querySelectorAll('[data-interactive-cursor-area]');
		this.cursor = cursor;
	}

	// Call this method in the svelte component to add event listeners
	init() {
		if (!this.triggerAreas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return;
		}

		// Add event listeners
		this.triggerAreas.forEach((triggerAreaElement) => {
			triggerAreaElement.addEventListener(
				'mousemove',
				this.startCursorTracking.bind(this) as EventListener,
				{
					passive: true
				}
			);
			triggerAreaElement.addEventListener(
				'mouseleave',
				this.stopCursorTracking.bind(this) as EventListener
			);
		});
	}

	// This method is called when the mouse moves over the trigger area
	private startCursorTracking(e: MouseEvent) {
		if (!this.cursor) return;

		// Get the active data element
		const target = e.target as HTMLElement;
		this.pointerCoords = {
			x: e.clientX - this.cursor.offsetWidth / 2,
			y: e.clientY - this.cursor.offsetHeight / 2 + window.scrollY
		};

		// toggle active state
		this.isActive = true;

		// Check if the mouse is hovering over a data element
		if (target.closest('[data-interactive-cursor]')) {
			const dataElement = target.closest('[data-interactive-cursor]');
			this.activeDataName = dataElement?.getAttribute('data-interactive-cursor') || '';
			this.activeDataElement = dataElement as HTMLElement;
			this.isHoveringDataElementRect = this.useDataElementRect?.includes(this.activeDataName);
		} else {
			this.activeDataName = '';
			this.activeDataElement = null;
			this.isHoveringDataElementRect = false;
		}

		// Update cursor animation
		this.cursor.classList.toggle('active', this.isActive);

		// get active data element rect
		const dataElementRect = this.activeDataElement?.getBoundingClientRect();

		// Get cursor element and set animation options
		const animationKeyframes = this.isHoveringDataElementRect
			? {
					transform: `translate3D(${dataElementRect!.left}px, ${dataElementRect!.top}px, 0) scale3D(1,1,1)`,
					width: `${dataElementRect!.width}px`,
					height: `${dataElementRect!.height}px`
				}
			: {
					width: `${this.defaultSize}px`,
					height: `${this.defaultSize}px`,
					transform: `translate3D(${this.pointerCoords.x}px, ${this.pointerCoords.y}px, 0) scale3D(${this.activeDataName !== '' ? this.activeSizeMultiplicator : 1}, ${this.activeDataName !== '' ? this.activeSizeMultiplicator : 1}, 1)`
				};

		const animationTiming: KeyframeAnimationOptions = {
			duration: this.isHoveringDataElementRect ? 50 : this.duration,
			fill: 'forwards' as FillMode,
			easing: 'linear'
		};

		// Animate cursor
		this.cursor.animate(animationKeyframes, animationTiming);
	}

	// This method is called when the mouse leaves the trigger area
	private stopCursorTracking() {
		this.pointerCoords = { x: 0, y: 0 };
		this.isActive = false;
		this.isHoveringDataElementRect = false;
	}

	// Call this method in the svelte component to remove event listeners
	destroy() {
		this.triggerAreas.forEach((triggerAreaElement) => {
			triggerAreaElement.removeEventListener(
				'mousemove',
				this.startCursorTracking as EventListener
			);
			triggerAreaElement.removeEventListener(
				'mouseleave',
				this.stopCursorTracking as EventListener
			);
		});
	}
}
