import { Scene } from 'phaser'
import { game } from './index'

class Level00 extends Scene {
  preload () {
    //   this.load.image("logo", logoImg);
  }

  create () {
    const message = this.add.text(
      game.config.width / 2.5,
      100,
      'Phaser is running!'
    )

    this.tweens.add({
      targets: message,
      y: 450,
      duration: 2000,
      ease: 'Power2',
      yoyo: true,
      loop: -1
    })
  }
}

export default Level00
