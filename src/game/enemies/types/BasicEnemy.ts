import { Enemy } from '../Enemy';
import { Grid } from '../../Grid';
import { TrappedBehaviour } from '../behaviours/TrappedBehaviour';

export class BasicEnemy extends Enemy {
    constructor(
        ctx: CanvasRenderingContext2D,
        startX: number,
        startY: number,
        grid: Grid
    ) {
        super(ctx, startX, startY, grid, new TrappedBehaviour());
    }
}