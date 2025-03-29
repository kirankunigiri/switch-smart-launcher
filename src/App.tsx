import React, { useEffect, useState } from 'react';
import { Image, Rect, Text } from 'react-tela';

import { isBrowserDev } from './main';

const HEADER_HEIGHT = 60;
const SCREEN_WIDTH = 1280;
const SCREEN_HEIGHT = 720;
const PADDING_X = 16;
const PADDING_Y = 16;
const ICONS_PER_ROW = 10;
const GAME_SPACE_X = 16;
const GAME_SPACE_Y = 16;

export interface GameApplication {
	name: string
	version: string
	id: bigint
	icon: ArrayBuffer | string // Can be either ArrayBuffer or image URL
	author: string
}

export function getTestApplications(): GameApplication[] {
	const NUM_TEST_APPS = 50;
	const applications: GameApplication[] = [];
	for (let i = 1; i <= NUM_TEST_APPS; i++) {
		applications.push({
			name: `Test Game ${i}`,
			version: `${i}.0.0`,
			id: BigInt(i),
			icon: 'https://tinfoil.media/ti/01007EF00011E000/512/512',
			author: `Dev Author ${i}`,
		});
	}
	return applications;
}

function App() {
	const availableWidth = SCREEN_WIDTH - (2 * PADDING_X);
	const ICON_SIZE = Math.floor((availableWidth - (GAME_SPACE_X * (ICONS_PER_ROW - 1))) / ICONS_PER_ROW);

	const appList: GameApplication[] = isBrowserDev
		? getTestApplications()
		: Array.from(Switch.Application).map(({ name, version, id, icon, author }) =>
			({ name, version, id, icon, author }));

	const icons = appList.reduce((acc, app, index) => {
		if (!app.icon) return acc;

		const img = typeof app.icon === 'string'
			? app.icon
			: URL.createObjectURL(new Blob([app.icon]));

		const row = Math.floor(index / ICONS_PER_ROW);
		const col = index % ICONS_PER_ROW;

		const x = PADDING_X + (col * (ICON_SIZE + GAME_SPACE_X));

		const TEXT_HEIGHT = 40;
		const y = HEADER_HEIGHT + PADDING_Y + (row * (ICON_SIZE + TEXT_HEIGHT + GAME_SPACE_Y));

		return [...acc, { img, name: app.name, x, y }];
	}, [] as { img: string, name: string, x: number, y: number }[]);

	return (
		<>
			<Text
				fontSize={26}
				fill="red"
				x={PADDING_X}
				y={HEADER_HEIGHT / 2}
				textBaseline="middle"
			>
				Smart Launcher
			</Text>

			<Rect x={0} y={HEADER_HEIGHT} width={SCREEN_WIDTH} height={2} fill="gray" />

			{/* List of Games */}
			{icons.map(({ img, name, x, y }, index) => (
				<React.Fragment key={index}>
					<Image
						src={img}
						width={ICON_SIZE}
						height={ICON_SIZE}
						x={x}
						y={y}
					/>

					{/* App Name */}
					<Text
						x={x} // Center text below icon
						y={y + ICON_SIZE + 10} // Position text below icon
						fontSize={18}
						fill="red"
						textAlign="left"
					>
						{name}
					</Text>
				</React.Fragment>
			))}
		</>
	);
}

export default App;
