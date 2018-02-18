let canvas, ctx;
let WIDTH, HEIGHT;

let TILE_WIDTH;
const TILE_ROWS = 20;
const TILE_COLS = 20;

let tiles = create2DArray(TILE_COLS, TILE_ROWS);
let snake;
let food;

let frames = 0;
let game_lost = false;
let is_restarting = false;

let limit_frames = 15;
let time_started = Date.now();

function init() {
    canvas = document.getElementById('c');
    ctx = canvas.getContext('2d');

    WIDTH = canvas.width;
    HEIGHT = canvas.height;

    TILE_WIDTH = canvas.width / tiles.length;

    for (let i=0; i<TILE_ROWS; i++) {
        for (let j=0; j<TILE_COLS; j++) {
            tiles[i][j] = new Tile(i, j);
        }
    }

    snake = new Snake();

    document.addEventListener('keydown', function(e) {
        if (e.keyCode == '38' && snake.dir.y == 0) {
            snake.dir.x = 0;
            snake.dir.y = -1;
        }
        else if (e.keyCode == '40' && snake.dir.y == 0) {
            snake.dir.x = 0;
            snake.dir.y = 1;
        }
        else if (e.keyCode == '37' && snake.dir.x == 0) {
            snake.dir.x = -1;
            snake.dir.y = 0;
        }
        else if (e.keyCode == '39' && snake.dir.x == 0) {
            snake.dir.x = 1;
            snake.dir.y = 0;
        }

    });

    canvas.addEventListener("mousedown", function(event) {
        if (game_lost) is_restarting = true;
    });

    //setInterval(draw, 500);
    food = new Food();
    draw();
}

function draw() {
    window.requestAnimationFrame(draw);

    if (frames >= limit_frames && !game_lost) {
        is_restarting = false;
        ctx.beginPath();
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.closePath();

        ctx.fillStyle='black';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        if (snake.ate()) {
            snake.score++;
            food.newSpot();
            let last_tail = snake.tail[snake.tail.length-1];
            snake.tail.push(tiles[last_tail.row + snake.dir.x][last_tail.col + snake.dir.y]);
        }

        food.draw();

        snake.update();
        snake.draw();
        text("Score: " + snake.score, 2, 22, "white", "left");

        if (snake.inTail()) game_lost = true;

        frames = 0;
    } else if (game_lost) {
        if (is_restarting) {
            snake.reset("new_game");
            game_lost = false;
            food.newSpot();
        } else {
            ctx.beginPath();
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            ctx.closePath();

            ctx.fillStyle='black';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            text("Score: " + snake.score, WIDTH/2, HEIGHT/2, "white", "center", 100);
            text("Click the screen to restart", WIDTH/2, HEIGHT/2+50, "white", "center", 45);
        }
    }

    frames++;
}


function create2DArray(lenI, lenJ) {
    let x = new Array(lenI);

    if (lenJ) {
        for (let i = 0; i < lenI; i++) {
            x[i] = new Array(lenJ);
        }
    } else {
        for (let i = 0; i < lenI; i++) {
            x[i] = new Array(lenI);
        }
    }
    return x;
}


function random(min, max) {
    return Math.random() * (max - min + 1) + min;
}

// Inclusive
function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Inclusive
function randchoice(arr, offset = 0) {
    return arr[randint(offset, arr.length - 1 - offset)];
}

/*
Displays text with a given position, align and the size
*** t - {String} - The text
*** x, y - {Number} - X and y coordinates
*** c - {String} - Colour of the text
*** align - {String} - It aligns the text to center, left etc.
*** size - {Number} - Size of the text
*/
function text(t, x, y, c, align, size = 25) {
    if (align) ctx.textAlign = align;
    ctx.font = "bold " +size+"px Arial";
    ctx.fillStyle = c;
    ctx.fillText(t,x,y);
}
