import { Observable, observable } from '@legendapp/state';
import { Button } from '@nx.js/constants';
import { useEffect } from 'react';
import { Text } from 'react-tela';

interface Direction {
	up: boolean
	down: boolean
	left: boolean
	right: boolean
}

interface GamepadInput {
	type: 'axis' | 'button'
	index: number
	value: number
	gamepadIndex: number
	timestamp: number
}

// Create a global observable for gamepad input
export const lastInput$ = observable<GamepadInput | null>(null);
export const direction$ = observable<Direction>({
	up: false,
	down: false,
	left: false,
	right: false,
});

// This should only be called once at the app root level
export function initializeGamepadTracking() {
	let animationId: number;

	// Add keyboard event listeners
	function handleKeyDown(e: KeyboardEvent) {
		switch (e.key) {
			case 'ArrowDown':
				direction$.down.set(true);
				break;
			case 'ArrowUp':
				direction$.up.set(true);
				break;
			case 'ArrowLeft':
				direction$.left.set(true);
				break;
			case 'ArrowRight':
				direction$.right.set(true);
				break;
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		switch (e.key) {
			case 'ArrowDown':
				direction$.down.set(false);
				break;
			case 'ArrowUp':
				direction$.up.set(false);
				break;
			case 'ArrowLeft':
				direction$.left.set(false);
				break;
			case 'ArrowRight':
				direction$.right.set(false);
				break;
		}
	}

	window.addEventListener('keydown', handleKeyDown);
	window.addEventListener('keyup', handleKeyUp);

	function checkGamepad() {
		const gamepads = navigator.getGamepads();

		// Check all connected gamepads
		for (const gamepad of gamepads) {
			if (!gamepad) continue; // Skip disconnected/null gamepads

			// // Check axes (with deadzone)
			// for (let i = 0; i < gamepad.axes.length; i++) {
			// 	const value = gamepad.axes[i];
			// 	if (Math.abs(value) > 0.3) {
			// 		lastInput$.set({
			// 			type: 'axis',
			// 			index: i,
			// 			value,
			// 			gamepadIndex: gamepad.index,
			// 			timestamp: Date.now(),
			// 		});
			// 		break;
			// 	}
			// }

			// // Check buttons
			// for (let i = 0; i < gamepad.buttons.length; i++) {
			// 	const button = gamepad.buttons[i];
			// 	if (button.pressed) {
			// 		lastInput$.set({
			// 			type: 'button',
			// 			index: i,
			// 			value: button.value,
			// 			gamepadIndex: gamepad.index,
			// 			timestamp: Date.now(),
			// 		});
			// 		break;
			// 	}
			// }

			// Directions
			if (gamepad.buttons[Button.Down].pressed) {
				if (!direction$.down.get()) {
					direction$.down.set(true);
				}
			} else {
				if (direction$.down.get()) {
					direction$.down.set(false);
				}
			}

			if (gamepad.buttons[Button.Up].pressed) {
				if (!direction$.up.get()) {
					direction$.up.set(true);
				}
			} else {
				if (direction$.up.get()) {
					direction$.up.set(false);
				}
			}

			if (gamepad.buttons[Button.Left].pressed) {
				if (!direction$.left.get()) {
					direction$.left.set(true);
				}
			} else {
				if (direction$.left.get()) {
					direction$.left.set(false);
				}
			}

			if (gamepad.buttons[Button.Right].pressed) {
				if (!direction$.right.get()) {
					direction$.right.set(true);
				}
			} else {
				if (direction$.right.get()) {
					direction$.right.set(false);
				}
			}
		}

		animationId = requestAnimationFrame(checkGamepad);
	}

	checkGamepad(); // Start the animation frame loop

	// Update cleanup function to remove keyboard listeners
	return () => {
		cancelAnimationFrame(animationId);
		window.removeEventListener('keydown', handleKeyDown);
		window.removeEventListener('keyup', handleKeyUp);
	};
}
