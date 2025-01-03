import { State, StateType } from './State';
import { StateManager } from './StateManager';

export class TimeUpState implements State {
    private showMessage = true;
    private lastToggle = 0;
    private readonly FLASH_RATE = 500;  // ms between flashes

    constructor(private stateManager: StateManager) {}

    enter(): void {
        this.showMessage = true;
        this.lastToggle = 0;
    }

    exit(): void {}

    update(timestamp: number): void {
        if (timestamp - this.lastToggle > this.FLASH_RATE) {
            this.showMessage = !this.showMessage;
            this.lastToggle = timestamp;
        }
    }

    handleInput(e: KeyboardEvent): void {
        if (e.code === 'Space') {
            // Restart level
            this.stateManager.switchState(StateType.Playing);
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.showMessage) return;

        ctx.fillStyle = '#f00';
        ctx.font = '40px monospace';
        ctx.fillText('Time Up!', 300, 200);
        ctx.font = '20px monospace';
        ctx.fillText('Press Space to try again', 300, 240);
    }
}