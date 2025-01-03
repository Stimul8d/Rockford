import { State, StateType } from './State';
import { StateManager } from './StateManager';

export class CompleteState implements State {
    private totalScore = 0;
    private gemsScore = 0;
    private timeBonus = 0;
    private showingScore = false;
    private scoreStart = 0;
    private readonly SCORE_DELAY = 1000;

    constructor(private stateManager: StateManager) {}

    enter(): void {
        this.scoreStart = performance.now();
        this.showingScore = false;

        const data = this.stateManager.getGameData();
        
        // Each gem is worth 10 points
        this.gemsScore = data.gemsCollected * 10;
        
        // Time bonus is 15 points per remaining second
        this.timeBonus = Math.floor(data.timeRemaining) * 15;
        
        this.totalScore = this.gemsScore + this.timeBonus;
    }

    exit(): void {}

    update(timestamp: number): void {
        if (!this.showingScore && timestamp - this.scoreStart > this.SCORE_DELAY) {
            this.showingScore = true;
        }
    }

    handleInput(e: KeyboardEvent): void {
        if (e.code === 'Space' && this.showingScore) {
            this.stateManager.switchState(StateType.Playing);
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = '#fff';
        ctx.font = '40px monospace';
        ctx.fillText('Level Complete!', 300, 160);
        
        if (this.showingScore) {
            ctx.font = '20px monospace';
            ctx.fillText(`Gems: ${this.gemsScore}`, 300, 220);
            ctx.fillText(`Time Bonus: ${this.timeBonus}`, 300, 250);
            ctx.fillText(`Total Score: ${this.totalScore}`, 300, 290);
            ctx.fillText('Press Space for next level', 300, 330);
        }
    }
}