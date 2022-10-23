import { Scene } from "phaser";
import stage1 from "./index";

class GameOverScene extends Scene {
  constructor() {
    super("GameOverScene");
  }
  preload() {
    this.load.image("GO", "Assets/gameover.png");
  }

  create() {
    this.add.image(400, 300, "GO");
    this.input.on("pointerdown", () => this.scene.start("preloadScene"));
  }
}

export default GameOverScene;
