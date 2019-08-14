import { Scene } from 'phaser'

// TODO: workaround to get intellisense.
// var is overwritten in constructor with actual reference.
var _scene = new Scene()

// Represents a single cell of the playfield.
export default class Cell {
  constructor (scene, worldX, worldY, gridX, gridY) {
    // IntelliSense workaround for development.
    // this._scene = new Scene() // TODO: Comment for production!
    // this._scene = scene // TODO: Un-Comment for production!
    //
    // Alternative intelliSense workaround for development.
    // Intentionally re-assigns correct reference.
    _scene = scene

    this._isRevealed = false
    this._isMarked = false

    this._sprite = _scene.add
      .sprite(worldX, worldY, 'cells', 0)
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
    this._sprite.setFrame(9)
    _scene.infoText.setVisible(true)
  }
}
