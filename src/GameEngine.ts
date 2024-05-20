import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { InputManager } from "./InputManager";
import {
	AmbientLight,
	AxesHelper,
	Clock,
	GridHelper,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
} from "three";

interface GameEntity {
	mount(): void;
	update(deltaT: number): void;
	unmount(): void;
}

interface GameEngineOptions {
	debug: boolean;
}

function createRenderer() {
	const renderer = new WebGLRenderer({
		powerPreference: "high-performance",
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	return renderer;
}

function resizeEngine() {
	
}

export class GameEngine {
	private width: number;
	private height: number;

	private renderer: WebGLRenderer;
	private clock = new Clock();
	private scene = new Scene();
	private camera: PerspectiveCamera;
	private inputManager = new InputManager();

	constructor(options: GameEngineOptions) {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.renderer = new WebGLRenderer();
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.width, this.height);
		document.body.appendChild(this.renderer.domElement);

		this.camera = new PerspectiveCamera(
			75, // make higher for more zoomed in
			this.width / this.height,
			0.1,
			1000,
		);

		this.camera.position.z = -4;
		this.camera.position.y = 3;

		if (options.debug) {
			const controls = new OrbitControls(this.camera, this.renderer.domElement);
			controls.target.set(0, 0, 0);
			controls.update();

			const gridHelper = new GridHelper(24, 24);
			this.scene.add(gridHelper);

			let axesHelper = new AxesHelper(5);
			this.scene.add(axesHelper);
		}

		const ambientLight = new AmbientLight(0xffffff, 1);
		this.scene.add(ambientLight);
	}

	render() {
		this.renderer.render(this.scene, this.camera);

		const deltaT = this.clock.getDelta();

		// console.log(deltaT);
	}

	resize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.renderer.setSize(this.width, this.height);
		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();
	}
}
