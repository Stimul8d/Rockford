import { GameScene } from "./scenes/GameScene";

class Game {
    constructor() {
        document.addEventListener('DOMContentLoaded', () => this.init());
    }

    private init() {
        const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
        new GameScene(canvas);
    }
}

new Game();