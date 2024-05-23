import { For } from "solid-js";
import HeartSolidIcon from "@/icons/heart-solid.svg?component-solid";
import HeartOutlineIcon from "@/icons/heart-outline.svg?component-solid";

export function GameUI() {
	const health = 2;
	const maxHealth = 3;
	const score = 20;

	return (
		<div class="flex items-center p-5">
			<span class="mr-6">Score: {score}</span>
			<ul class="flex gap-1">
				<For each={Array(maxHealth).fill(0)}>
					{(_, index) => (
						<li>
							{index() + 1 > health ? (
								<HeartOutlineIcon class="size-5 text-white" />
							) : (
								<HeartSolidIcon class="size-5 text-white" />
							)}
						</li>
					)}
				</For>
			</ul>
		</div>
	);
}
