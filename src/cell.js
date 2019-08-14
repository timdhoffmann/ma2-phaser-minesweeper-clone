import { Scene } from 'phaser'

const SpriteSheetIndex = Object.freeze({
  Hidden: 0,
  Marked: 9
})

// FIXME: workaround to get intellisense.
// var is overwritten in constructor with actual reference.
var _scene = new Scene()

// Represents a single cell of the playfield.
export default class Cell {
  constructor (scene, worldX, worldY, gridX, gridY) {
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
      .setInteractive()
      // Tints the cell for a hover effect.
      .on('pointerover', event => {
        this._sprite.setTint(0xeeeeee)
      })
      .on('pointerout', event => {
        this._sprite.clearTint()
      })
      .on('pointerup', this.cellClicked, this)
  }

  cellClicked (pointer, gameObject) {
    this._sprite.setFrame(SpriteSheetIndex.Marked)
    _scene.infoText.setVisible(true)
  }
}
