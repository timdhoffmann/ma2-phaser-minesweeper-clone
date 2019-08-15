import Cell from './cell'
import { Scene, Math } from 'phaser'

// Represents the grid of cells that makes the playfield.
export default class Grid {
  constructor (
    scene,
    worldX,
    worldY,
    gridWidth,
    gridHeight,
    cellSize,
    totalMines
  ) {
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

    this.distributeMines(totalMines)
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

  // Distributes mines across an existing cell grid.
  distributeMines (minesToPlace) {
    while (minesToPlace > 0) {
      const randomX = Math.RND.between(0, this._gridWidth - 1)
      const randomY = Math.RND.between(0, this._gridHeight - 1)
      const cell = this._cells[randomX][randomY]

      if (cell.isMine) {
        console.log(
          `cell x: ${randomX}, y: ${randomY} already is mine. skipped.`
        )
        continue
      }

      // Only executes if cell isn't a mine already.
      cell.isMine = true
      minesToPlace--
      console.log(
        `placed mine at x: ${randomX}, y: ${randomY}. remaining: ${minesToPlace}`
      )
    }
  }

  // #region Helper Methods

  getWorldX (gridX) {
    return this._worldX + this._cellSize * gridX + this._gap * gridX
  }

  getWorldY (gridY) {
    return this._worldY + this._cellSize * gridY + this._gap * gridY
  }

  // #endregion
}
