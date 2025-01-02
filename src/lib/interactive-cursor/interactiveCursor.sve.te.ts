import type { InteractiveCursorProps, PointerCoords } from './index.js';

export class InteractiveCursor {
	private cursor = $state<HTMLElement | null>(null);
	private pointerCoords = $state<PointerCoords>({ x: 0, y: 0 });
	private isActive = $state(false);
	private isHoveringDataElementRect = $state(false);
	private activeDataElement = $state<HTMLElement | null>(null);
	private activeDataName = $state('');
	private triggerAreaElements = $state<HTMLElement[]>([]);

	constructor(private props: InteractiveCursorProps = {}) {
		const {
			defaultSize = 32,
			activeSizeMultiplicator = 3,
			duration = 500,
			triggerAreas = [],
			useDataElementRect = []
		} = props;

		this.defaultSize = defaultSize;
		this.activeSizeMultiplicator = activeSizeMultiplicator;
		this.duration = duration;
		this.triggerAreas = triggerAreas;
		this.useDataElementRect = useDataElementRect;
	}

	setCursor(element: HTMLElement) {
		this.cursor = element;
	}

	private handleMouseMove = (e: MouseEvent) => {
		if (!this.cursor) return;

		const target = e.target as HTMLElement;
		this.pointerCoords = {
			x: e.clientX - this.cursor.offsetWidth / 2,
			y: e.clientY - this.cursor.offsetHeight / 2 + window.scrollY
		};

		this.isActive = true;
		this.updateActiveElement(target);
		this.animateCursor();
	};

	private updateActiveElement(target: HTMLElement) {
		const interactiveElement = target.closest('[data-interactive-cursor]');
		if (interactiveElement) {
			this.activeDataName = interactiveElement.getAttribute('data-interactive-cursor') || '';
			this.activeDataElement = interactiveElement as HTMLElement;
			this.isHoveringDataElementRect = this.useDataElementRect?.includes(this.activeDataName);
		} else {
			this.resetActiveElement();
		}
	}

	private resetActiveElement() {
		this.activeDataName = '';
		this.activeDataElement = null;
		this.isHoveringDataElementRect = false;
	}

	private animateCursor() {
		if (!this.cursor) return;

		const animationKeyframes = this.isHoveringDataElementRect
			? this.getElementRectKeyframes()
			: this.getDefaultKeyframes();

		const animationTiming: KeyframeAnimationOptions = {
			duration: this.isHoveringDataElementRect ? 50 : this.duration,
			fill: 'forwards'
		};

		this.cursor.animate(animationKeyframes, animationTiming);
	}

	private getElementRectKeyframes() {
		const rect = this.activeDataElement?.getBoundingClientRect();
		return {
			transform: `translate3D(${rect?.left}px, ${rect?.top}px, 0) scale3D(1,1,1)`,
			width: `${rect?.width}px`,
			height: `${rect?.height}px`
		};
	}

	private getDefaultKeyframes() {
		return {
			width: `${this.defaultSize}px`,
			height: `${this.defaultSize}px`,
			transform: `translate3D(${this.pointerCoords.x}px, ${this.pointerCoords.y}px, 0) 
                 scale3D(${this.activeDataName ? this.activeSizeMultiplicator : 1},
                        ${this.activeDataName ? this.activeSizeMultiplicator : 1}, 1)`
		};
	}

	initialize() {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		this.triggerAreaElements = (
			this.triggerAreas.map((area) =>
				typeof area === 'string' ? document.querySelector(area) : area
			) || []
		).filter((el): el is HTMLElement => el !== null);

		this.addEventListeners();
	}

	private addEventListeners() {
		this.triggerAreaElements.forEach((element) => {
			element?.addEventListener('mousemove', this.handleMouseMove);
			element?.addEventListener('mouseleave', this.reset);
		});
	}

	reset = () => {
		this.pointerCoords = { x: 0, y: 0 };
		this.isActive = false;
		this.isHoveringDataElementRect = false;
	};

	destroy() {
		this.triggerAreaElements.forEach((element) => {
			element?.removeEventListener('mousemove', this.handleMouseMove);
			element?.removeEventListener('mouseleave', this.reset);
		});
	}
}
