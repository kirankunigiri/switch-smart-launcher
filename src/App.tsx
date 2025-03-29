import { use$ } from '@legendapp/state/react';
import React, { useEffect } from 'react';
import { Rect, Text } from 'react-tela';

import { direction$, initializeGamepadTracking, lastInput$ } from './hooks/use-last-key';
import { AppGrid } from './lib/app-grid';
import { isBrowserDev } from './main';
import testApps from './test/apps.json';

export const HEADER_HEIGHT = 60;
export const SCREEN_WIDTH = 1280;
export const SCREEN_HEIGHT = 720;
export const PADDING_X = 16;

export interface GameApplication {
	name: string
	version: string
	id: bigint
	icon: ArrayBuffer | string // Can be either ArrayBuffer or image URL
	author: string
}

export function getTestApplications(): GameApplication[] {
	return testApps.map((app: any) => ({
		...app,
		icon: 'https://tinfoil.media/ti/01007EF00011E000/512/512',
	}));
}

export type AppList = GameApplication[] | Switch.Application[];

interface Post {
	userId: number
	id: number
	title: string
	body: string
}

function App() {
	const appList: AppList = isBrowserDev
		? getTestApplications().slice(0, 70)
		: Array.from(Switch.Application).slice(0, 70);

	useEffect(() => {
		const cleanup = initializeGamepadTracking();
		return cleanup;
	}, []);

	// Add function to send data to server
	// const sendAppListToServer = async () => {
	// 	try {
	// 		const response = await fetch('http://10.0.0.98:3000/api', {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 			},
	// 			body: JSON.stringify({
	// 				applications: appList.map(app => ({
	// 					name: app.name,
	// 					version: app.version,
	// 					id: app.id.toString(), // Convert BigInt to string for JSON
	// 					icon: typeof app.icon === 'string' ? app.icon : 'binary-data',
	// 					author: app.author,
	// 				})),
	// 			}),
	// 		});

	// 		const data = await response.json();
	// 		console.log('Server response:', data);
	// 	} catch (error) {
	// 		console.error('Error sending data to server:', error);
	// 	}
	// };

	// // Call the function when component mounts
	// React.useEffect(() => {
	// 	sendAppListToServer();
	// }, []); // Empty dependency array means this runs once on mount

	return (
		<>
			{/* Background */}
			<Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT} fill="black" />

			{/* List of Games */}
			<AppGrid
				applications={appList}
			/>

			{/* Header */}
			<Rect x={0} y={0} width={SCREEN_WIDTH} height={HEADER_HEIGHT} fill="#1a1a1a" />
			<Rect x={0} y={HEADER_HEIGHT} width={SCREEN_WIDTH} height={2} fill="gray" />
			<Text
				fontSize={26}
				fill="white"
				x={PADDING_X}
				y={HEADER_HEIGHT / 2}
				textBaseline="middle"
			>
				Smart Launcher
			</Text>
			{/* <LastKey /> */}
			<GamepadDirection />
		</>
	);
}

export default App;

// Optional component for debugging
export function LastKey() {
	const lastInput = use$(lastInput$);
	return <Text x={100} y={0} fill="white">{JSON.stringify(lastInput)}</Text>;
}

export function GamepadDirection() {
	const direction = use$(direction$.down);
	return <Text x={150} y={0} fill="white">Down: {JSON.stringify(direction)}</Text>;
}
