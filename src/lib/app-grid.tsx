import { useObserve } from '@legendapp/state/react';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Rect } from 'react-tela';

import { AppList, HEADER_HEIGHT, SCREEN_HEIGHT, SCREEN_WIDTH } from '../App';
import { direction$ } from '../hooks/use-last-key';
import { isBrowserDev } from '../main';
import AppCard from './app-card';

interface AppGridProps {
	applications: AppList
}

const MemoizedAppCard = memo(AppCard);

// SCREEN_HEIGHT

// Replace the animation hook with a simple state
function useScrollPosition(initialY: number) {
	const [currentY, setCurrentY] = useState(initialY);
	return [currentY, setCurrentY] as const;
}

// Memoize icon positions calculation with useMemo
function useIconPositions(applications: AppList, scrollY: number, config: {
	PADDING_X: number
	PADDING_Y: number
	ICONS_PER_ROW: number
	GAME_SPACE_X: number
	GAME_SPACE_Y: number
	ICON_SIZE: number
	ROW_HEIGHT: number
	HEADER_HEIGHT: number
}) {
	return useMemo(() => {
		return applications.map((app, index) => {
			if (!app.icon) return null;

			const img = typeof app.icon === 'string'
				? app.icon
				: URL.createObjectURL(new Blob([app.icon]));

			const row = Math.floor(index / config.ICONS_PER_ROW);
			const col = index % config.ICONS_PER_ROW;

			const x = config.PADDING_X + (col * (config.ICON_SIZE + config.GAME_SPACE_X));
			const y = config.HEADER_HEIGHT + config.PADDING_Y + (row * config.ROW_HEIGHT) - scrollY;

			return { img, name: app.name, x, y };
		}).filter(Boolean);
	}, [applications, scrollY, config]);
}

export function AppGrid({ applications }: AppGridProps) {
	const PADDING_X = 16;
	const PADDING_Y = 16;
	const ICONS_PER_ROW = 10;
	const GAME_SPACE_X = 16;
	const GAME_SPACE_Y = 16;

	// Add selected index state
	const [selectedIndex, setSelectedIndex] = useState(0);

	const config = useMemo(() => {
		const availableWidth = SCREEN_WIDTH - (2 * PADDING_X);
		const ICON_SIZE = Math.floor((availableWidth - (GAME_SPACE_X * (ICONS_PER_ROW - 1))) / ICONS_PER_ROW);
		const TEXT_HEIGHT = 40;
		const ROW_HEIGHT = ICON_SIZE + TEXT_HEIGHT + GAME_SPACE_Y;

		return {
			PADDING_X,
			PADDING_Y,
			ICONS_PER_ROW,
			GAME_SPACE_X,
			GAME_SPACE_Y,
			ICON_SIZE,
			ROW_HEIGHT,
			HEADER_HEIGHT,
		};
	}, []);

	const [activeRow, setActiveRow] = useState(0);
	const [scrollY, setScrollY] = useScrollPosition(0);

	const totalRows = Math.ceil(applications.length / ICONS_PER_ROW);

	const visibleRows = useMemo(() => {
		const availableHeight = SCREEN_HEIGHT - HEADER_HEIGHT - PADDING_Y;
		return Math.floor(availableHeight / config.ROW_HEIGHT);
	}, [config.ROW_HEIGHT]);

	useObserve(direction$.down, ({ value }) => {
		if (value) {
			setActiveRow(prev => Math.min(prev + 1, totalRows - 1));
			// Update selected index when moving down
			setSelectedIndex(prev => Math.min(prev + ICONS_PER_ROW, applications.length - 1));
		}
	});

	useObserve(direction$.up, ({ value }) => {
		if (value) {
			setActiveRow(prev => Math.max(prev - 1, 0));
			// Update selected index when moving up
			setSelectedIndex(prev => Math.max(prev - ICONS_PER_ROW, 0));
		}
	});

	// Add left/right navigation
	useObserve(direction$.left, ({ value }) => {
		if (value) {
			setSelectedIndex(prev => Math.max(prev - 1, Math.floor(prev / ICONS_PER_ROW) * ICONS_PER_ROW));
		}
	});

	useObserve(direction$.right, ({ value }) => {
		if (value) {
			setSelectedIndex((prev) => {
				const rowStart = Math.floor(prev / ICONS_PER_ROW) * ICONS_PER_ROW;
				const rowEnd = Math.min(rowStart + ICONS_PER_ROW - 1, applications.length - 1);
				return Math.min(prev + 1, rowEnd);
			});
		}
	});

	useEffect(() => {
		// Calculate which row the selected index is in
		const selectedRow = Math.floor(selectedIndex / ICONS_PER_ROW);

		// Calculate the current visible row range
		const scrolledRows = Math.floor(scrollY / config.ROW_HEIGHT);
		const lastVisibleRow = scrolledRows + visibleRows - 1;

		// Only scroll if selected row is outside visible range
		if (selectedRow > lastVisibleRow) {
			// Scroll down to show the selected row
			const newScrollRow = selectedRow - visibleRows + 1;
			const targetY = newScrollRow * config.ROW_HEIGHT;
			setScrollY(Math.min(targetY, Math.max(0, totalRows * config.ROW_HEIGHT - (SCREEN_HEIGHT - HEADER_HEIGHT - PADDING_Y))));
		} else if (selectedRow < scrolledRows) {
			// Scroll up to show the selected row
			const targetY = selectedRow * config.ROW_HEIGHT;
			setScrollY(targetY);
		}
	}, [selectedIndex, config.ROW_HEIGHT, visibleRows, totalRows, scrollY]);

	const icons = useIconPositions(applications, scrollY, config);

	const handleLaunch = useCallback((index: number) => {
		console.log('touch start');
		if (!isBrowserDev) {
			const app = applications[index] as Switch.Application;
			app.launch();
		}
	}, [applications]);

	return (
		<>
			{/* Draw selection border */}
			{(() => {
				const selectedApp = icons[selectedIndex];
				if (!selectedApp) return null;

				return (
					<Rect
						x={selectedApp.x}
						y={selectedApp.y}
						width={config.ICON_SIZE}
						height={config.ICON_SIZE}
						stroke="#0078d7"
						lineWidth={10}
						// strokeWidth={2}
						fill="blue"
					/>
				);
			})()}

			{/* Draw app cards */}
			{icons.map(({ img, name, x, y }, index) => (
				<MemoizedAppCard
					key={`${name}-${index}`}
					img={img}
					name={name}
					x={x}
					y={y}
					iconSize={config.ICON_SIZE}
					onLaunch={() => handleLaunch(index)}
				/>
			))}
		</>
	);
}
