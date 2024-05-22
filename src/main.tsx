import "./global.css";
import {
	AmbientLight,
	AxesHelper,
	GridHelper,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
	DirectionalLight,
	Fog,
	Vector3,
	Clock,
	Vector2,
	Box3,
	BoxHelper,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { createPlayer, updatePlayer } from "./Player";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { createAlienSwarm, updateAlienSwarm } from "./AlienSwarm";
// import { InputManager } from "./InputManager";

// const inputManager = InputManager.getInstance();

async function main() {
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

	if (import.meta.env.DEV) {
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.target.set(0, 2, 0);
		controls.update();

		const gridHelper = new GridHelper(24, 24);
		scene.add(gridHelper);

		let axesHelper = new AxesHelper(5);
		scene.add(axesHelper);

		const ambientLight = new AmbientLight(0xffffff, 1);
		scene.add(ambientLight);
	}

	const dirationalLight = new DirectionalLight(0xffffff);
	dirationalLight.position.set(0, 2, 0);
	dirationalLight.castShadow = true;
	scene.add(dirationalLight);

	// const cameraTarget = new Vector3(0, 2.5, -1.5);

	const gltfLoader = new GLTFLoader();

	let player = await createPlayer(gltfLoader);
	let alienSwarm = await createAlienSwarm(4, 8, gltfLoader, "alien_1");
	const alienSwarmSize = new Box3()
		.setFromObject(alienSwarm.group)
		.getSize(new Vector3());

	alienSwarm.group.position.x = alienSwarmSize.x / 2;
	alienSwarm.group.position.z = 5;
	alienSwarm.group.position.y = alienSwarmSize.y / 4;

	const groupHelper = new BoxHelper(alienSwarm.group);
	scene.add(groupHelper);

	scene.add(player.mesh);
	scene.add(alienSwarm.group);

	const composer = new EffectComposer(renderer);
	composer.addPass(new RenderPass(scene, camera));

	if (import.meta.env.PROD) {
		scene.fog = new Fog(0x000000, 0, 20);

		const rgbShiftPass = new ShaderPass({
			...RGBShiftShader,
			uniforms: {
				...RGBShiftShader.uniforms,
				amount: { value: 0.001 },
				angle: { value: 0.1 },
			},
		});
		composer.addPass(rgbShiftPass);

		const bloomPass = new UnrealBloomPass(
			new Vector2(window.innerWidth, window.innerHeight),
			0.5,
			1.5,
			0.3,
		);
		composer.addPass(bloomPass);
	}

	const render = () => {
		const deltaT = clock.getDelta();
		const elapsedTime = clock.getElapsedTime();

		player = updatePlayer(player, scene, deltaT);
		alienSwarm = updateAlienSwarm(alienSwarm, elapsedTime, deltaT);
		groupHelper.update();

		for (const bullet of player.bullets) {
			const bulletBox = new Box3().setFromObject(bullet.mesh);
			const alienSwarmBox = new Box3().setFromObject(alienSwarm.group);

			if (!bulletBox.intersectsBox(alienSwarmBox)) {
				continue;
			}

			for (let i = 0; i < alienSwarm.aliens.length; i++) {
				const alien = alienSwarm.aliens[i];
				if (!alien) {
					continue;
				}

				const alienBox = new Box3().setFromObject(alien.mesh);

				if (bulletBox.intersectsBox(alienBox)) {
					scene.remove(bullet.mesh);
					player.bullets = player.bullets.filter((b) => b !== bullet);
					alienSwarm.group.remove(alien.mesh);
					alienSwarm.aliens[i] = null;
				}
			}
		}

		// if (!inputManager.isMouseDown()) {
		// 	cameraTarget.setX(player.mesh.position.x);
		// 	camera.position.lerp(cameraTarget, 0.1);
		// }

		composer.render(deltaT);

		requestAnimationFrame(render);
	};

	requestAnimationFrame(render);
}

main();
