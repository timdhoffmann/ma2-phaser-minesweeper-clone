import { Scene } from 'phaser'
import Grid from '../playfield/grid'
// import Cell from '../playfield/cell'
// Assets.
import flagImg from '../assets/flag.png'
import cellsImg from '../assets/playfield/cells.png'

export default class Level00 extends Scene {
  constructor () {
    super({ key: 'level00' })

    this._cellSize = 60
    this._gridSize = 8
    this._totalMines = 10
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

    this.createGrid()

    this.createTexts()
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

  createGrid () {
    this._grid = new Grid(
      this,
      40,
      100,
      this._gridSize,
      this._gridSize,
      this._cellSize,
      this._totalMines
    )
  }

  createTexts () {
    this._scoreText = this.add.text(20, 20, `Score: ${this._score}`, {
      font: '25px',
      fill: 'white'
    })

    this._timerText = this.add.text(20, 45, `Time:`, {
      font: '25px',
      fill: 'white'
    })

    this._infoText = this.add.text(
      this.game.config.width / 2,
      this.game.config.height / 2 - 20,
      'Game Over!',
      { font: '50px', fill: 'red' }
    )
    this._infoText.setOrigin(0.5)
    this._infoText.setVisible(false)
  }

  createFlag () {
    const flag = this.add.image(0, 0, 'flag')
    flag.setScale(0.5)
    flag.setPosition(
      this._gridSize * this._cellSize + flag.displayWidth,
      this.game.config.height / 2
    )
  }

  handleGameOver () {
    // TODO: trigger game over handling.
    this.input.on('pointerup', () => this.scene.start('level00'))
  }
  // #endregion

  // #region Timer Methods

  onUpdateTimer () {
    const timeFormatted = this.millisToMinutesAndSeconds(this.time.now)
    this._timerText.setText(`Time: ${timeFormatted}`)
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

  // #endregion
}
