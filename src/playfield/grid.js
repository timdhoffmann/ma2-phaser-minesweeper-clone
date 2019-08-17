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
    // The total count of mines to be placed.
    this._totalMines = totalMines

    // Gap between cells in pixels.
    this._gap = 1
    
    // Debugging.
    // Set to true, if mines should be indicated upon grid creation.
    this._debugShowMines = true

    // A 2d array off cells [gridX][gridY] or [gridWidth][gridHeight].
    this._cells = this.createGrid()

    // Initializes the grid state.
    this.init()
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
          new Cell(this._scene, this.getWorldX(x), this.getWorldY(y), x, y)
        )
      }
    }

    return cells
  }

  // #region Initialization Methods

  init () {
    this.initCells()

    this.distributeMines(this._totalMines)

    if (this._debugShowMines) {
      this.showAllMines()
    }
  }

  initCells () {
    // Iterates over all cells.
    this._cells.forEach(column => {
      column.forEach(cell => {
        cell.init()
      })
    })
  }

  // Distributes mines across an existing cell grid.
  distributeMines (minesToPlace) {
    while (minesToPlace > 0) {
      const randomX = Math.RND.between(0, this._gridWidth - 1)
      const randomY = Math.RND.between(0, this._gridHeight - 1)
      const cell = this._cells[randomX][randomY]

      // Skips a cell that already contains a mine.
      if (cell.isMine) {
        continue
      }

      // Only executes if cell isn't a mine already.
      cell.isMine = true
      minesToPlace--
    }

    this.calculateAllCellsSurroundingMines()
  }

  // #endregion

  // #region Surrounding Mines Methods

  // Calculates surrounding mines for all cells.
  calculateAllCellsSurroundingMines () {
    // TODO: try iterating over all cells with foreach instead. Needs reading gridX and gridY from each cell.

    // Iterates over all columns.
    for (let x = 0; x < this._gridWidth; x++) {
      // Iterates over all cells in a column, from top to bottom.
      for (let y = 0; y < this._gridHeight; y++) {
        const cell = this._cells[x][y]

        if (!cell.isMine) {
          cell.surroundingMines = this.getSurroundingMinesCount(cell)
        }
      }
    }
  }

  // Gets the total number of mines surrounding a cell.
  getSurroundingMinesCount (cell) {
    let surroundingMines = 0

    // Iterates over all surrounding mines.
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        // TODO: needs skipping checking itself?

        const surroundingCell = this.getCell(cell.gridX + x, cell.gridY + y)

        if (surroundingCell === null) {
          continue
        }

        if (surroundingCell.isMine) {
          surroundingMines++
        }
      }
    }
    // TODO: return calculated value.
    return surroundingMines
  }

  // #endregion

  autoRevealSurroundingCells (cell) {
    // Iterates over all surrounding cells.
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        // TODO: needs skipping checking itself?
        if (x === 0 && y === 0) {
          continue
        }

        const surroundingCell = this.getCell(cell.gridX + x, cell.gridY + y)

        // Prevents accessing invalid cells outside the grid.
        if (surroundingCell === null) {
          continue
        }

        if (surroundingCell.surroundingMines === 0) {
          surroundingCell.reveal()
        }
      }
    }
  }

  showAllMines () {
    // Iterates over all cells.
    this._cells.forEach(column => {
      column.forEach(cell => {
        cell.showIfMine()
      })
    })
  }

  // #region Helper Methods

  // Gets the cell at the requested location.
  // Returns the cell or null if the request was outside of the grid.
  getCell (gridX, gridY) {
    // Requested location is outside of grid.
    if (
      gridX < 0 ||
      gridY < 0 ||
      gridX > this._gridWidth - 1 ||
      gridY > this._gridWidth - 1
    ) {
      return null
    }

    // Requested location is valid.
    return this._cells[gridX][gridY]
  }

  getWorldX (gridX) {
    return this._worldX + this._cellSize * gridX + this._gap * gridX
  }

  getWorldY (gridY) {
    return this._worldY + this._cellSize * gridY + this._gap * gridY
  }

  // #endregion
}
