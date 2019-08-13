import { Scene } from 'phaser'
import game from './index'
// Assets.
import flagImg from './assets/flag.png'
import cellsImg from './assets/playfield/cells.png'

class Level00 extends Scene {
  constructor () {
    super({ key: 'level00' })

    this.cellSize = 60
    this.gridMatrixCount = 8
    this.score = 0
    this.timer = 0
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
    this.createFlag()

    this.createCells(60, 120, this.gridMatrixCount, this.gridMatrixCount)

    this.createTexts()

    // Input events.
    this.input.on('gameobjectup', this.cellClicked, this)
  }

  createTexts () {
    this.scoreText = this.add.text(20, 20, `Score: ${this.score}`, {
      font: '25px',
      fill: 'white'
    })

    this.timerText = this.add.text(20, 45, `Time: ${this.timer}`, {
      font: '25px',
      fill: 'white'
    })

    this.infoText = this.add.text(
      game.config.width / 2,
      game.config.height / 2 - 20,
      'Game Over!',
      { font: '50px', fill: 'red' }
    )
    this.infoText.setOrigin(0.5)
    this.infoText.setVisible(false)
  }

  createFlag () {
    const flag = this.add.image(0, 0, 'flag')
    flag.setScale(0.5)
    flag.setPosition(
      this.gridMatrixCount * this.cellSize + flag.displayWidth,
      game.config.height / 2
    )
  }

  createCells (x, y, rows, columns) {
    let offsetY = 0
    const gap = 1

    for (let i = 0; i < rows; i++) {
      let offsetX = 0

      for (let j = 0; j < columns; j++) {
        const cell = this.add.sprite(x + offsetX, y + offsetY, 'cells', 0)
        cell.setInteractive()

        // Tints the cell for a hover effect.
        cell.on('pointerover', event => {
          cell.setTint(0xeeeeee)
        })

        cell.on('pointerout', event => {
          cell.clearTint()
        })

        offsetX += this.cellSize + gap
      }

      offsetY += this.cellSize + gap
    }
  }

  cellClicked (pointer, gameObject) {
    gameObject.setFrame(9)
    this.infoText.setVisible(true)
  }

  handleGameOver () {
    // TODO: trigger game over handling.
    this.input.on('pointerup', () => this.scene.start('level00'))
  }
  // #endregion
}

export default Level00
