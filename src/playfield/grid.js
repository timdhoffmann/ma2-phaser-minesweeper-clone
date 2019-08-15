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

    // Gap between cells in pixels.
    this._gap = 1
    // A 2d array off cells [gridX][gridY] or [gridWidth][gridHeight].
    this._cells = this.createGrid()

    this._cells[2][3]._sprite.setTint(0xff0000)
  }

  // Creats a grid of cells.
  // Returns a 2d array of cells [gridX][gridY].
  createGrid () {
    const cells = []

    // Creates one column of cells after the other, from left to right.
    for (let x = 0; x < this._gridWidth; x++) {
      // Adds a blank column of cells.
      cells.push([])

      // Creates all cells in a column, from top to bottom.
      for (let y = 0; y < this._gridHeight; y++) {
        cells[x].push(
          new Cell(this._scene, this.getWorldX(x), this.getWorldY(y))
        )
      }
    }

    return cells
  }

  getWorldX (gridX) {
    return this._worldX + this._cellSize * gridX + this._gap * gridX
  }

  getWorldY (gridY) {
    return this._worldY + this._cellSize * gridY + this._gap * gridY
  }
}
