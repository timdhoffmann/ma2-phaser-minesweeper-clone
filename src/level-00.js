import { Scene } from 'phaser'
import { game } from './index'

// Assets.
import flagImg from './assets/flag.png'
import cellsImg from './assets/playfield/cells.png'

class Level00 extends Scene {
  constructor () {
    super('Level00')
    this.cellSize = 60
    this.gridMatrixCount = 8
  }

  preload () {
    this.load.image('flag', flagImg)
    this.load.spritesheet('cells', cellsImg, {
      frameWidth: this.cellSize,
      frameHeight: this.cellSize
    })
  }

  // #region Create.

  create () {
    this.add.text(20, 20, 'Playing Game...', { font: '25px', fill: 'green' })

    const flag = this.add.image(0, 0, 'flag')
    flag.setScale(0.5)
    flag.setPosition(
      this.gridMatrixCount * this.cellSize + flag.displayWidth,
      game.config.height / 2
    )

    this.createCells(60, 120, this.gridMatrixCount, this.gridMatrixCount)

    // Input events.
    this.input.on('gameobjectup', this.cellClicked, this)
  }

  createCells (x, y, rows, columns) {
    let offsetY = 0
    const gap = 1

    for (let i = 0; i < rows; i++) {
      let offsetX = 0

      for (let j = 0; j < columns; j++) {
        const cell = this.add.sprite(x + offsetX, y + offsetY, 'cells', 0)
        cell.setInteractive()

        offsetX += this.cellSize + gap
      }

      offsetY += this.cellSize + gap
    }
  }

  cellClicked (pointer, gameObject) {
    gameObject.setFrame(9)
  }

  // #endregion
}

export default Level00
