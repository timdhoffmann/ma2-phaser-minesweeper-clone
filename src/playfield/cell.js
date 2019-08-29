import { Scene } from 'phaser'

// Helper "enum" for spriteSheet indices.
const SpriteSheetIndex = Object.freeze({
  Hidden: 0,
  Marked: 9,
  Revealed: 10,
  Mine: 11
})

// FIXME: workaround to get intellisense.
// var is overwritten in constructor with actual reference.
var _scene = new Scene()

// Represents a single cell of the playfield.
export default class Cell {
  constructor (scene, worldX, worldY, gridX, gridY) {
    // Public properties.
    this.isMine = false
    this.surroundingMines = 0
    this.gridX = gridX
    this.gridY = gridY

    // "Private" properties.

    // FIXME: workaround to get intellisense.
    // this._scene = new Scene() // FIXMEComment for production!
    // this._scene = scene // Un-Comment for production!
    //
    // Alternative intelliSense workaround for development.
    // Intentionally re-assigns correct reference.
    _scene = scene

    this._isRevealed = false
    this._isMarked = false

    this._sprite = _scene.add
      .sprite(worldX, worldY, 'cells', SpriteSheetIndex.Hidden)
      .setOrigin(0)
      .setInteractive()
      // Tints the cell for a hover effect.
      .on('pointerover', event => {
        this._sprite.setTint(0xeeeeee)
      })
      .on('pointerout', event => {
        this._sprite.clearTint()
      })
      // TODO: Change to pointer up, if possible with right mouse?
      .on('pointerdown', this.onCellClicked, this)
  }

  init () {
    this.isMine = false
    this.surroundingMines = 0
    this._isRevealed = false
    this._isMarked = false
    this._sprite
      .setFrame(SpriteSheetIndex.Hidden)
      .setInteractive()
      .clearTint()
  }

  // #region Event Methods

  onCellClicked (pointer, gameObject) {
    if (!_scene.hasStartedGame) {
      _scene.startGame(this)
    }

    // Right mouse button pressed.
    if (pointer.rightButtonDown()) {
      this.handleRightMouseButton()
      return
    }

    // Left mouse button pressed.

    this.handleLeftMouseButton()
  }

  // Marks cells as mines with right click.
  handleRightMouseButton () {
    if (!this._isMarked) {
      this._sprite.setFrame(SpriteSheetIndex.Marked)
      this._isMarked = true
      _scene.setMineMarked()
    } else {
      this._sprite.setFrame(SpriteSheetIndex.Hidden)
      this._isMarked = false
      _scene.setMineUnmarked()
    }
  }

  handleLeftMouseButton () {
    if (this.isMine) {
      // Cell is a mine.
      // TODO: replace tinting with correct sprite.
      this._sprite.setTint(0xff0000)
      this._sprite.removeInteractive()
      // this._sprite.disableInteractive()
      // this._sprite.setFrame(SpriteSheetIndex.Marked)
      // Game over.
      _scene.handleGameOver()
    } else {
      // Cell is not a mine.

      this.reveal()
    }
  }

  // #endregion

  // Reveals a cell that hasn't been revealed, yet.
  reveal () {
    // Prevents already revealed cells from revealing again.
    if (this._isRevealed) {
      return
    }

    this._isRevealed = true

    _scene.grid.incrementCellsRevealed()

    // Cell has surrounding mines.
    if (this.surroundingMines > 0) {
      this._sprite.setFrame(this.surroundingMines)
    } else {
      // No surrounding mines.
      this._sprite.setFrame(SpriteSheetIndex.Revealed)
      _scene.grid.autoRevealSurroundingCells(this)
    }
  }

  showIfMine () {
    if (this.isMine) {
      this._sprite.setFrame(SpriteSheetIndex.Mine)
    }
  }
}
