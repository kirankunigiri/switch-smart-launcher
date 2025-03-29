import { getQueriedGamesAmerica, getGamesAmerica } from 'nintendo-switch-eshop';

const titleId = '010081A00EE62000';
const gameTitle = 'GigaBash';

async function fetchGameInfo() {
	try {
		const games = await getQueriedGamesAmerica(gameTitle);
		if (games.length > 0) {
			const game = games[0];
			console.log(`Title: ${game.title}`);
			console.log(JSON.stringify(game, null, 2));

			console.log(`Number of Players: ${game.playerCount}`);
		} else {
			console.log('Game not found.');
		}
	} catch (error) {
		console.error('Error fetching game info:', error);
	}
}

fetchGameInfo();

const games = await getGamesAmerica();
// console.log(games);
const boomerangFu = games.find(game => game.title === 'Boomerang Fu');
console.log(boomerangFu);

const cleanHex = (decimal: bigint) => {
	return BigInt(decimal).toString(16).padStart(16, "0").toUpperCase();
};

// console.log(cleanHex(BigInt(72200118482640896)));
