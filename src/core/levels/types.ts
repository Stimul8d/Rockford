import { TileType } from "../../game/Grid";

export type Environment = 'CAVE' | 'SPACE' | 'UNDERWATER';

export interface Level {
    id: number;
    environment: Environment;
    layout: TileType[][];
    requiredGems: number;
    timeLimit?: number;
    startPosition: {
        x: number;
        y: number;
    };
}