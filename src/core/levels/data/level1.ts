import { Level } from '../types';
import { TileType } from '../../../game/Grid';

export function createLevel1Layout(): TileType[][] {
    const layout: TileType[][] = Array(40).fill(null).map(() => 
        Array(22).fill(TileType.Dirt)
    );

    // Outer walls
    for (let x = 0; x < 40; x++) {
        layout[x][0] = TileType.Wall;
        layout[x][21] = TileType.Wall;
    }
    for (let y = 0; y < 22; y++) {
        layout[0][y] = TileType.Wall;
        layout[39][y] = TileType.Wall;
    }

    // Prison rooms
    const prisonRooms = [
        {x: 5, y: 10, w: 4, h: 4},
        {x: 30, y: 5, w: 4, h: 4},
        {x: 22, y: 15, w: 5, h: 3}
    ];

    prisonRooms.forEach(({x, y, w, h}) => {
        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                if (i === x || i === x + w - 1 || j === y || j === y + h - 1) {
                    layout[i][j] = TileType.Wall;
                } else {
                    layout[i][j] = TileType.Empty;
                }
            }
        }
        layout[x + Math.floor(w/2)][y] = TileType.Dirt;
    });

    // Main structural walls
    for (let y = 1; y < 21; y++) {
        if (y !== 5 && y !== 12 && y !== 17) {
            layout[15][y] = TileType.Wall;
            layout[25][y] = TileType.Wall;
        }
    }

    // Boulder setups
    const boulderFormations = [
        // Nasty trap above first gem
        {x: 8, y: 2}, {x: 9, y: 2}, {x: 10, y: 2},
        
        // Cascade wall
        {x: 20, y: 8}, {x: 20, y: 9}, {x: 20, y: 10},
        {x: 21, y: 8}, {x: 21, y: 9}, {x: 21, y: 10},
        
        // Bottom right death trap
        {x: 30, y: 15}, {x: 31, y: 15}, {x: 32, y: 15},
        {x: 30, y: 16}, {x: 31, y: 16}, {x: 32, y: 16},
        {x: 30, y: 17}, {x: 31, y: 17}, {x: 32, y: 17}
    ];

    boulderFormations.forEach(({x, y}) => {
        layout[x][y] = TileType.Boulder;
    });

    // Empty caverns
    const caverns = [
        {x: 3, y: 15, w: 5, h: 4},
        {x: 33, y: 8, w: 4, h: 6}
    ];

    caverns.forEach(({x, y, w, h}) => {
        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                layout[i][j] = TileType.Empty;
            }
        }
    });

    // Gems in tricky spots
    const gems = [
        {x: 9, y: 4},
        {x: 19, y: 5},
        {x: 35, y: 12},
        {x: 4, y: 18}
    ];

    gems.forEach(({x, y}) => {
        layout[x][y] = TileType.Gem;
    });

    // Clear starting area
    layout[1][1] = TileType.Empty;
    layout[2][1] = TileType.Empty;
    layout[1][2] = TileType.Empty;

    return layout;
}

export const level1: Level = {
    id: 1,
    environment: 'CAVE',
    layout: createLevel1Layout(),
    requiredGems: 4,
    startPosition: { x: 1, y: 1 }
};