import { Enemy } from '../Enemy';
import { Position } from '../../types';
import { Behaviour } from './Behaviour';
import { TileType } from '../../Grid';
import { HuntBehaviour } from './HuntBehaviour';

export class TrappedBehaviour implements Behaviour {
    private moveX = 1;
    private moveY = 0;
    private lastMove = 0;
    private readonly MOVE_DELAY = 300;

    getColour(): string {
        return '#00FF00';
    }

    update(enemy: Enemy, playerPos: Position, timestamp: number): void {
        if (timestamp - this.lastMove < this.MOVE_DELAY) return;

        if (this.hasPathToPlayer(enemy, playerPos)) {
            enemy.switchBehaviour(new HuntBehaviour());
            return;
        }

        this.patrol(enemy);
        this.lastMove = timestamp;
    }

    private patrol(enemy: Enemy) {
        const pos = enemy.getPosition();
        const nextX = pos.x + this.moveX;
        const nextY = pos.y + this.moveY;

        if (enemy.canMoveTo(nextX, nextY)) {
            enemy.moveTo(nextX, nextY);
            return;
        }

        // Hit a wall - try rotating our direction clockwise
        if (this.moveX === 1) { // Going right -> go down
            this.moveX = 0;
            this.moveY = 1;
        } else if (this.moveX === -1) { // Going left -> go up
            this.moveX = 0;
            this.moveY = -1;
        } else if (this.moveY === 1) { // Going down -> go left
            this.moveX = -1;
            this.moveY = 0;
        } else { // Going up -> go right
            this.moveX = 1;
            this.moveY = 0;
        }
    }

    private hasPathToPlayer(enemy: Enemy, playerPos: Position): boolean {
        const pos = enemy.getPosition();
        const dx = Math.abs(playerPos.x - pos.x);
        const dy = Math.abs(playerPos.y - pos.y);
        
        if (dx > 6 || dy > 6) return false;

        const path = this.getPath(pos, playerPos);
        return path.every(p => enemy.getTileAt(p.x, p.y) === TileType.Empty);
    }

    private getPath(start: Position, end: Position): Position[] {
        const points: Position[] = [];
        let x1 = start.x;
        let y1 = start.y;
        const x2 = end.x;
        const y2 = end.y;
        
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = x1 < x2 ? 1 : -1;
        const sy = y1 < y2 ? 1 : -1;
        let err = dx - dy;

        while (true) {
            points.push({x: x1, y: y1});
            if (x1 === x2 && y1 === y2) break;
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y1 += sy;
            }
        }

        return points;
    }
}