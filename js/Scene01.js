class Scene01 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    preload() {
        this.load.image("flag", "../assets/flag.png");
    }

    create() {
        this.add.text(20, 20, "Playing Game...", { font: "25px", fill: "green" });

        this.flag = this.add.image(0, 0, "flag");
        this.flag.setScale(0.5);
        this.flag.setPosition(config.width / 2, this.game.config.height / 2);

    }
}