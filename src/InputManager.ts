export class InputManager {
	private static instance: InputManager;
	public static getInstance(): InputManager {
		if (!InputManager.instance) {
			InputManager.instance = new InputManager();
		}
		return InputManager.instance;
	}

	private _isMouseDown = false;
	private keyDownMap = new Map<string, boolean>();

	private keyDownListener(event: KeyboardEvent) {
		event.preventDefault();
		event.stopPropagation();
		this.keyDownMap.set(event.key, true);
	}

	private keyUpListener(event: KeyboardEvent) {
		event.preventDefault();
		event.stopPropagation();
		this.keyDownMap.set(event.key, false);
	}

	private mouseDownListener(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		this._isMouseDown = true;
	}

	private mouseUpListener(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		this._isMouseDown = false;
	}

	private constructor() {
		document.addEventListener("keydown", this.keyDownListener.bind(this));
		document.addEventListener("keyup", this.keyUpListener.bind(this));
		document.addEventListener("mousedown", this.mouseDownListener.bind(this));
		document.addEventListener("mouseup", this.mouseUpListener.bind(this));
	}

	public isKeyDown(key: string): boolean {
		return this.keyDownMap.get(key) ?? false;
	}

	public isKeyUp(key: string): boolean {
		return this.keyDownMap.get(key) !== true;
	}

	public isMouseDown(): boolean {
		return this._isMouseDown;
	}
}
