import { Grid, TileType } from '../Grid';
import { Position } from '../types';
import { Behaviour } from './behaviours/Behaviour';

export class Enemy {
    protected x: number;
    protected y: number;
    protected behaviour: Behaviour;
    private readonly CELL_SIZE = 20;

    constructor(
        private ctx: CanvasRenderingContext2D,
        startX: number,
        startY: number,
        protected grid: Grid,
        behaviour: Behaviour
    ) {
        this.x = startX;
        this.y = startY;
        this.behaviour = behaviour;
    }

    update(playerPos: Position, timestamp: number): boolean {
        if (this.x === playerPos.x && this.y === playerPos.y) {
            return true;
        }

        this.behaviour.update(this, playerPos, timestamp);
        return false;
    }

    draw() {
        this.ctx.fillStyle = this.behaviour.getColour();
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

    getPosition(): Position {
        return { x: this.x, y: this.y };
    }

    moveTo(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    canMoveTo(x: number, y: number): boolean {
        if (!this.isValidPosition(x, y)) return false;
        return this.grid.getTileAt(x, y) === TileType.Empty;
    }

    getTileAt(x: number, y: number): TileType {
        return this.grid.getTileAt(x, y);
    }

    switchBehaviour(newBehaviour: Behaviour) {
        this.behaviour = newBehaviour;
    }

    private isValidPosition(x: number, y: number): boolean {
        return x >= 0 && x < this.grid.WIDTH && y >= 0 && y < this.grid.HEIGHT;
    }
}