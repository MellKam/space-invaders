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
	Fog,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const renderer = new WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const camera = new PerspectiveCamera(
	75, // make higher for more zoomed in
	window.innerWidth / window.innerHeight,
	0.1,
	1000,
);

camera.position.z = -4;
camera.position.y = 3;

camera.lookAt(0, 0, 0);

const scene = new Scene();
scene.fog = new Fog(0x000000, 0, 20);

if (import.meta.env.DEV) {
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 0, 0);
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

const spaceship = await gltfLoader.loadAsync("/models/spaceship.glb");
const el = spaceship.scene.children.at(0)!;
el.scale.set(0.1, 0.1, 0.1);

if (el instanceof Mesh) {
	el.material = new MeshStandardMaterial({ color: 0xffffff });
	// Enable shadow casting for the model
	el.castShadow = true;
	// Enable shadow receiving for the model
	el.receiveShadow = true;
}

scene.add(el);

// create cube and add to scene

const cube = new Mesh(
	new BoxGeometry(1, 1, 1),
	new MeshStandardMaterial({ color: 0x00ff00 }),
);

cube.castShadow = true;

scene.add(cube);

function render() {
	renderer.render(scene, camera);

	requestAnimationFrame(render);
}

render();
