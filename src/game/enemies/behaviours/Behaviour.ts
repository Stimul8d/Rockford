import { Enemy } from '../Enemy';
import { Position } from '../../types';

export interface Behaviour {
    update(enemy: Enemy, playerPos: Position, timestamp: number): void;
    getColour(): string;
}