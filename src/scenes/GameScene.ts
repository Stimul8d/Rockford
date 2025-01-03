import { Grid } from "../game/Grid";
import { EntityManager } from "../game/EntityManager";
import { LevelManager } from "../core/levels/LevelManager";
import { PhysicsEngine } from "../game/PhysicsEngine";
import { StateManager } from "../game/states/StateManager";
import { StateType } from "../game/states/State";
import { PlayingState } from "../game/states/PlayingState";

export class GameScene {
    private grid: Grid;
    private entities: EntityManager;
    private levelManager: LevelManager;
    private physics: PhysicsEngine;
    private stateManager: StateManager;
    private currentLevelId = 1;

    constructor(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d')!;
        
        this.stateManager = new StateManager();
        this.grid = new Grid(canvas);
        this.entities = new EntityManager(ctx, this.grid, this.stateManager);
        this.levelManager = new LevelManager();
        this.physics = new PhysicsEngine();
        
        this.loadLevel(this.currentLevelId);
        this.setupControls();
        this.startGameLoop();
    }

    private loadLevel(levelId: number) {
        const level = this.levelManager.loadLevel(levelId);
        this.grid.loadLevel(level.layout);
        
        this.stateManager.resetLevel();
        this.entities.reset();
        this.entities.spawnPlayer(
            level.startPosition.x, 
            level.startPosition.y, 
            level.requiredGems
        );
        this.entities.spawnEnemies();
        
        this.currentLevelId = levelId;
        this.stateManager.switchState(StateType.Playing);
    }

    private setupControls() {
        document.addEventListener('keydown', (e) => {
            const state = this.stateManager.getCurrentState();
            if (state instanceof PlayingState) {
                this.entities.handleInput(e);
            }
            if (state) {
                state.handleInput(e);
            }
        });
    }

    private startGameLoop() {
        const update = (timestamp: number) => {
            const state = this.stateManager.getCurrentState();
            if (!state) return;

            state.update(timestamp);

            if (this.stateManager.getStateType() === StateType.Playing) {
                const playerPos = this.entities.getPlayerData().position;
                const { changes, playerCrushed } = this.physics.update(
                    this.grid.getTiles(),
                    playerPos
                );

                changes.forEach(change => {
                    this.grid.moveTile(change.from.x, change.from.y, change.to.x, change.to.y);
                });

                if (playerCrushed || this.entities.update(timestamp)) {
                    this.stateManager.switchState(StateType.Dead);
                }

                if (this.entities.getPlayerData().isComplete) {
                    this.stateManager.switchState(StateType.Complete);
                }
            }

            this.draw(timestamp);
            requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
    }

    private draw(timestamp: number) {
        this.grid.draw();
        this.entities.draw();
        
        const state = this.stateManager.getCurrentState();
        if (state) {
            state.draw(this.grid.getContext());
        }
    }
}