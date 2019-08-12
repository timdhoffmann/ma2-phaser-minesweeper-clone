import { Scene } from 'phaser'
import { game } from './index'
import flagImg from './assets/flag.png'

class Level00 extends Scene {
  constructor () {
    super('Level00')
  }

  preload () {
    const cellSize = 60
    this.load.image('flag', flagImg)
    this.load.spritesheet('cells', 'src/assets/playfield/cells.png', {
      frameWidth: cellSize,
      frameHeight: cellSize
    })
  }

  create () {
    this.add.text(20, 20, 'Playing Game...', { font: '25px', fill: 'green' })

    const flag = this.add.image(0, 0, 'flag')
    flag.setScale(0.5)
    flag.setPosition(game.config.width / 2, game.config.height / 2)

    this.createCells()

    // Input events.
    this.input.on('gameobjectup', this.cellClicked, this)
  }

  createCells () {
    this.cell = this.add.sprite(60, 60, 'cells', 0)
    this.cell.setInteractive()
  }

  cellClicked (pointer, gameObject) {
    gameObject.setFrame(9)
  }
}

export default Level00
