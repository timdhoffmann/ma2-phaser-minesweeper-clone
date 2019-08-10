class Scene01 extends Phaser.Scene {
  constructor() {
    super("playGame");
  }

  preload() {
    this.load.image("flag", "../assets/flag.png");
    this.load.spritesheet("cells", "../assets/playfield/cells.png", {
      frameWidth: 60,
      frameHeight: 60
    });
  }

  create() {
    this.add.text(20, 20, "Playing Game...", { font: "25px", fill: "green" });

    this.flag = this.add.image(0, 0, "flag");
    this.flag.setScale(0.5);
    this.flag.setPosition(config.width / 2, this.game.config.height / 2);

    // Cells.
    let cellSize = 60;
    let cell = this.add.sprite(60, 60, "cells", 0);
    cell.setInteractive();

    // Input events.
    this.input.on("gameobjectup", this.cellClicked, this);

    // Moves the flag.
    // this.input.on(
    //   "pointerdown",
    //   function(event) {
    //     this.flag.x = event.x;
    //     this.flag.y = event.y;
    //   },
    //   this
    // );
  }

  update() {}

  cellClicked(pointer, gameObject) {
    gameObject.setFrame(9);
  }
}
