class Snake {
    constructor() {
        this.tail = new Array(4);
        this.head;
        this.score = 0;
        this.dir = {};
        this.reset();
    }

    reset(new_game="none") {

        if (new_game == "new_game") {
            this.tail = new Array(4);
            this.head = null;
            this.score = 0;
        }

        this.head = tiles[randint(5, TILE_ROWS-5)][randint(5, TILE_COLS-5)];
        this.tail[0] = this.head;

        for (let tile = 1; tile<this.tail.length; tile++) {
            let i = this.tail[tile-1].row;
            let j = this.tail[tile-1].col;

            let choices = [-2, -1, 0, 1]
            if (tile != 1) {
                let tile_not_chosen = this.tail[tile-2];
                if (tile_not_chosen.row > i) {
                    choices.splice(0, 1);
                } else if (tile_not_chosen.row < i) {
                    choices.splice(2, 1);
                } else if (tile_not_chosen.col > j) {
                    choices.splice(1, 1);
                } else if (tile_not_chosen.col < j) {
                    choices.splice(3, 1);
                }
            }

            let dir = randchoice(choices);
            switch (dir) {
                // Left
                case -2:
                    this.tail[tile] = tiles[i+1][j];
                    break;

                // Down
                case -1:
                    this.tail[tile] = tiles[i][j+1];
                    break;

                // Right
                case 0:
                    this.tail[tile] = tiles[i-1][j];
                    break;

                // Down
                case 1:
                    this.tail[tile] = tiles[i][j-1];
                    break;

                default:
                    break;

            }
        }
        this.dir = {x: this.head.row - this.tail[1].row, y: this.head.col - this.tail[1].col};
    }

    draw() {
        for (let tile = this.tail.length - 1; tile>=0; tile--) {
            if (tile == 0) {
                ctx.fillStyle = 'red';
            } else {
                ctx.fillStyle = 'green';
            }
            ctx.fillRect(this.tail[tile].x+1, this.tail[tile].y+1, TILE_WIDTH-2, TILE_WIDTH-2);
        }
    }

    ate() {
        return (this.head == food.spot);
    }

    inTail() {
        for (let i = this.tail.length - 1; i>=0; i--) {
            for (let j = this.tail.length - 1; j>=0; j--) {
                if (i == j) continue;

                if (this.tail[i] == this.tail[j]) return true;
            }
        }

        return false;
    }

    update() {
        // DIRECTIA
        // Stanga sau dreapta

        let new_row = this.head.row+this.dir.x;
        let new_col = this.head.col+this.dir.y;

        if (new_row == -1 || new_row == TILE_ROWS || new_col == -1 || new_col == TILE_COLS) {
            game_lost = true;
            return;
        }

        this.head = tiles[new_row][new_col];

        this.tail.unshift(this.head);
        this.tail.splice(this.tail.length-1, 1);

    }
}
