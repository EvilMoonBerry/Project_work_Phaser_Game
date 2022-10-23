import Phaser from "phaser";
import "./styles.css";
import preloadScene from "./preloadScene";
import GameOverScene from "./gameover";
import EndingScene from "./EndingScene";
/*Credits:
Sound:
How to play sound effects
https://www.youtube.com/watch?v=SRqKOccMWbc 
bounce of boss 
Followed bomb movement for my boss monster
https://phaser.io/tutorials/making-your-first-phaser-3-game/part10 
scene change
How to change scene
https://www.youtube.com/watch?v=-BSz_FeWfkY
How to shoot a bullet
How to make a bullet and shoot the bullet from the same location as the spaceship. How to make an object follow mouse. 
https://github.com/photonstorm/phaser3-examples/blob/master/public/src/physics/arcade/bullets%20group.js
week 7 source code
All the sound clips are downloaded from https://mixkit.co/free-sound-effects/.
 */
const shipOptions = {
  shipSpeed: 325
};
//this part starting  is from here https://github.com/photonstorm/phaser3-examples/blob/master/public/src/physics/arcade/bullets%20group.js
class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "bullet");
  }

  fire(x, y) {
    this.body.reset(x, y);

    this.setActive(true);
    this.setVisible(true);

    this.setVelocityY(-300);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.y <= -32) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}

class Bullets extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 5,
      key: "bullet",
      active: false,
      visible: false,
      classType: Bullet
    });
  }

  fireBullet(x, y) {
    let bullet = this.getFirstDead(false);

    if (bullet) {
      bullet.fire(x, y);
    }
  }
}
// ending here
//main game starts from here
class Game extends Phaser.Scene {
  constructor() {
    super("stage1");
    this.score = 0;
    this.HP = 150;
    this.bullets;
    this.ship;
    this.bossnumber = 0;
    this.bossHP = 15;
  }

  preload() {
    //Loadin all the images
    this.load.image("bullet", "Assets/bullet.png");
    this.load.image("gem1", "Assets/gem1.png");
    this.load.image("gem2", "Assets/gem2.png");
    this.load.image("ship", "Assets/ship.png");
    this.load.image("enemy", "Assets/enemy.png");
    this.load.image("enemy2", "Assets/enemy2.png");
    this.load.image("full", "Assets/full.png");
    this.load.image("one", "Assets/onehit.png");
    this.load.image("two", "Assets/twohits.png");
    this.load.image("boss", "Assets/boss.png");

    //Loading audio
    this.load.audio("pew", "Assets/mixkit-arrow-whoosh-1491.wav");
    this.load.audio("go", "Assets/mixkit-arcade-retro-game-over-213.wav");
    this.load.audio("gem", "Assets/mixkit-retro-game-notification-212.wav");
  }

