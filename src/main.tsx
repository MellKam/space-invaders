import "./global.css";
import {
	AmbientLight,
	AxesHelper,
	GridHelper,
	Mesh,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
	DirectionalLight,
	BoxGeometry,
	MeshLambertMaterial,
	MeshToonMaterial,
	MeshStandardMaterial,
	Box3Helper,
	Fog,
	Vector3,
	Clock,
	BoxHelper,
	Box3,
} from "three";
import { InputManager } from "./InputManager";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const inputManager = new InputManager();
const clock = new Clock();
const renderer = new WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const camera = new PerspectiveCamera(
	95, // make higher for more zoomed in
	window.innerWidth / window.innerHeight,
	0.1,
	1000,
);

camera.position.z = -1.5;
camera.position.y = 2.5;

camera.lookAt(0, 2, 0);

const scene = new Scene();

if (import.meta.env.PROD) {
	scene.fog = new Fog(0x000000, 0, 20);
}

if (import.meta.env.DEV) {
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 2, 0);
	controls.update();

	const gridHelper = new GridHelper(24, 24);
	scene.add(gridHelper);

	let axesHelper = new AxesHelper(5);
	scene.add(axesHelper);
}

const ambientLight = new AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const dirationalLight = new DirectionalLight(0xffffff, 1);
dirationalLight.position.set(0, 1, 0);
dirationalLight.castShadow = true;
scene.add(dirationalLight);

const gltfLoader = new GLTFLoader();

const model = await gltfLoader.loadAsync("/models/spaceship_0.glb");
const spaceship = model.scene.children.at(0)!;

spaceship.scale.set(0.05, 0.05, 0.05);
spaceship.rotateY(Math.PI);

const boxHelper = new BoxHelper(spaceship, 0xffff00);
scene.add(boxHelper);

if (spaceship instanceof Mesh) {
	spaceship.material = new MeshStandardMaterial({ color: 0xffffff });
	spaceship.castShadow = true;
	spaceship.receiveShadow = true;
}

scene.add(spaceship);

let momentum = 0;
let acceleration = 10;

function render() {
	const deltaT = clock.getDelta();

	if (inputManager.isKeyDown("d")) {
		momentum -= acceleration * deltaT;
	} else if (inputManager.isKeyDown("a")) {
		momentum += acceleration * deltaT;
	}

	spaceship.position.x += momentum * deltaT;
	momentum /= Math.pow(1.4, deltaT * 1.5);
	spaceship.rotation.z = momentum / 8 + Math.PI;

	boxHelper.update();

	renderer.render(scene, camera);

	requestAnimationFrame(render);
}

render();
