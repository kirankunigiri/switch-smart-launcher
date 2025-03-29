import { GameUS, getQueriedGamesAmerica } from 'nintendo-switch-eshop';
import React, { useEffect, useState } from 'react';
import { Circle, Image, Rect, Text } from 'react-tela';

interface AppCardProps {
	img: string
	name: string
	x: number
	y: number
	iconSize: number
	onLaunch: () => void
}

const PLAYER_COUNT_RADIUS = 10;

export async function fetchGameInfo(gameTitle: string) {
	try {
		const games = await getQueriedGamesAmerica(gameTitle);
		if (games.length > 0) {
			return games[0];
		} else {
			console.log('Game not found.');
		}
	} catch (error) {
		console.log('Error fetching game info:', error);
	}
}

function extractPlayerCount(playerString: string | undefined): string {
	if (!playerString) return '?';
	const match = playerString.match(/\d+/);
	return match ? match[0] : '?';
}

function AppCard({ img, name, x, y, iconSize, onLaunch }: AppCardProps) {
	const [gameInfo, setGameInfo] = useState<GameUS | null>(null);

	// useEffect(() => {
	// 	async function getGame() {
	// 		const game = await fetchGameInfo(name);
	// 		setGameInfo(game || null);
	// 	}
	// 	getGame();
	// }, [name]);

	return (
		<>
			<Image
				src={img}
				width={iconSize}
				height={iconSize}
				x={x}
				y={y}
				onTouchStart={onLaunch}
			/>
			{/* <Rect
				width={iconSize}
				height={iconSize}
				x={x}
				y={y}
				fill="white"
				onTouchStart={onLaunch}
			/> */}
			<Text
				x={x}
				y={y + iconSize + 10}
				fontSize={18}
				fill="white"
				textAlign="left"
			>
				{name.length > 14 ? `${name.slice(0, 11)}...` : name}
			</Text>
			<Circle
				x={x + iconSize - PLAYER_COUNT_RADIUS * 2 - 5}
				y={y + iconSize - PLAYER_COUNT_RADIUS * 2 - 5}
				radius={PLAYER_COUNT_RADIUS}
				fill="white"
			/>
			<Text
				x={x + iconSize - PLAYER_COUNT_RADIUS - 5}
				y={y + iconSize - PLAYER_COUNT_RADIUS - 5}
				fontSize={14}
				fill="black"
				textAlign="center"
				textBaseline="middle"
			>
				{extractPlayerCount(gameInfo?.playerCount || gameInfo?.numOfPlayers)}
			</Text>
		</>
	);
}

export default AppCard;
