import { Scene } from "phaser";

class PreloadScene extends Scene {
  constructor() {
    super("preloadScene");
  }
  preload() {
    this.load.image("StartMessage", "Assets/startMessage.png");
  }

  create() {
    this.add.image(400, 300, "StartMessage");
    this.input.on("pointerdown", () => this.scene.start("stage1"));
  }
}

export default PreloadScene;
