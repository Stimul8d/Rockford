import { Grid, TileType } from "./Grid";

export class Rockford {
    private x: number;
    private y: number;
    private score: number = 0;
    private gemsCollected: number = 0;
    private levelComplete = false;
    private readonly CELL_SIZE = 20;

    constructor(
        private ctx: CanvasRenderingContext2D, 
        startX: number, 
        startY: number, 
        private grid: Grid,
        private requiredGems: number
    ) {
        this.x = startX;
        this.y = startY;
    }

    moveTo(newX: number, newY: number) {
        const tileType = this.grid.getTileAt(newX, newY);
                
        if (tileType === TileType.Gem) {
            this.score += 100;
            this.gemsCollected++;
            
            if (this.gemsCollected === this.requiredGems) {
                this.grid.setTileAt(38, 1, TileType.Exit);
            }
        } else if (tileType === TileType.Exit) {
            this.levelComplete = true;
        }
        
        if (tileType === TileType.Dirt || tileType === TileType.Gem) {
            this.grid.setTileAt(newX, newY, TileType.Empty);
        }

        this.x = newX;
        this.y = newY;
    }

    draw() {
        this.ctx.fillStyle = '#F00';
        this.ctx.fillRect(
            this.x * this.CELL_SIZE, 
            this.y * this.CELL_SIZE, 
            this.CELL_SIZE, 
            this.CELL_SIZE
        );
    }

    reset(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.score = 0;
        this.gemsCollected = 0;
        this.levelComplete = false;
    }

    getPosition(): { x: number, y: number } {
        return { x: this.x, y: this.y };
    }

    getScore(): number {
        return this.score;
    }

    getGemsCollected(): number {
        return this.gemsCollected;
    }

    isLevelComplete(): boolean {
        return this.levelComplete;
    }
}