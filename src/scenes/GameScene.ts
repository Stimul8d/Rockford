import { Grid, TileType } from "../game/Grid";
import { EntityManager } from "../game/EntityManager";
import { LevelManager } from "../core/levels/LevelManager";
import { PhysicsEngine } from "../game/PhysicsEngine";

export class GameScene {
    private grid: Grid;
    private entities: EntityManager;
    private levelManager: LevelManager;
    private physics: PhysicsEngine;
    private lastUpdate = 0;
    private readonly PHYSICS_STEP = 150;
    private currentLevelId = 1;

    constructor(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d')!;
        this.grid = new Grid(canvas);
        this.entities = new EntityManager(ctx, this.grid);
        this.levelManager = new LevelManager();
        this.physics = new PhysicsEngine();
        
        this.loadLevel(this.currentLevelId);
        this.setupControls();
        this.startGameLoop();
    }

    private loadLevel(levelId: number) {
        const level = this.levelManager.loadLevel(levelId);
        this.grid.loadLevel(level.layout);
        
        this.entities.reset();
        this.entities.spawnPlayer(level.startPosition.x, level.startPosition.y, level.requiredGems);
        this.entities.spawnEnemies();
        
        this.currentLevelId = levelId;
    }

    private setupControls() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                if (this.entities.isPlayerDead()) {
                    this.loadLevel(this.currentLevelId);
                } else if (this.entities.getPlayerData().isComplete) {
                    const nextLevel = this.levelManager.nextLevel();
                    if (nextLevel) this.loadLevel(nextLevel.id);
                }
                return;
            }

            this.entities.handleInput(e);
        });
    }

    private startGameLoop() {
        const update = (timestamp: number) => {
            if (!this.entities.isPlayerDead() && 
                !this.entities.getPlayerData().isComplete &&
                timestamp - this.lastUpdate >= this.PHYSICS_STEP) {
                
                const playerData = this.entities.getPlayerData();
                const { changes, playerCrushed } = this.physics.update(
                    this.grid.getTiles(),
                    playerData.position
                );

                changes.forEach(change => {
                    this.grid.moveTile(change.from.x, change.from.y, change.to.x, change.to.y);
                });

                if (playerCrushed || this.entities.update(timestamp)) {
                    this.drawDeathScreen();
                }

                this.lastUpdate = timestamp;
            }

            this.draw();
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    }

    private draw() {
        this.grid.draw();
        this.entities.draw();
        this.drawGameState();
    }

    private drawGameState() {
        const ctx = this.grid.getContext();
        const playerData = this.entities.getPlayerData();
        const level = this.levelManager.getCurrentLevel()!;

        ctx.fillStyle = '#fff';
        ctx.font = '20px monospace';
        ctx.fillText(`Score: ${playerData.score}`, 10, 30);
        ctx.fillText(`Gems: ${playerData.gems}/${level.requiredGems}`, 10, 60);

        if (this.entities.isPlayerDead()) {
            this.drawDeathScreen();
        } else if (playerData.isComplete) {
            this.drawVictoryScreen();
        }
    }

    private drawDeathScreen() {
        const ctx = this.grid.getContext();
        ctx.fillStyle = '#f00';
        ctx.font = '40px monospace';
        ctx.fillText('Crushed!', 300, 200);
        ctx.font = '20px monospace';
        ctx.fillText('Press Space to try again', 300, 240);
    }

    private drawVictoryScreen() {
        const ctx = this.grid.getContext();
        ctx.fillStyle = '#fff';
        ctx.font = '40px monospace';
        ctx.fillText('Level Complete!', 300, 200);
        ctx.font = '20px monospace';
        ctx.fillText('Press Space for next level', 300, 240);
    }
}