import { Scene } from 'phaser'
import { game } from './index'
// Assets.
import flagImg from './assets/flag.png'
import cellsImg from './assets/playfield/cells.png'

class Level00 extends Scene {
  constructor () {
    super({ key: 'level00' })

    this._cellSize = 60
    this._gridMatrixCount = 8
    this._score = 0
  }

  preload () {
    this.load.image('flag', flagImg)
    this.load.spritesheet('cells', cellsImg, {
      frameWidth: this._cellSize,
      frameHeight: this._cellSize
    })
  }

  // #region Create.

  create () {
    this.createTimeEvents()

    this.createFlag()

    this.createCells(60, 120, this._gridMatrixCount, this._gridMatrixCount)

    this.createTexts()

    // Input events.
    this.input.on('gameobjectup', this.cellClicked, this)
  }

  createTimeEvents () {
    // Event to update the clock every "delay" milliseconds.
    // Used to reduce expensive setText() calls.
    // Important: Because it's managed by a Clock, a Timer Event is based on game time,
    // will be affected by its Clock's time scale, and will pause if its Clock pauses.
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.onUpdateTimer,
      callbackScope: this
    })
  }

  createTexts () {
    this.scoreText = this.add.text(20, 20, `Score: ${this._score}`, {
      font: '25px',
      fill: 'white'
    })

    this.timerText = this.add.text(20, 45, `Time:`, {
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
      this._gridMatrixCount * this._cellSize + flag.displayWidth,
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

        offsetX += this._cellSize + gap
      }

      offsetY += this._cellSize + gap
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

  update () {
    // this.updateTimer();
  }

  onUpdateTimer () {
    const timeFormatted = this.millisToMinutesAndSeconds(this.time.now)
    this.timerText.setText(`Time: ${timeFormatted}`)
  }

  // TODO: Mention source in readme.
  // Source: https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
  millisToMinutesAndSeconds (millis) {
    const minutes = Math.floor(millis / 60000)
    const seconds = ((millis % 60000) / 1000).toFixed(0)

    return seconds === 60
      ? minutes + 1 + ':00'
      : minutes + ':' + (seconds < 10 ? '0' : '') + seconds
  }
}

export default Level00
