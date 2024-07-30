
// board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// bird
let birdWidth = 34; // width/height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
// let birdImg;

let bird = {
	width: birdWidth,
	height: birdHeight,
	x: birdX,
	y: birdY
}

// pipes
let pipeArray = [];
let pipeWidth = 64; // width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// physics
let velocityX = -2; // pipes' moving left speed
let velocityY = 0; // bird's jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = () => {
	// draw board
	board = document.getElementById("board");
	board.width = boardWidth;
	board.height = boardHeight;
	context = board.getContext("2d");

	// draw bird
	// context.fillStyle = "green";
	// context.fillRect(bird.x, bird.y, bird.width, bird.height);
	birdImg = new Image();
	birdImg.src = "./flappybird.png";
	birdImg.onload = () => {
		context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
	}

	// draw pipe
	topPipeImg = new Image();
	topPipeImg.src = "./toppipe.png";

	bottomPipeImg = new Image();
	bottomPipeImg.src = "./bottompipe.png";

	requestAnimationFrame(update);
	setInterval(placePipes, 1500); // calls placePipes function every 1.5s
	document.addEventListener("keydown", moveBird);
}

const update = () => {
	requestAnimationFrame(update);
	if (gameOver) {
		return;
	}
	context.clearRect(0, 0, board.width, board.height); // previous frame is cleared everytime we update animation

	// draw bird
	velocityY += gravity;
	bird.y = Math.max(bird.y + velocityY, 0);
	context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

	if (bird.y > board.height) {
		gameOver = true;
	}

	// draw pipes
	for (let i = 0; i < pipeArray.length; i++) {
		let pipe = pipeArray[i];
		pipe.x += velocityX;
		context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

		if (!pipe.passed && bird.x > pipe.x + pipe.width) {
			score += 0.5; // total 1 (top + bottom)
			pipe.passed = true;
		}

		if (detectCollision(bird, pipe)) {
			gameOver = true;
		}
	}

	// clear pipes
	while (pipeArray.length > 0 && pipeArray[0].x + pipeWidth < 0) {
		pipeArray.shift(); // removes first element in array
	}

	// draw score
	context.fillStyle = "white";
	context.font = "45px sans-serif";
	context.fillText(score, 5, 45);

	if (gameOver) {
		context.fillText("game over", 5, 90);
	}
}

const placePipes = () => {
	if (gameOver) {
		return;
	}
	let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
	let openingSpace = boardHeight / 4;

	let topPipe = {
		img: topPipeImg,
		x: pipeX,
		y: randomPipeY,
		width: pipeWidth,
		height: pipeHeight,
		passed: false
	};

	let bottomPipe = {
		img: bottomPipeImg,
		x: pipeX,
		y: randomPipeY + pipeHeight + openingSpace,
		width: pipeWidth,
		height: pipeHeight,
		passed: false
	}

	pipeArray.push(topPipe);
	pipeArray.push(bottomPipe);
}

const moveBird = (e) => {
	if (e.code === "Space" || e.code === "ArrowUp") {
		// jump
		velocityY = -6;
	}

	// reset game
	if (gameOver) {
		bird.y = birdY;
		pipeArray = [];
		score = 0;
		gameOver = false;
	}
}

const detectCollision = (a, b) => {
	return a.x < b.x + b.width &&
			a.x + a.width > b.x &&
			a.y < b.y + b.height &&
			a.y + a.height > b.y;
}