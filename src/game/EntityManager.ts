import { Grid, TileType } from './Grid';
import { Rockford } from './Rockford';
import { Enemy } from './Enemy';

export class EntityManager {
    private rockford: Rockford;
    private enemies: Enemy[] = [];
    private isDead = false;

    constructor(
        private ctx: CanvasRenderingContext2D,
        private grid: Grid
    ) {}

    handleInput(e: KeyboardEvent) {
        if (this.isDead || !this.rockford) return;

        let newX = this.rockford.getPosition().x;
        let newY = this.rockford.getPosition().y;

        switch (e.key) {
            case 'ArrowLeft': newX--; break;
            case 'ArrowRight': newX++; break;
            case 'ArrowUp': newY--; break;
            case 'ArrowDown': newY++; break;
            default: return;
        }

        const tile = this.grid.getTileAt(newX, newY);
        if (tile !== TileType.Wall && tile !== TileType.Boulder) {
            this.rockford.moveTo(newX, newY);
        }
    }

    spawnPlayer(x: number, y: number, requiredGems: number) {
        if (!this.rockford) {
            this.rockford = new Rockford(this.ctx, x, y, this.grid, requiredGems);
        } else {
            this.rockford.reset(x, y);
        }
    }

    spawnEnemies() {
        this.enemies = [
            new Enemy(this.ctx, 6, 11, this.grid, true),
            new Enemy(this.ctx, 31, 6, this.grid, true),
            new Enemy(this.ctx, 24, 16, this.grid, true)
        ];
    }

    reset() {
        this.isDead = false;
        this.enemies = [];
    }

    update(timestamp: number): boolean {
        if (this.isDead) return false;

        const playerPos = this.rockford.getPosition();
        
        for (const enemy of this.enemies) {
            if (enemy.update(playerPos, timestamp)) {
                this.isDead = true;
                return true;
            }
        }

        return false;
    }

    draw() {
        if (!this.isDead) {
            this.rockford.draw();
        }
        this.enemies.forEach(enemy => enemy.draw());
    }

    getPlayerData() {
        return {
            position: this.rockford.getPosition(),
            score: this.rockford.getScore(),
            gems: this.rockford.getGemsCollected(),
            isComplete: this.rockford.isLevelComplete()
        };
    }

    isPlayerDead(): boolean {
        return this.isDead;
    }
}