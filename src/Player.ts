import {
	Box3,
	BoxGeometry,
	Mesh,
	MeshLambertMaterial,
	MeshStandardMaterial,
	Scene,
	Vector3,
} from "three";
import type { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { InputManager } from "./InputManager";

export interface Player {
	mesh: Mesh;
	momentum: number;
	bullets: PlayerBullet[];
}

const PLAYER_ACCELERATION = 26;

export async function createPlayer(gltfLoader: GLTFLoader): Promise<Player> {
	const gltf = await gltfLoader.loadAsync("/models/spaceship_0.glb");
	const model = gltf.scene.children.at(0);

	if (!model) {
		throw new Error("No spaceship found in model file");
	}
	model.scale.set(0.04, 0.04, 0.04);
	model.rotateY(Math.PI);

	if (!(model instanceof Mesh)) {
		throw new Error("Model is not a mesh");
	}
	model.material = new MeshStandardMaterial({
		color: 0xffffff,
	});
	model.castShadow = true;
	model.receiveShadow = true;

	return { mesh: model, momentum: 0, bullets: [] };
}

let fireKeyPressed = false;

const BULLET_ACCELERATION = 5;
const MAX_BULLET_DISTANCE = 20;

export function updatePlayer(
	player: Player,
	scene: Scene,
	deltaT: number,
): Player {
	const inputManager = InputManager.getInstance();

	let momentum = player.momentum;

	if (inputManager.isKeyDown("d") || inputManager.isKeyDown("ArrowRight")) {
		momentum -= PLAYER_ACCELERATION * deltaT;
	} else if (
		inputManager.isKeyDown("a") ||
		inputManager.isKeyDown("ArrowLeft")
	) {
		momentum += PLAYER_ACCELERATION * deltaT;
	}

	momentum /= Math.exp(deltaT * 4);

	player.mesh.position.x += momentum * deltaT * 2;
	player.mesh.rotation.z = momentum / 20 + Math.PI;

	const isFireDown =
		inputManager.isKeyDown(" ") ||
		inputManager.isKeyDown("w") ||
		inputManager.isKeyDown("ArrowUp");
	if (fireKeyPressed && !isFireDown) {
		fireKeyPressed = false;
	}
	if (!fireKeyPressed && isFireDown) {
		fireKeyPressed = true;

		const bullet = createPlayerBullet(player);
		scene.add(bullet.mesh);
		player.bullets.push(bullet);
	}

	for (const bullet of player.bullets) {
		bullet.mesh.position.z += BULLET_ACCELERATION * deltaT;

		if (bullet.mesh.position.z > MAX_BULLET_DISTANCE) {
			scene.remove(bullet.mesh);
			player.bullets = player.bullets.filter((b) => b !== bullet);
		}
	}

	return { mesh: player.mesh, momentum, bullets: player.bullets };
}

export interface PlayerBullet {
	mesh: Mesh;
}

export function createPlayerBullet(player: Player): PlayerBullet {
	const bullet = new Mesh(
		new BoxGeometry(1, 1, 3),
		new MeshLambertMaterial({ color: 0xffffff }),
	);
	bullet.position.copy(player.mesh.position);

	const playerSize = new Box3()
		.setFromObject(player.mesh)
		.getSize(new Vector3());

	bullet.position.y = 0.06;
	bullet.position.z = playerSize.z;
	bullet.scale.set(0.06, 0.06, 0.06);

	return { mesh: bullet };
}
