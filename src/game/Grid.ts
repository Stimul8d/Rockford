export enum TileType {
    Empty,
    Wall,
    Dirt,
    Gem,
    Exit,
    Boulder
}

export class Grid {
    private tiles: TileType[][] = [];
    private ctx: CanvasRenderingContext2D;
    readonly WIDTH = 40;
    readonly HEIGHT = 22;
    readonly CELL_SIZE = 20;
    
    constructor(canvas: HTMLCanvasElement) {
        canvas.width = this.WIDTH * this.CELL_SIZE;
        canvas.height = this.HEIGHT * this.CELL_SIZE;
        this.ctx = canvas.getContext('2d')!;
        this.initGrid();
    }

    getContext() {
        return this.ctx;
    }

    loadLevel(layout: TileType[][]) {
        this.tiles = layout.map(row => [...row]);
    }

    getTiles(): TileType[][] {
        return this.tiles;
    }

    getTileAt(x: number, y: number): TileType {
        if (x < 0 || x >= this.WIDTH || y < 0 || y >= this.HEIGHT) return TileType.Wall;
        return this.tiles[x][y];
    }

    setTileAt(x: number, y: number, type: TileType) {
        if (x >= 0 && x < this.WIDTH && y >= 0 && y < this.HEIGHT) {
            this.tiles[x][y] = type;
        }
    }

    moveTile(fromX: number, fromY: number, toX: number, toY: number) {
        if (!this.isValidPosition(fromX, fromY) || !this.isValidPosition(toX, toY)) return;
        const tile = this.tiles[fromX][fromY];
        this.tiles[toX][toY] = tile;
        this.tiles[fromX][fromY] = TileType.Empty;
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.WIDTH * this.CELL_SIZE, this.HEIGHT * this.CELL_SIZE);

        for (let x = 0; x < this.WIDTH; x++) {
            for (let y = 0; y < this.HEIGHT; y++) {
                switch(this.tiles[x][y]) {
                    case TileType.Wall:
                        this.ctx.fillStyle = '#333';
                        this.ctx.fillRect(
                            x * this.CELL_SIZE, 
                            y * this.CELL_SIZE, 
                            this.CELL_SIZE, 
                            this.CELL_SIZE
                        );
                        break;
                    
                    case TileType.Dirt:
                        this.ctx.fillStyle = '#8B4513';
                        this.ctx.fillRect(
                            x * this.CELL_SIZE + 2, 
                            y * this.CELL_SIZE + 2, 
                            this.CELL_SIZE - 4, 
                            this.CELL_SIZE - 4
                        );
                        break;

                    case TileType.Gem:
                        this.ctx.fillStyle = '#00FFFF';
                        const midX = x * this.CELL_SIZE + (this.CELL_SIZE / 2);
                        const midY = y * this.CELL_SIZE + (this.CELL_SIZE / 2);
                        const size = this.CELL_SIZE * 0.4;
                        
                        this.ctx.beginPath();
                        this.ctx.moveTo(midX, midY - size);
                        this.ctx.lineTo(midX + size, midY);
                        this.ctx.lineTo(midX, midY + size);
                        this.ctx.lineTo(midX - size, midY);
                        this.ctx.closePath();
                        this.ctx.fill();
                        break;

                    case TileType.Exit:
                        this.ctx.fillStyle = '#0F0';
                        this.ctx.fillRect(
                            x * this.CELL_SIZE + 4, 
                            y * this.CELL_SIZE + 4, 
                            this.CELL_SIZE - 8, 
                            this.CELL_SIZE - 8
                        );
                        break;

                    case TileType.Boulder:
                        this.ctx.fillStyle = '#888';
                        this.ctx.beginPath();
                        this.ctx.arc(
                            x * this.CELL_SIZE + this.CELL_SIZE/2,
                            y * this.CELL_SIZE + this.CELL_SIZE/2,
                            this.CELL_SIZE/2 - 2,
                            0,
                            Math.PI * 2
                        );
                        this.ctx.fill();
                        break;
                }
            }
        }
    }

    private isValidPosition(x: number, y: number): boolean {
        return x >= 0 && x < this.WIDTH && y >= 0 && y < this.HEIGHT;
    }

    private initGrid() {
        this.tiles = Array(this.WIDTH).fill(null).map(() => 
            Array(this.HEIGHT).fill(TileType.Empty)
        );
    }
}