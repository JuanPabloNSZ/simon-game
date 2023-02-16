let sequence = [];
let humanSequence = [];
let level = 0;

const startButton = document.querySelector('.js-start');
const info = document.querySelector('.js-info');
const heading = document.querySelector('.js-heading');
const tileContainer = document.querySelector('.js-container');

function resetGame(text) {
	alert(text);
	sequence = [];
	humanSequence = [];
	level = 0;

	startButton.classList.remove('hidden');
	info.classList.add('hidden');
	heading.textContent = 'Simon Game';
	tileContainer.classList.add('unclickable');
}

function startGameBtn() {
	// Oculta el startButton
	startButton.classList.add('hidden');
	// Aparece el texto "Wait for the computer"
	info.classList.remove('hidden');
	info.textContent = 'Wait for the computer';

	oneRound();
}

function oneRound() {
	// Aumenta en 1 el nivel actual
	level += 1;

	tileContainer.classList.add('unclickable');
	info.textContent = 'Wait for the computer';
	heading.textContent = `Level ${level} of 10`;

	// Copia todos los elementos del array sequence al array nextSequence
	const nextSequence = [...sequence];

	// Agrega un elemento random del array tiles (que sale de la función nextStep()) al array nextSequence
	nextSequence.push(randomTile());

	// Lanza la función machineTurn() con el argumento nextSequence
	machineTurn(nextSequence);
	// La variable sequence ahora contiene todos los elementos del array nextSequence
	sequence = [...nextSequence];

	// Lanza la función humanTurn() luego machineTurn
	setTimeout(() => {
		humanTurn(level);
	}, level * 600 + 1000);
}

function machineTurn(nextSequence) {
	// Aplica la función activateTile
	// a cada elemento del array nextSequence (que sale de la función nextRound())
	nextSequence.forEach((color, index) => {
		setTimeout(() => {
			activateTile(color);
		}, (index + 1) * 800);
	});
}

function humanTurn(level) {
	tileContainer.classList.remove('unclickable');
	info.textContent = `Your turn: ${level} Tap${level > 1 ? 's' : ''}`;
}

function activateTile(color) {
	const tile = document.querySelector(`[data-tile='${color}']`);
	const sound = document.querySelector(`[data-sound='${color}']`);

	tile.classList.add('activated');
	sound.play();

	setTimeout(() => {
		tile.classList.remove('activated');
	}, 300);
}

function randomTile() {
	const tiles = ['red', 'green', 'blue', 'yellow'];
	const random = tiles[Math.floor(Math.random() * tiles.length)];
	return random;
}

function handleClick(tile) {
	// Almacena el índice del elemento que fue añadido al array humanSequence ()
	// (El método push devuelve el length del array. Por eso al restarle 1 nos devuelve el índice del elemento que fue añadido)
	const index = humanSequence.push(tile) - 1;
	const sound = document.querySelector(`[data-sound='${tile}']`);
	const remainingTaps = sequence.length - humanSequence.length;

	sound.play();

	if (humanSequence[index] !== sequence[index]) {
		resetGame('Oops! Game over, you pressed the wrong tile');
		return;
	}

	if (humanSequence.length === sequence.length) {
		if (humanSequence.length === 10) {
			resetGame('Congrats! You completed all the levels');
			return;
		}
		humanSequence = [];
		info.textContent = 'Success! Keep going!';
		// setTimeout para asegurar que info.textContent aparece en la página
		setTimeout(() => {
			oneRound();
		}, 1000);
		return;
	}

	info.textContent = `Your turn: ${remainingTaps} Tap${
		remainingTaps > 1 ? 's' : ''
	}`;
}

startButton.addEventListener('click', startGameBtn);
tileContainer.addEventListener('click', (event) => {
	const tile = event.target.dataset.tile;
	// Si tile es true (es decir, si no es una empty string)
	// llama a la función handleClick usando tile como parámetro ("red", "green", "blue", "yellow")
	if (tile) handleClick(tile);
});
