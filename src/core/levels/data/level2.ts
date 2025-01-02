import { Level } from '../types';
import { TileType } from '../../../game/Grid';

const createLayout = () => {
    const layout: TileType[][] = Array(40).fill(null).map(() => 
        Array(22).fill(TileType.Empty)
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

    // Scattered rocks and dirt
    for (let i = 0; i < 30; i++) {
        const x = 1 + Math.floor(Math.random() * 38);
        const y = 1 + Math.floor(Math.random() * 20);
        layout[x][y] = TileType.Wall;
    }

    // A bit of dirt
    for (let i = 0; i < 40; i++) {
        const x = 1 + Math.floor(Math.random() * 38);
        const y = 1 + Math.floor(Math.random() * 20);
        if (layout[x][y] === TileType.Empty) {
            layout[x][y] = TileType.Dirt;
        }
    }

    // 6 gems in space
    const gems = [
        {x: 5, y: 5},
        {x: 35, y: 5},
        {x: 20, y: 10},
        {x: 10, y: 15},
        {x: 30, y: 15},
        {x: 20, y: 20}
    ];

    gems.forEach(({x, y}) => {
        layout[x][y] = TileType.Gem;
    });

    // Make sure start position is clear
    layout[1][1] = TileType.Empty;

    return layout;
};

export const level2: Level = {
    id: 2,
    environment: 'SPACE',
    layout: createLayout(),
    requiredGems: 6,
    startPosition: { x: 1, y: 1 }
};