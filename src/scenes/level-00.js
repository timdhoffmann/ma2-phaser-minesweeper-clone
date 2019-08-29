import Phaser from 'phaser'
import Grid from '../playfield/grid'
// import Cell from '../playfield/cell'
// Assets.
import flagImg from '../assets/flag.png'
import cellsImg from '../assets/playfield/cells.png'

export default class Level00 extends Phaser.Scene {
  constructor () {
    super({ key: 'level00' })

    // "Public" properties.
    this.grid = null
    this.hasStartedGame = false

    // "Private" properties.
    this._cellSize = 60
    this._gridSize = 8
    this._totalMines = 10
    this._mineCounter = this._totalMines
    this._timeAtStartedGame = 0
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

    this.createGrid()

    this.createTexts()

    this.createMenu()

    this.input.mouse.disableContextMenu()
  }

  createTimeEvents () {
    // Event to update the clock every "delay" milliseconds.
    // Used to reduce expensive setText() calls.
    // Important: Because it's managed by a Clock, a Timer Event is based on game time,
    // will be affected by its Clock's time scale, and will pause if its Clock pauses.
    this._updateTimerTextEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.onUpdateTimerText,
      callbackScope: this,
      paused: true
    })
  }

  createGrid () {
    this.grid = new Grid(
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
    this._mineCounterText = this.add.text(
      20,
      20,
      `Mines: ${this._mineCounter}`,
      {
        font: '25px',
        fill: 'white'
      }
    )

    this._timerText = this.add.text(20, 45, `Time: 0:00`, {
      font: '25px',
      fill: 'white'
    })

    this._infoText = this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 - 20,
        'infoText',
        { font: '50px', fill: 'red' }
      )
      .setAlign('center')
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(100)
  }

  createMenu () {
    this._menuOverlay = this.add
      .rectangle(
        0,
        0,
        this.game.config.width,
        this.game.config.height,
        0xffffff,
        0.4
      )
      .setOrigin(0)
      .setInteractive()
      .setVisible(false)
      .on('pointerdown', this.onRestartGame, this)
  }

  // #endregion

  // Initializes the game state.
  initGame () {
    this.hasStartedGame = false

    this._infoText.setVisible(false)
    this._menuOverlay.setActive(false).setVisible(false)

    this._mineCounter = this._totalMines
    this._mineCounterText.text = `Mines: ${this._mineCounter}`

    this._timerText.text = 'Time: 0:00'
    this._updateTimerTextEvent.paused = true

    this.grid.init()
  }

  // #region Mine Counter Methods

  setMineMarked () {
    this.updateMineCounter(-1)
  }

  setMineUnmarked () {
    this.updateMineCounter(+1)
  }

  // Updates the _mineCounter.
  updateMineCounter (amount) {
    // Microsoft Minesweeper allows negative _mineCounter.
    this._mineCounter += amount

    // This would clamp to 0 and total mines.
    // this._mineCounter = Phaser.Math.Clamp(
    //   (this._mineCounter += amount),
    //   0,
    //   this._totalMines
    // )

    this._mineCounterText.text = `Mines: ${this._mineCounter}`
  }

  // #endregion

  // #region Game Flow Methods

  startGame (callingCell) {
    if (!this.hasStartedGame) {
      // this.time.update(0)
      this._timeAtStartedGame = this.time.now
      this._updateTimerTextEvent.paused = false
      this.hasStartedGame = true
      this.grid.distributeMines(callingCell)
    }
  }

  handleWin () {
    console.log('win condition reached.')

    this._updateTimerTextEvent.paused = true

    this._infoText
      .setVisible(true)
      .setText('Awesome!\n You beat the game!')
      .setColor('#00ff00')
    this._menuOverlay.setActive(true).setVisible(true)
  }

  handleGameOver () {
    console.log('game over.')
    this.grid.showAllMines()
    this._updateTimerTextEvent.paused = true

    this._infoText
      .setText('Game Over!\n Click to restart.')
      .setColor('#ff0000')
      .setVisible(true)
    this._menuOverlay.setActive(true).setVisible(true)
  }

  // #endregion

  // #region Input Event Methods

  onRestartGame (pointer, gameObject) {
    this.initGame()
  }

  // #endregion

  // #region Timer Methods

  onUpdateTimerText () {
    const timeFormatted = this.millisToMinutesAndSeconds(
      this.time.now - this._timeAtStartedGame
    )
    this._timerText.setText(`Time: ${timeFormatted}`)
  }

  // TODO: Mention source in readme.
  // Adapted from: https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
  millisToMinutesAndSeconds (millis) {
    const minutes = Phaser.Math.FloorTo(millis / 60000)
    const seconds = ((millis % 60000) / 1000).toFixed(0)

    return seconds === 60
      ? minutes + 1 + ':00'
      : minutes + ':' + (seconds < 10 ? '0' : '') + seconds
  }

  // #endregion
}
