import { Enemy } from '../Enemy';
import { Position } from '../../types';
import { Behaviour } from './Behaviour';
import { TileType } from '../../Grid';

export class HuntBehaviour implements Behaviour {
    private lastMove = 0;
    private readonly MOVE_DELAY = 300;
    private readonly AGGRO_RANGE = 6;  // How many tiles away they can spot you
    private isAggro = false;  // Once they've seen you, they stay aggressive

    getColour(): string {
        return '#FF0000';
    }

    update(enemy: Enemy, playerPos: Position, timestamp: number): void {
        if (timestamp - this.lastMove < this.MOVE_DELAY) return;

        const pos = enemy.getPosition();

        // Once aggroed, always hunt
        if (!this.isAggro) {
            this.isAggro = this.canSeePlayer(enemy, pos, playerPos);
            if (!this.isAggro) return;
        }

        const dx = Math.sign(playerPos.x - pos.x);
        const dy = Math.sign(playerPos.y - pos.y);

        if (dx !== 0 && enemy.canMoveTo(pos.x + dx, pos.y)) {
            enemy.moveTo(pos.x + dx, pos.y);
        } else if (dy !== 0 && enemy.canMoveTo(pos.x, pos.y + dy)) {
            enemy.moveTo(pos.x, pos.y + dy);
        }

        this.lastMove = timestamp;
    }

    private canSeePlayer(enemy: Enemy, enemyPos: Position, playerPos: Position): boolean {
        // Check range first
        const dx = Math.abs(playerPos.x - enemyPos.x);
        const dy = Math.abs(playerPos.y - enemyPos.y);
        if (dx > this.AGGRO_RANGE || dy > this.AGGRO_RANGE) return false;

        // Now check if there's a clear line of sight
        const path = this.getLine(enemyPos, playerPos);
        return path.every(pos => {
            const tile = enemy.getTileAt(pos.x, pos.y);
            return tile === TileType.Empty;
        });
    }

    private getLine(start: Position, end: Position): Position[] {
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