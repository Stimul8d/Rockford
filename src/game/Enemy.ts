import { Grid, TileType } from './Grid';

type Position = { x: number, y: number };

enum EnemyState {
    Trapped,
    Hunting
}

export class Enemy {
    private x: number;
    private y: number;
    private state: EnemyState;
    private readonly CELL_SIZE = 20;
    private moveTimer = 0;
    private readonly MOVE_DELAY = 300;
    private moveDirection = 1;  // 1 = right, -1 = left

    constructor(
        private ctx: CanvasRenderingContext2D,
        startX: number,
        startY: number,
        private grid: Grid,
        startTrapped: boolean = true
    ) {
        this.x = startX;
        this.y = startY;
        this.state = startTrapped ? EnemyState.Trapped : EnemyState.Hunting;
    }

    update(playerPos: Position, timestamp: number): boolean {
        // Kill check
        if (this.x === playerPos.x && this.y === playerPos.y) {
            return true;
        }

        // Movement timer
        if (timestamp - this.moveTimer < this.MOVE_DELAY) {
            return false;
        }

        // Save old position
        const oldX = this.x;
        const oldY = this.y;

        if (this.state === EnemyState.Trapped) {
            this.pacePrison();
            this.checkForEscape();
        } else {
            this.hunt(playerPos);
        }

        this.moveTimer = timestamp;
        return false;
    }

    draw() {
        this.ctx.fillStyle = this.state === EnemyState.Trapped ? '#FFA500' : '#FF0000';
        this.ctx.beginPath();
        this.ctx.arc(
            this.x * this.CELL_SIZE + this.CELL_SIZE/2,
            this.y * this.CELL_SIZE + this.CELL_SIZE/2,
            this.CELL_SIZE/3,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }

    private pacePrison() {
        const nextX = this.x + this.moveDirection;
        
        // If we hit a wall, turn around
        if (!this.canMoveTo(nextX, this.y)) {
            this.moveDirection *= -1;
            return;
        }

        this.x = nextX;
    }

    private checkForEscape() {
        // Look for paths out (empty spaces)
        const surroundings = [
            {x: this.x + 1, y: this.y},
            {x: this.x - 1, y: this.y},
            {x: this.x, y: this.y + 1},
            {x: this.x, y: this.y - 1}
        ];

        const canEscape = surroundings.some(pos => {
            if (!this.isValidPosition(pos.x, pos.y)) return false;
            return this.grid.getTileAt(pos.x, pos.y) === TileType.Empty;
        });

        if (canEscape) {
            this.state = EnemyState.Hunting;
        }
    }

    private hunt(playerPos: Position) {
        const dx = Math.sign(playerPos.x - this.x);
        const dy = Math.sign(playerPos.y - this.y);

        // Try horizontal first
        if (dx !== 0 && this.canMoveTo(this.x + dx, this.y)) {
            this.x += dx;
            return;
        }

        // Then vertical
        if (dy !== 0 && this.canMoveTo(this.x, this.y + dy)) {
            this.y += dy;
        }
    }

    private canMoveTo(x: number, y: number): boolean {
        if (!this.isValidPosition(x, y)) return false;
        const tile = this.grid.getTileAt(x, y);
        return tile === TileType.Empty || tile === TileType.Dirt;
    }

    private isValidPosition(x: number, y: number): boolean {
        return x >= 0 && x < 40 && y >= 0 && y < 22;
    }
}