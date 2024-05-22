import { AlienSwarm } from "./AlienSwarm";

export interface BattleField {
	rows: number;
	columns: number;
	swarms: Array<AlienSwarm>;
}
