import { Scene } from "phaser";

class EndingScene extends Scene {
  constructor() {
    super("EndingScene");
  }
  preload() {
    this.load.image("GG", "Assets/endingscreen.png");
    this.load.audio(
      "gg",
      "Assets/mixkit-small-group-cheer-and-applause-518.wav"
    );
  }

  create() {
    this.gg = this.sound.add("gg");
    this.add.image(400, 300, "GG");
    this.gg.play();
  }
}

export default EndingScene;
