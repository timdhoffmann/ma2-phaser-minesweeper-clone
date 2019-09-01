import Phaser from 'phaser'
import Grid from '../playfield/grid'
// Assets.
import cellsImg from '../assets/playfield/cells.png'

// Difficulty settings.
const _easyGridSizeX = 8
const _easyGridSizeY = 8
const _easyTotalMines = 10
const _normalGridSizeX = 16
const _normalGridSizeY = 16
const _normalTotalMines = 40

export default class Level00 extends Phaser.Scene {
  constructor () {
    super({ key: 'Level00' })

    // "Public" properties.
    this.grid = null
    this.hasStartedGame = false

    // "Private" properties.
    this._cellSize = 60
    this._mineCounter = 0
    this._timeAtStartedGame = 0
  }

  // #region Getters and Setters.

  get counterTextsX () {
    return this.game.canvas.width * 0.5
  }

  get counterTextsY () {
    return 40
  }

  get displayFont () {
    return 'Bevan'
  }

  get counterFont () {
    return 'Bungee Inline'
  }

  // #endregion

  // #region Phaser Caallback Methods.

  preload () {
    this.load.spritesheet('cells', cellsImg, {
      frameWidth: this._cellSize,
      frameHeight: this._cellSize
    })
  }

  create () {
    this.createTimeEvents()

    this.createCounterTexts()

    this.createMenu()

    this.createTransitionFill()

    this.fadeFromBlack()

    // Event raised when window size changes.
    this.scale.on('resize', this.onWindowResized, this)

    this.input.mouse.disableContextMenu()
  }

  // #endregion

  // #region Create Methods.

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

  createCounterTexts () {
    this._counterTexts = this.add.container(
      this.counterTextsX,
      this.counterTextsY
    )

    const x = 0
    const y = 0
    this._mineCounterText = this.add
      .text(x - 20, y, `Mines: ${this._mineCounter}`, {
        font: '25px',
        fill: 'white'
      })
      .setFontFamily(this.displayFont)
      .setOrigin(1, 0)
    this._counterTexts.add(this._mineCounterText)

    this._timerText = this.add
      .text(x + 20, y, `Time: 0:00`, {
        font: '25px',
        fill: 'white'
      })
      .setFontFamily(this.displayFont)

    this._counterTexts.add(this._timerText)
    this._counterTexts.setVisible(false)
  }

  // Creates the game menu.
  createMenu () {
    this._menu = this.add.container(this.game.scale.width * 0.5, 0)

    // Creates the overlay.
    this._menuOverlay = this.add
      .rectangle(
        0,
        0,
        this.game.scale.width,
        this.game.scale.height,
        0xff0000,
        0.7
      )
      .setOrigin(0.5, 0)
      // When visible, blocks objects behind from receiving input.
      .setInteractive()
    this._menu.add(this._menuOverlay)

    this.createMenuTexts()

    this.createMenuButtons()

    // Sets the rendering depth to be in front of other objects.
    this._menu.setDepth(100)
  }

  createMenuTexts () {
    // Creates the title text.
    this._titleText = this.add
      .text(0, 100, 'Minesweeper', {
        font: '70px',
        fill: 'white'
      })
      .setFontFamily(this.displayFont)
      .setAlign('center')
      .setOrigin(0.5, 0)
    this._menu.add(this._titleText)

    // Creates the subtitle text.
    const titleBottomLeft = this._titleText.getBottomLeft()

    this._subTitleText = this.add
      .text(
        titleBottomLeft.x,
        titleBottomLeft.y - 10,
        'Assignment by Tim Hoffmann',
        {
          font: '18px',
          fill: 'white',
          letterSpacing: '10px'
        }
      )
      .setFontFamily(this.displayFont)
      .setAlign('center')
      .setOrigin(0)
    this._menu.add(this._subTitleText)

    // Creates the info text.
    this._infoText = this.add
      .text(0, this._titleText.getBottomCenter().y + 60, 'New Game', {
        font: '50px',
        fill: 'white'
      })
      .setFontFamily(this.counterFont)
      .setAlign('center')
      .setOrigin(0.5, 0)
    this._menu.add(this._infoText)
  }

