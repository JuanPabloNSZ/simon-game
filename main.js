let sequence = [];
let humanSequence = [];
let level = 0;

const startButton = document.querySelector('.js-start');
const info = document.querySelector('.js-info');
const heading = document.querySelector('.js-heading');
const tileContainer = document.querySelector('.js-container');

startButton.addEventListener('click', startGame);
tileContainer.addEventListener('click', (event) => {
	const { tile } = event.target.dataset;

	if (tile) handleClick(tile);
});

function handleClick(tile) {
	const index = humanSequence.push(tile) - 1;
	const sound = document.querySelector(`[data-sound='${tile}']`);
	const remainingTaps = sequence.length - humanSequence.length;

	if (humanSequence[index] !== sequence[index]) {
		resetGame('Oops! Game over, you pressed the wrong tile');
		return;
	}

	if (humanSequence.length === sequence.length) {
		if (humanSequence.length === 5) {
			resetGame('Congrats! You completed all the levels');
			return;
		}

		humanSequence = [];
		info.textContent = 'Success! Keep going!';

		// setTimeout para asegurar que info.textContent aparece en la página
		setTimeout(() => {
			nextRound();
		}, 1000);

		return;
	}

	info.textContent = `Your turn: ${remainingTaps} Tap${
		remainingTaps > 1 ? 's' : ''
	}`;
}

function startGame() {
	// Oculta el startButton
	startButton.classList.add('hidden');

	// Aparece el texto "Wait for the computer"
	info.classList.remove('hidden');
	info.textContent = 'Wait for the computer';

	console.log('The game has started. Good luck!');

	nextRound();
}

function nextRound() {
	// Aumenta en 1 el nivel actual
	level += 1;

	tileContainer.classList.add('unclickable');
	info.textContent = 'Wait for the computer';
	heading.textContent = `Level ${level} of 20`;

	// Copia todos los elementos del array sequence al array nextSequence
	const nextSequence = [...sequence];

	// Agrega un elemento random del array tiles (que sale de la función nextStep()) al array nextSequence
	nextSequence.push(nextStep());

	// Lanza la función playRound() con el argumento nextSequence
	playRound(nextSequence);

	// La variable sequence ahora contiene todos los elementos del array nextSequence
	sequence = [...nextSequence];

	setTimeout(() => {
		humanTurn(level);
	}, level * 600 + 1000);
}

function nextStep() {
	const tiles = ['red', 'green', 'blue', 'yellow'];
	const random = tiles[Math.floor(Math.random() * tiles.length)];
	console.log(random);
	return random;
}

function playRound(nextSequence) {
	// Aplica la función activateTile
	// a cada elemento del array nextSequence (que sale de la función nextRound())
	nextSequence.forEach((color, index) => {
		setTimeout(() => {
			activateTile(color);
		}, (index + 1) * 600);
	});
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

function humanTurn(level) {
	tileContainer.classList.remove('unclickable');
	info.textContent = `Your turn: ${level} Tap${level > 1 ? 's' : ''}`;
}

function resetGame(text) {
	alert(text);
	sequence = [];
	humanSequence = [];
	level = 0;
	info.classList.add('hidden');
	startButton.classList.remove('hidden');
	heading.textContent = 'Simon Game';
	tileContainer.classList.add('unclickable');
}
