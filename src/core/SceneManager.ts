import { GameScene } from "../scenes/GameScene";

type SceneType = 'MENU' | 'GAME';

export class SceneManager {
    private currentScene: GameScene | null = null;

    constructor(private canvas: HTMLCanvasElement) {}

    async switchToScene(type: SceneType): Promise<GameScene> {
        switch(type) {
            case 'GAME':
                this.currentScene = new GameScene(this.canvas);
                break;
        }

        return this.currentScene;
    }
}
