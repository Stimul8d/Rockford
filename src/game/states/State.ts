import { Position } from '../types';

export interface State {
    enter(): void;
    exit(): void;
    update(timestamp: number): void;
    handleInput(e: KeyboardEvent): void;
    draw(ctx: CanvasRenderingContext2D): void;
}

export enum StateType {
    Playing,
    Paused,
    TimeUp,
    Dead,
    Complete
}