import Cell from './cell'
import { Math } from 'phaser'

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
    // "Private" properties.
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
    // The amount of cells that have been revealed by the player.
    this._cellsRevealed = 0

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

  // #region Getters and Setters

  get totalCells () {
    return this._gridWidth * this._gridHeight
  }

  get hasRemainingCells () {
    return this.totalCells - this._totalMines - this._cellsRevealed > 0
  }

  // #endregion

  // Increments the number of revealed cells and checks for win condition.
  incrementCellsRevealed () {
    this._cellsRevealed++

    // Checks for win condition.
    if (!this.hasRemainingCells) {
      this._scene.handleWin()
    }
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
    this._cellsRevealed = 0

    this.initCells()
  }

  // Initializes each cell's state.
  initCells () {
    // Iterates over all cells.
    this._cells.forEach((column) => {
      column.forEach((cell) => {
        cell.init()
      })
    })
  }

  destroy () {
    // Destroys all cells' graphics.
    this._cells.forEach((column) => {
      column.forEach((cell) => {
        cell.destroy()
      })
    })
  }

  // Distributes mines across an existing cell grid.
  distributeMines (cellToIgnore) {
    let minesToPlace = this._totalMines

    while (minesToPlace > 0) {
      const randomX = Math.RND.between(0, this._gridWidth - 1)
      const randomY = Math.RND.between(0, this._gridHeight - 1)
      const cell = this._cells[randomX][randomY]

      // Skips a cell that already contains a mine.
      if (cell.isMine) {
        continue
      }

      // Skips the calling cell (first cell revealed).
      if (cellToIgnore != null) {
        if (randomX === cellToIgnore.gridX && randomY === cellToIgnore.gridY) {
          continue
        }
      }

      // Only executes if cell isn't a mine already.
      cell.isMine = true
      minesToPlace--
    }

    if (this._debugShowMines) {
      this.showAllMines()
    }

    this.calculateAllCellsSurroundingMines()
  }

  // #endregion

  // #region Surrounding Mines Methods

  // Calculates surrounding mines for all cells.
  calculateAllCellsSurroundingMines () {
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
    return surroundingMines
  }

  // #endregion

  autoRevealSurroundingCells (cell) {
    // Iterates over all surrounding cells.
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        // Skips the calling cell.
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

  // #region Helper Methods

  showAllMines () {
    // Iterates over all cells.
    this._cells.forEach((column) => {
      column.forEach((cell) => {
        cell.showIfMine()
      })
    })
  }

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
