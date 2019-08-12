import { Scene } from 'phaser'

class LoadingGame extends Scene {
  constructor () {
    super('LoadingGame')
  }

  create () {
    this.add.text(20, 20, 'Loading Game...')

    this.scene.start('Level00')
  }
}

export default LoadingGame