  createMenuButtons () {
    // Creates the easy difficulty button.
    this._easyDifficultyButton = this.createButton(
      0,
      this._infoText.getBottomCenter().y + 20,
      `Easy ${_easyGridSizeX} x ${_easyGridSizeX}`
    ).on('pointerdown', (event) => {
      this.showMenu(false)
      this.initGame(_easyGridSizeX, _easyGridSizeY, _easyTotalMines)
    })
    this._menu.add(this._easyDifficultyButton)

    // Creates the normal difficulty button.
    this._normalDifficultyButton = this.createButton(
      0,
      this._easyDifficultyButton.getBottomCenter().y + 20,
      `Normal ${_normalGridSizeX} x ${_normalGridSizeY}`
    ).on('pointerdown', (event) => {
      this.showMenu(false)
      this.initGame(_normalGridSizeX, _normalGridSizeY, _normalTotalMines)
    })
    this._menu.add(this._normalDifficultyButton)
  }

  createButton (x, y, text) {
    return this.add
      .text(x, y, text, {
        font: '30px',
        fill: 'black'
      })
      .setFontFamily(this.counterFont)
      .setOrigin(0.5, 0)
      .setInteractive()
      .on('pointerover', function (event) {
        this.setColor('white').setFontStyle('bold')
      })
      .on('pointerout', function (event) {
        this.setColor('black').setFontStyle('normal')
      })
  }

  createTransitionFill () {
    // Creates the overlay.
    this._transitionFill = this.add
      .rectangle(
        0,
        0,
        this.game.scale.width,
        this.game.scale.height,
        this.game.config.backgroundColor,
        1
      )
      .setOrigin(0)
      .setDepth(1000)
  }

  // #endregion

  // #region Game Initialization Methods

  // Initializes the game state.
  initGame (gridWidth, gridHeight, totalMines) {
    // this.game.canvas.
    this.createNewGrid(gridWidth, gridHeight, totalMines)

    this._counterTexts.setVisible(true)

    this.hasStartedGame = false

    this._mineCounter = totalMines
    this._mineCounterText.text = `Mines: ${this._mineCounter}`

    this._timerText.text = 'Time: 0:00'
    this._updateTimerTextEvent.paused = true

    this.grid.init()
  }

  // Creates a new grid.
  createNewGrid (gridWidth, gridHeight, totalMines) {
    // Clears any existing grid.
    if (this.grid != null) {
      this.grid.destroy()
      this.grid = null
    }

    const x = this.game.canvas.width * 0.5 - gridWidth * this._cellSize * 0.5
    this.grid = new Grid(
      this,
      x,
      100,
      gridWidth,
      gridHeight,
      this._cellSize,
      totalMines
    )

    // Aligns the counter texts.
    this._counterTexts.setPosition(this.counterTextsX, this.counterTextsY)
  }

  // #endregion

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

    this._infoText.setText('Awesome! You beat the game.')
    this._menuOverlay.setFillStyle(this.game.config.backgroundColor, 0.6)
    this.showMenu(true)
  }

  handleGameOver () {
    console.log('game over.')
    this.grid.showAllMines()
    this._updateTimerTextEvent.paused = true

    this._infoText.setText('Game Over. Start Again!')
    this._menuOverlay.setFillStyle(0xff0000, 0.6)

    this.showMenu(true)
  }

  showMenu (value) {
    const startAlpha = value ? 0 : 1
    const endAlpha = value ? 1 : 0

    this._menu.setAlpha(startAlpha)

    this.tweens.add({
      targets: this._menu,
      alpha: endAlpha,
      ease: 'power3',
      duration: 500
    })

    // this._easyDifficultyButton
  }

  // #endregion

  // #region Timer Methods

  onUpdateTimerText () {
    const timeFormatted = this.millisToMinutesAndSeconds(
      this.time.now - this._timeAtStartedGame
    )
    this._timerText.setText(`Time: ${timeFormatted}`)
  }

  // Adapted from: https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
  millisToMinutesAndSeconds (millis) {
    const minutes = Phaser.Math.FloorTo(millis / 60000)
    const seconds = ((millis % 60000) / 1000).toFixed(0)

    return seconds === 60
      ? minutes + 1 + ':00'
      : minutes + ':' + (seconds < 10 ? '0' : '') + seconds
  }

  // #endregion

  // #region Display Methods

  fadeFromBlack () {
    this.tweens.add({
      targets: this._transitionFill,
      alpha: 0,
      ease: 'power2',
      duration: 5000,
      onComplete: () => {}
    })
  }

  // Resizes the game dynamically.
  onWindowResized (gameSize, baseSize, displaySize, resolution) {
    const width = gameSize.width
    const height = gameSize.height

    this.cameras.resize(width, height)

    this._menu.setPosition(this.game.scale.width * 0.5, 0)
    this._menuOverlay.setScale(this.game.scale.width, this.game.scale.height)
  }

  // #endregion
}
