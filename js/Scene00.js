// import { Scene } from 'phaser'

class Scene00 extends Phaser.Scene {
  constructor () {
    super('Scene00')
  }

  create () {
    this.add.text(20, 20, 'Loading Game...')

    this.scene.start('playGame')
  }
}
