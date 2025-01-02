import { TileType } from './Grid';

type Position = {
    x: number;
    y: number;
};

export class PhysicsEngine {
    private readonly WIDTH = 40;
    private readonly HEIGHT = 22;

    update(grid: TileType[][], playerPos: Position): { 
        changes: { from: Position, to: Position }[],
        playerCrushed: boolean 
    } {
        const changes: { from: Position, to: Position }[] = [];
        let playerCrushed = false;

        // Bottom to top, right to left for proper cascade
        for (let y = this.HEIGHT - 2; y >= 0; y--) {
            for (let x = this.WIDTH - 1; x >= 0; x--) {
                if (grid[x][y] === TileType.Boulder) {
                    const move = this.checkBoulderMove(grid, {x, y}, playerPos);
                    if (move) {
                        changes.push({
                            from: {x, y},
                            to: move.newPos
                        });
                        if (move.crushesPlayer) {
                            playerCrushed = true;
                        }
                    }
                }
            }
        }

        return { changes, playerCrushed };
    }

    private checkBoulderMove(
        grid: TileType[][], 
        boulder: Position,
        player: Position
    ): { newPos: Position, crushesPlayer: boolean } | null {
        const below = { x: boulder.x, y: boulder.y + 1 };

        // Don't fall if player is directly below
        if (below.x === player.x && below.y === player.y) {
            return null;
        }

        // Can fall straight down?
        if (grid[below.x][below.y] === TileType.Empty) {
            return {
                newPos: below,
                crushesPlayer: below.y + 1 === player.y && below.x === player.x
            };
        }

        // Something's blocking downward movement
        if (grid[below.x][below.y] === TileType.Boulder || 
            grid[below.x][below.y] === TileType.Wall) {
            
            // Try slide right
            if (this.canSlide(grid, boulder, player, 1)) {
                return {
                    newPos: { x: boulder.x + 1, y: boulder.y },
                    crushesPlayer: false
                };
            }
            
            // Try slide left
            if (this.canSlide(grid, boulder, player, -1)) {
                return {
                    newPos: { x: boulder.x - 1, y: boulder.y },
                    crushesPlayer: false
                };
            }
        }

        return null;
    }

    private canSlide(grid: TileType[][], pos: Position, player: Position, direction: number): boolean {
        const newX = pos.x + direction;
        
        // Check bounds
        if (newX < 0 || newX >= this.WIDTH) return false;
        
        // Check if slide path is clear (both current level and below)
        return grid[newX][pos.y] === TileType.Empty && 
               grid[newX][pos.y + 1] === TileType.Empty &&
               !(newX === player.x && pos.y === player.y);
    }
}