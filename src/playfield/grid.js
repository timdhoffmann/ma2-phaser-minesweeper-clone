import Cell from './cell'
import { Scene } from 'phaser'

// Represents the grid of cells that makes the playfield.
export default class Grid {
  constructor (scene, worldX, worldY, gridWidth, gridHeight, cellSize) {
    // A reference to the parent phaser scene.
    this._scene = scene
    // The world position of the grid in pixels.
    this._worldX = worldX
    this._worldY = worldY
    // The wdith of the grid in cells.
    this._gridWidth = gridWidth
    // The height of the grid in cells.
    this._gridHeight = gridHeight
    // Ths size of one cell in pixels.
    this._cellSize = cellSize

    this._cells = this.createCells()

    this._cells[3][3]._sprite.setTint(0xff0000)
  }

  createCells () {
    const cells = []
    const gap = 1
    let offsetY = 0

    // Creates one row of cells after the other.
    for (let y = 0; y < this._gridHeight; y++) {
      // Adds a blank row of cells.
      cells.push([])

      let offsetX = 0

      // Creates all cells in a row.
      for (let x = 0; x < this._gridWidth; x++) {
        cells[y].push(
          new Cell(this._scene, this._worldX + offsetX, this._worldY + offsetY)
        )

        offsetX += this._cellSize + gap
      }

      offsetY += this._cellSize + gap
    }

    return cells
  }
}
