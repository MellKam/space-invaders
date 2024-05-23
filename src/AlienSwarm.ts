import { Box3, Group, Vector3 } from "three";
import { AlienType, createAlien, type Alien } from "./Alien";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export interface AlienSwarm {
	rows: number;
	columns: number;
	aliens: Array<Alien | null>;
	group: Group;
	acceleration: number;
	lastMoveTime: number;
}

const SPACE_BETWEEN_ALIENS = 0.2;

export async function createAlienSwarm(
	rows: number,
	columns: number,
	gltfLoader: GLTFLoader,
	alienType: AlienType,
): Promise<AlienSwarm> {
	const group = new Group();

	const aliens = await Promise.all(
		Array.from({ length: rows })
			.fill(0)
			.flatMap((_, y) => {
				return Array.from({ length: columns })
					.fill(0)
					.map(async (_, x) => {
						const alien = await createAlien(gltfLoader, alienType);
						const size = new Box3()
							.setFromObject(alien.mesh)
							.getSize(new Vector3());

						alien.mesh.position.x = (size.x + SPACE_BETWEEN_ALIENS) * x * -1;
						alien.mesh.position.z = (size.z + SPACE_BETWEEN_ALIENS) * y;

						group.add(alien.mesh);
						return alien;
					});
			}),
	);

	return { aliens, group, acceleration: 0, lastMoveTime: 0, rows, columns };
}

const SWARM_MOVE_ACCELERATION = 70;
const INITIAL_SWARM_MOVE_DELAY = 2; // seconds

export function updateAlienSwarm(
	swarm: AlienSwarm,
	elapsedTime: number,
	deltaT: number,
) {
	if (elapsedTime - swarm.lastMoveTime >= INITIAL_SWARM_MOVE_DELAY) {
		swarm.lastMoveTime = elapsedTime;
		swarm.acceleration += SWARM_MOVE_ACCELERATION * deltaT;
	}

	swarm.acceleration /= Math.exp(deltaT * 4);

	swarm.group.position.z -= swarm.acceleration * deltaT;

	return swarm;
}

function generateRandomInteger(min = 0, max = 1) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createRandomAlienSwarm(
	gltfLoader: GLTFLoader,
): Promise<AlienSwarm> {
	const rows = generateRandomInteger(3, 8);
	const columns = generateRandomInteger(3, 8);
	const alienType = Math.random() > 0.5 ? "alien_0" : "alien_1";

	return createAlienSwarm(rows, columns, gltfLoader, alienType);
}