  create() {
    //These are from https://github.com/photonstorm/phaser3-examples/blob/master/public/src/physics/arcade/bullets%20group.js
    this.bullets = new Bullets(this);
    this.ship = this.physics.add.sprite(400, 500, "ship");
    //Ends here

    this.enemyGroup1 = this.physics.add.group({});
    this.enemyGroup2 = this.physics.add.group({});
    this.gem1Group = this.physics.add.group({});
    this.gem2Group = this.physics.add.group({});
    this.boss = this.physics.add.group();

    this.pew = this.sound.add("pew");
    this.go = this.sound.add("go");
    this.gem = this.sound.add("gem");
    //this is from https://github.com/photonstorm/phaser3-examples/blob/master/public/src/physics/arcade/bullets%20group.js
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.on("pointermove", (pointer) => {
      this.ship.x = pointer.x;
    });
    //ends here
    var spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    //this is from https://github.com/photonstorm/phaser3-examples/blob/master/public/src/physics/arcade/bullets%20group.js
    spaceBar.on("down", (listener) => {
      this.bullets.fireBullet(this.ship.x, this.ship.y);
      //ends here
      this.pew.play();
    });

    this.triggerTimer = this.time.addEvent({
      callback: this.addEnemies,
      callbackScope: this,
      delay: 700,
      loop: true
    });
    //Overlaps
    this.physics.add.overlap(
      this.ship,
      this.enemyGroup1,
      this.takeDamage,
      null,
      this
    );
    this.physics.add.overlap(
      this.ship,
      this.enemyGroup2,
      this.takeDamage,
      null,
      this
    );
    this.physics.add.overlap(
      this.bullets,
      this.enemyGroup1,
      this.getPoints,
      null,
      this
    );
    this.physics.add.overlap(
      this.bullets,
      this.enemyGroup2,
      this.getPoints2,
      null,
      this
    );

    this.physics.add.overlap(
      this.bullets,
      this.boss,
      this.shootBoss,
      null,
      this
    );

    this.physics.add.overlap(
      this.ship,
      this.gem1Group,
      this.collectGems1,
      null,
      this
    );
    this.physics.add.overlap(
      this.ship,
      this.gem2Group,
      this.collectGems2,
      null,
      this
    );

    //Adding visible HP bar and score
    this.scoreText = this.add.text(32, 3, "0", {
      fontSize: "30px",
      fill: "#ffffff"
    });
    if (this.HP === 150) {
      this.add.image(100, 50, "full");
    }
  }
  //Addin falling enemies and gems
  addEnemies() {
    if (Phaser.Math.Between(0, 1)) {
      this.enemyGroup1.create(
        Phaser.Math.Between(0, game.config.width),
        0,
        "enemy"
      );
      this.gem1Group.create(
        Phaser.Math.Between(0, game.config.width),
        0,
        "gem1"
      );

      this.enemyGroup1.setVelocityY(shipOptions.shipSpeed);
      this.gem1Group.setVelocityY(shipOptions.shipSpeed / 3);
    }
    if (this.score >= 10) {
      if (Phaser.Math.Between(0, 1)) {
        this.enemyGroup2.create(
          Phaser.Math.Between(0, game.config.width),
          0,
          "enemy2"
        );
        this.gem2Group.create(
          Phaser.Math.Between(0, game.config.width),
          0,
          "gem2"
        );
        this.enemyGroup2.setVelocityY(shipOptions.shipSpeed / 2);
        this.gem2Group.setVelocityY(shipOptions.shipSpeed * 2);
      }
    }
    if (this.score >= 20 && this.bossnumber === 0) {
      let theboss = this.boss.create(100, 100, "boss");
      theboss.setBounce(1); //bouncing movements https://phaser.io/tutorials/making-your-first-phaser-3-game/part10
      theboss.setCollideWorldBounds(true);
      theboss.setVelocity(Phaser.Math.Between(-200, 200), 20);
      this.bossnumber += 1;
    }
  }
  //overlaps resolved: getting points,hittin enemies wiht bullets and enemies hittin ship
  getPoints(bullets, enemy) {
    enemy.disableBody(true, true);
    this.score += 1;
    this.scoreText.setText(this.score);
  }

  getPoints2(bullets, enemy) {
    enemy.disableBody(true, true);
    this.score += 2;
    this.scoreText.setText(this.score);
  }

  takeDamage(ship, enemy) {
    enemy.disableBody(true, true);
    this.score -= 1;
    this.HP -= 50;
    this.scoreText.setText(this.score);
  }

  shootBoss(bullets, boss) {
    bullets.disableBody(true, true);
    this.bossHP -= 5;
    if (this.bossHP === 0) {
      this.scene.start("EndingScene");
    }
  }

  collectGems1(ship, gem1) {
    gem1.disableBody(true, true);
    this.gem.play();
    this.score += 2;
    this.scoreText.setText(this.score);
  }
  collectGems2(ship, gem2) {
    gem2.disableBody(true, true);
    this.gem.play();
    this.score += 3;
    this.scoreText.setText(this.score);
  }

  bossHit(ship, boss) {
    this.scene.start("GameOverScene");
    this.go.play();
  }
  //---

  update() {
    if (this.HP === 100) {
      this.add.image(100, 50, "one");
    } else if (this.HP === 50) {
      this.add.image(100, 50, "two");
    } else if (this.HP === 0) {
      this.scene.start("GameOverScene");
      this.go.play();
      this.HP = 150;
      this.score = 0;
      this.bossnumber = 0;
      this.physics.pause();
    }
    if (this.score >= 100) {
      this.scene.start("EndingScene");
    }
  }
}
//config and scenes
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: [preloadScene, Game, GameOverScene, EndingScene]
};

let game = new Phaser.Game(config);
