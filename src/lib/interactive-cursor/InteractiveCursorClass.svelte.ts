export interface InteractiveCursorClassProps {
	defaultSize?: number;
	activeSizeMultiplicator?: number;
	duration?: number;
	useDataElementRect?: string[];
	cursor: HTMLElement | null;
	onStateChange?: (state: CursorStateChange) => void;
}

export type CursorStateChange = {
	activeDataElement: HTMLElement | null;
	activeDataName: string;
};

type CursorState = {
	pointerCoords: { x: number; y: number };
	isActive: boolean;
	isHoveringDataElementRect: boolean;
	activeDataElement: HTMLElement | null;
	activeDataName: string;
};

export class InteractiveCursorClass {
	private state = $state<CursorState>({
		pointerCoords: { x: 0, y: 0 },
		isActive: false,
		isHoveringDataElementRect: false,
		activeDataElement: null,
		activeDataName: ''
	});

	private cleanupFns: Array<() => void> = [];
	private currentAnimation?: Animation;

	constructor(private props: InteractiveCursorClassProps) {
		const {
			defaultSize = 20,
			activeSizeMultiplicator = 2,
			duration = 300,
			useDataElementRect = [],
			cursor = null
		} = props;

		this.props = {
			defaultSize,
			activeSizeMultiplicator,
			duration,
			useDataElementRect,
			cursor
		};
	}

	init() {
		if (!this.props.cursor || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		console.log('InteractiveCursorClass initialized');
		const triggerAreas = document.querySelectorAll<HTMLElement>('[data-interactive-cursor-area]');
		this.setupEventDelegation(triggerAreas);
	}

	private setupEventDelegation(areas: NodeListOf<HTMLElement>) {
		areas.forEach((area) => {
			area.addEventListener('mousemove', this.handleMouseMove, { passive: true });
			area.addEventListener('mouseleave', this.handleMouseLeave);

			this.cleanupFns.push(() => {
				area.removeEventListener('mousemove', this.handleMouseMove);
				area.removeEventListener('mouseleave', this.handleMouseLeave);
			});
		});
	}

	private handleMouseMove = (e: MouseEvent) => {
		if (!this.props.cursor) return;

		this.updatePointerPosition(e);
		this.updateElementState(e.target as HTMLElement);
		this.animateCursor();
	};

	private updatePointerPosition(e: MouseEvent) {
		if (!this.props.cursor) return;

		this.state.pointerCoords = {
			x: e.clientX - this.props.cursor.offsetWidth / 2,
			y: e.clientY - this.props.cursor.offsetHeight / 2 + window.scrollY
		};
		this.state.isActive = true;
	}

	private updateElementState(target: HTMLElement) {
		const interactiveElement = target.closest('[data-interactive-cursor]');

		if (interactiveElement) {
			this.state.activeDataName = interactiveElement.getAttribute('data-interactive-cursor') || '';
			this.state.activeDataElement = interactiveElement as HTMLElement;
			this.state.isHoveringDataElementRect =
				this.props.useDataElementRect?.includes(this.state.activeDataName) ?? false;
		} else {
			this.resetElementState();
		}
	}

	private resetElementState() {
		this.state.activeDataName = '';
		this.state.activeDataElement = null;
		this.state.isHoveringDataElementRect = false;
	}

	private animateCursor() {
		if (!this.props.cursor) return;

		// Cancel any existing animation
		this.currentAnimation?.cancel();

		const animationKeyframes = this.getAnimationKeyframes();
		const animationTiming: KeyframeAnimationOptions = {
			duration: this.state.isHoveringDataElementRect ? 50 : this.props.duration,
			fill: 'forwards',
			easing: 'ease-out'
		};

		// Start new animation
		this.currentAnimation = this.props.cursor.animate(animationKeyframes, animationTiming);
	}

	private getAnimationKeyframes(): PropertyIndexedKeyframes {
		if (this.state.isHoveringDataElementRect && this.state.activeDataElement) {
			const rect = this.state.activeDataElement.getBoundingClientRect();
			return {
				transform: `translate3D(${rect.left}px, ${rect.top}px, 0)`,
				width: `${rect.width}px`,
				height: `${rect.height}px`
			};
		}

		const scale = this.state.activeDataName ? this.props.activeSizeMultiplicator : 1;
		return {
			width: `${this.props.defaultSize}px`,
			height: `${this.props.defaultSize}px`,
			transform: `translate3D(${this.state.pointerCoords.x}px, ${this.state.pointerCoords.y}px, 0) 
                 scale3D(${scale}, ${scale}, 1)`
		};
	}

	private handleMouseLeave = () => {
		this.state.pointerCoords = { x: 0, y: 0 };
		this.state.isActive = false;
		this.resetElementState();
		this.currentAnimation?.finish();
	};

	destroy() {
		this.cleanupFns.forEach((cleanup) => cleanup());
		this.cleanupFns = [];
		this.currentAnimation?.cancel();
	}
}
