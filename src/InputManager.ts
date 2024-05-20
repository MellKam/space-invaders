export class InputManager {
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

	constructor() {
		document.addEventListener("keydown", this.keyDownListener);
		document.addEventListener("keyup", this.keyUpListener);
	}

	public dispose(): void {
		document.removeEventListener("keydown", this.keyDownListener);
		document.removeEventListener("keyup", this.keyUpListener);
	}

	public isKeyDown(key: string): boolean {
		return this.keyDownMap.get(key) ?? false;
	}

	public isKeyUp(key: string): boolean {
		return this.keyDownMap.get(key) !== true;
	}
}
