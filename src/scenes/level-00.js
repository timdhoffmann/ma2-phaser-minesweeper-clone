import Phaser from 'phaser'
import Grid from '../playfield/grid'
// import Cell from '../playfield/cell'
// Assets.
import cellsImg from '../assets/playfield/cells.png'

export default class Level00 extends Phaser.Scene {
  constructor () {
    super({ key: 'level00' })

    // "Public" properties.
    this.grid = null
    this.hasStartedGame = false

    // "Private" properties.
    this._cellSize = 60
    this._easyGridSize = 8
    this._totalMines = 10
    this._mineCounter = this._totalMines
    this._timeAtStartedGame = 0
  }

  preload () {
    this.load.spritesheet('cells', cellsImg, {
      frameWidth: this._cellSize,
      frameHeight: this._cellSize
    })
  }

  // #region Create.

  create () {
    this.createTimeEvents()

    this.createCounterTexts()

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

  createGrid (gridWidth, gridHeight) {
    this.grid = new Grid(
      this,
      40,
      100,
      gridWidth,
      gridHeight,
      this._cellSize,
      this._totalMines
    )
  }

  createCounterTexts () {
    this._counterTexts = this.add.group()

    this._mineCounterText = this.add.text(
      20,
      20,
      `Mines: ${this._mineCounter}`,
      {
        font: '25px',
        fill: 'white'
      }
    )
    this._counterTexts.add(this._mineCounterText)

    this._timerText = this.add.text(20, 45, `Time: 0:00`, {
      font: '25px',
      fill: 'white'
    })
    this._counterTexts.add(this._timerText)
    this._counterTexts.toggleVisible()
  }

  createMenu () {
    this._menu = this.add.group()

    // Creates the overlay.
    this._menuOverlay = this.add
      .rectangle(
        0,
        0,
        this.game.config.width,
        this.game.config.height,
        0x000000,
        0.7
      )
      .setOrigin(0)
      // When visible, blocks objects behind from receiving input.
      .setInteractive()
    this._menu.add(this._menuOverlay)

    // Creates the info text.
    this._infoText = this.add
      .text(this.game.config.width / 2, 100, 'Menu', {
        font: '50px',
        fill: 'white'
      })
      .setAlign('center')
      .setOrigin(0.5)
      .setDepth(100)
    this._menu.add(this._infoText)

    // Creates difficulty buttons.
    this._easyDifficultyButton = this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 - 20,
        `Easy: ${this._easyGridSize} x ${this._easyGridSize}`,
        {
          font: '25px',
          fill: 'white'
        }
      )
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', event => {
        this._menu.toggleVisible()

        this.createGrid(this._easyGridSize, this._easyGridSize)

        this.initGame()
      })
      .on('pointerover', event => {
        this._easyDifficultyButton.setColor('#cccccc').setFontStyle('bold')
      })
      .on('pointerout', event => {
        this._easyDifficultyButton.setColor('#ffffff').setFontStyle('normal')
      })
    this._menu.add(this._easyDifficultyButton)

    // Sets the rendering depth to be in front of other objects.
    this._menu.setDepth(100)
  }

  // #endregion

  // Initializes the game state.
  initGame () {
    // Shows the counter texts on first game start.
    if (!this.hasStartedGame) {
      this._counterTexts.toggleVisible()
    }

    this.hasStartedGame = false

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
      this._timeAtStartedGame = this.time.now
      this._updateTimerTextEvent.paused = false
      this.hasStartedGame = true
      this.grid.distributeMines(callingCell)
    }
  }

  handleWin () {
    console.log('win condition reached.')

    this._updateTimerTextEvent.paused = true

    this._infoText.setText('Awesome!\n You beat the game!').setColor('#00ff00')
    this._menu.toggleVisible()
  }

  handleGameOver () {
    console.log('game over.')
    this.grid.showAllMines()
    this._updateTimerTextEvent.paused = true

    this._infoText.setText('Game Over!\n Click to restart.').setColor('#ff0000')
    this._menu.toggleVisible()
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
