import React from 'react';
import { render } from 'react-tela/render';

import App from './App.tsx';

// @ts-expect-error No document type in nxjs
export const isBrowserDev = typeof document !== 'undefined';
if (isBrowserDev) {
	// @ts-expect-error No document type in nxjs
	render(<App />, document.getElementById('canvas') as HTMLCanvasElement);
} else {
	render(<App />, screen);
}
