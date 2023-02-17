//* Reglas del juego:
// - En cada nivel la máquina muestra los elementos de los niveles anteriores y un elemento nuevo, generando una secuencia
// - El jugador debe seleccionar en orden de aparición los elementos mostrados por la máquina
// - El jugador gana cuando selecciona correctamente todos los n elementos de la secuencia
// (n es el total de niveles definidos antes de empezar el juego)
// - El jugador pierde cuando el elemento seleccionado no coincide con su orden de aparición en la secuencia

let machineSequence = [];
let humanSequence = [];
let level = 0;

const startButton = document.querySelector('.js-start');
const info = document.querySelector('.js-info');
const heading = document.querySelector('.js-heading');
const tileContainer = document.querySelector('.js-container');

function resetGame(text) {
	alert(text);
	machineSequence = [];
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

	// Añade un tile random al array machineSequence
	machineSequence.push(randomTile());
	machineTurn(machineSequence);

	// Lanza la función humanTurn() luego de machineTurn()
	setTimeout(() => {
		humanTurn(level);
	}, level * 600 + 1000);
}

function machineTurn(sequence) {
	// Aplica la función activateTile
	// a cada elemento del array machineSequence
	sequence.forEach((color, index) => {
		setTimeout(() => {
			activateTile(color);
		}, (index + 1) * 600);
	});
}

function randomTile() {
	const tiles = ['red', 'green', 'blue', 'yellow'];
	const random = tiles[Math.floor(Math.random() * tiles.length)];
	return random;
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
	// Remueve la clase 'unclickable' de los botones para que el jugador pueda presionar la secuencia correcta
	tileContainer.classList.remove('unclickable');
	info.textContent = `Your turn: ${level} Tap${
		level > 1 ? 's' : ''
	} to the next Round`;
}

function handleHumanClick(tileClicked) {
	// Añade el tile presionado al array humanSequence y almacena su índice
	// Nota: El método push devuelve el length del array, por eso al restarle 1 nos devuelve el índice del elemento que fue añadido
	const index = humanSequence.push(tileClicked) - 1;
	const sound = document.querySelector(`[data-sound='${tileClicked}']`);
	const remainingTaps = machineSequence.length - humanSequence.length;

	sound.play();

	//* Compara el orden de humanSequence con machineSequence
	// Verifica que el tile presionado coincide, según su orden en la secuencia, con el de machineSequence
	if (humanSequence[index] !== machineSequence[index]) {
		resetGame('Oops! Game over, you pressed the wrong tile');
		return;
	}

	//* Compara la cantidad de elementos de humanSequence con la de machineSequence
	// Verifica que el jugador haya completado la secuencia del nivel actual
	if (humanSequence.length === machineSequence.length) {
		// Si la cantidad de elementos en humanSequence es igual al total de niveles el jugador gana
		if (humanSequence.length === 10) {
			resetGame('Congrats! You completed all the levels');
			return;
		}

		// Si el jugador no ha completado todos los niveles
		// el array humanSequence se vacía para preparar un nuevo turno de la máquina
		humanSequence = [];

		// Muestra el mensaje "Success! Keep going!" al final del turno del jugador
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
	if (tile) handleHumanClick(tile);
});
