import { State, StateType } from './State';
import { StateManager } from './StateManager';

export class DeadState implements State {
    private fadeStart: number = 0;
    private readonly FADE_DURATION = 1000;

    constructor(private stateManager: StateManager) {}

    enter(): void {
        this.fadeStart = performance.now();
    }

    exit(): void {}

    update(timestamp: number): void {}

    handleInput(e: KeyboardEvent): void {
        if (e.code === 'Space') {
            this.stateManager.switchState(StateType.Playing);
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = '#f00';
        ctx.font = '40px monospace';
        ctx.fillText('Crushed!', 300, 200);
        ctx.font = '20px monospace';
        ctx.fillText('Press Space to try again', 300, 240);
    }
}