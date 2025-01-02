import { Level } from './types';
import { level1, createLevel1Layout } from './data/level1';
import { level2 } from './data/level2';

export class LevelManager {
    private currentLevel: Level | null = null;
    private levels: Map<number, Level> = new Map();

    constructor() {
        this.loadLevels();
    }

    private loadLevels() {
        this.levels.set(level1.id, level1);
        this.levels.set(level2.id, level2);
    }

    loadLevel(id: number): Level {
        const level = this.levels.get(id);
        if (!level) throw new Error(`Level ${id} not found`);
        
        // Create fresh layout each time
        const freshLevel = {
            ...level,
            layout: id === 1 ? createLevel1Layout() : level.layout
        };
        
        this.currentLevel = freshLevel;
        return freshLevel;
    }

    getCurrentLevel(): Level | null {
        return this.currentLevel;
    }

    nextLevel(): Level | null {
        if (!this.currentLevel) return null;
        const nextId = this.currentLevel.id + 1;
        const nextLevel = this.levels.get(nextId);
        if (nextLevel) {
            this.currentLevel = nextLevel;
            return nextLevel;
        }
        return null;
    }
}