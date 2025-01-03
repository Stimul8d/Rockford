import { State, StateType } from './State';
import { StateManager } from './StateManager';

export class PlayingState implements State {
    private timeRemaining: number = 150;
    private lastTimestamp: number | null = null;

    constructor(private stateManager: StateManager) {}

    enter(): void {
        const data = this.stateManager.getGameData();
        this.timeRemaining = data.timeRemaining;
        this.lastTimestamp = null;
    }

    exit(): void {
        this.stateManager.updateGameData({
            timeRemaining: this.timeRemaining
        });
    }

    update(timestamp: number): void {
        if (!this.lastTimestamp) {
            this.lastTimestamp = timestamp;
            return;
        }

        const elapsed = (timestamp - this.lastTimestamp) / 1000;
        this.timeRemaining -= elapsed;
        this.lastTimestamp = timestamp;

        if (this.timeRemaining <= 0) {
            this.stateManager.switchState(StateType.TimeUp);
        }

        // Keep state manager up to date
        this.stateManager.updateGameData({
            timeRemaining: this.timeRemaining
        });
    }

    collectGem(): void {
        const data = this.stateManager.getGameData();
        this.stateManager.updateGameData({
            score: data.score + 10,
            gemsCollected: data.gemsCollected + 1
        });
    }

    handleInput(e: KeyboardEvent): void {
        if (e.code === 'Escape') {
            this.stateManager.switchState(StateType.Paused);
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const data = this.stateManager.getGameData();
        ctx.fillStyle = '#fff';
        ctx.font = '20px monospace';
        ctx.fillText(`Time: ${Math.ceil(this.timeRemaining)}`, 10, 90);
        ctx.fillText(`Score: ${data.score}`, 10, 30);
        ctx.fillText(`Gems: ${data.gemsCollected}/${data.totalGems}`, 10, 60);
    }
}