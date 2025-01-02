import { Scene } from "@babylonjs/core/scene";
import { AdvancedDynamicTexture, TextBlock, Button, StackPanel } from "@babylonjs/gui";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";

export class MainMenu {
    constructor(private scene: Scene, private onPlayClick: () => void) {
        const camera = new ArcRotateCamera("camera", 0, Math.PI / 2, 10, Vector3.Zero(), scene);
        camera.setPosition(new Vector3(0, 0, -10));
        
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        
        const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        
        const panel = new StackPanel();
        panel.width = "400px";
        panel.verticalAlignment = StackPanel.VERTICAL_ALIGNMENT_CENTER;
        ui.addControl(panel);

        const title = new TextBlock();
        title.text = "ROCKFORD";
        title.height = "100px";
        title.fontSize = 72;
        title.color = "#FFD700";
        panel.addControl(title);

        const playButton = Button.CreateSimpleButton("play", "PLAY");
        playButton.width = "200px";
        playButton.height = "60px";
        playButton.color = "white";
        playButton.background = "#FFD700";
        playButton.onPointerUpObservable.add(() => this.onPlayClick());
        panel.addControl(playButton);
    }
}
