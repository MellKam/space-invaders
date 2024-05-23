import { Mesh, MeshStandardMaterial } from "three";
import type { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export interface Alien {
	type: AlienType;
	mesh: Mesh;
}

export type AlienType = "alien_0" | "alien_1";

const ALIEN_MODELS: Record<AlienType, string> = {
	alien_0: "/models/alien_0.glb",
	alien_1: "/models/alien_1.glb",
};

const ALIEN_COLORS: Record<AlienType, number> = {
	alien_0: 0xff0000,
	alien_1: 0x0085ff,
};

export async function createAlien(
	gltfLoader: GLTFLoader,
	alienType: AlienType,
): Promise<Alien> {
	const gltf = await gltfLoader.loadAsync(ALIEN_MODELS[alienType]);
	const model = gltf.scene.children.at(0);

	if (!model) {
		throw new Error("No alien found in model file");
	}
	model.scale.set(0.03, 0.03, 0.03);
	model.rotateZ(Math.PI);

	if (!(model instanceof Mesh)) {
		throw new Error("Model is not a mesh");
	}
	model.material = new MeshStandardMaterial({ color: ALIEN_COLORS[alienType] });
	model.castShadow = true;
	model.receiveShadow = true;

	return { mesh: model, type: alienType };
}
