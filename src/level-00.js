import { Scene } from 'phaser'
import { game } from './index'

class Level00 extends Scene {
  constructor () {
    super('Level00')
  }

  preload () {
    const cellSize = 60
    this.load.image('flag', 'src/assets/flag.png')
    this.load.spritesheet('cells', 'src/assets/playfield/cells.png', {
      frameWidth: cellSize,
      frameHeight: cellSize
    })
  }

  create () {
    this.add.text(20, 20, 'Playing Game...', { font: '25px', fill: 'green' })

    this.flag = this.add.image(0, 0, 'flag')
    this.flag.setScale(0.5)
    this.flag.setPosition(game.config.width / 2, game.config.height / 2)

    // Cells.
    const cell = this.add.sprite(60, 60, 'cells', 0)
    cell.setInteractive()

    // Input events.
    this.input.on('gameobjectup', this.cellClicked, this)
  }

  update () {}

  cellClicked (pointer, gameObject) {
    gameObject.setFrame(9)
  }
}

export default Level00
