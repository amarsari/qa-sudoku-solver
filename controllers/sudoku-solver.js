const WIDTH = 9;
const HEIGHT = 9;

class SudokuSolver {
  constructor() {
    this._puzzle = [];
    this._recursions = 0;
  }

  validInput(input) {
    return typeof input === 'string' && input.length === 1 && !!input.match(/[1-9]/);
  }

  validate(puzzle) {
    if (!puzzle) {
      return { error: 'Required field missing' };
    }
    if (puzzle.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    if (!/^[1-9.]+$/.test(puzzle)) {
      return { error: 'Invalid characters in puzzle' };
    }
    return 'Valid';
  }

  letterToNumber(row) {
    switch (row.toUpperCase()) { // Corrected: added toUpperCase()
      case 'A':
        return 1;
      case 'B':
        return 2;
      case 'C':
        return 3;
      case 'D':
        return 4;
      case 'E':
        return 5;
      case 'F':
        return 6;
      case 'G':
        return 7;
      case 'H':
        return 8;
      case 'I':
        return 9;
      default:
        return null; // Invalid letter
    }
  }

  transform(puzzleString) {
    const SIZE = 9;
    const grid = [];
    for (let i = 0; i < SIZE; i++) {
      grid.push(
        puzzleString
          .slice(i * SIZE, (i + 1) * SIZE)
          .split('')
          .map((char) => (char === '.' ? 0 : parseInt(char)))
      );
    }
    return grid;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let grid = this.transform(puzzleString);
    row = this.letterToNumber(row) - 1;

    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let grid = this.transform(puzzleString);
    column = parseInt(column) - 1;
    row = this.letterToNumber(row) - 1;

    for (let i = 0; i < 9; i++) {
      if (grid[i][column] === value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let grid = this.transform(puzzleString);
    row = this.letterToNumber(row) - 1; // Corrected: subtract 1
    column = parseInt(column) - 1; // Corrected: subtract 1

    let startRow = row - (row % 3);
    let startCol = column - (column % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] === value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    if (!/^[1-9.]+$/.test(puzzleString)) {
      return false;
    }

    if (puzzleString.length !== 81) {
      return false;
    }

    const SIZE = 9;
    const SUBGRID = 3;

    const isValid = (board, row, col, num) => {
      for (let i = 0; i < SIZE; i++) {
        if (board[row][i] === num || board[i][col] === num) {
          return false;
        }
        const subRow = SUBGRID * Math.floor(row / SUBGRID) + Math.floor(i / SUBGRID);
        const subCol = SUBGRID * Math.floor(col / SUBGRID) + (i % SUBGRID);
        if (board[subRow][subCol] === num) {
          return false;
        }
      }
      return true;
    };

    const solveBoard = (board) => {
      for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
          if (board[row][col] === '.') {
            for (let num = 1; num <= SIZE; num++) {
              if (isValid(board, row, col, num.toString())) {
                board[row][col] = num.toString();
                if (solveBoard(board)) {
                  return true;
                }
                board[row][col] = '.';
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    const board = [];
    for (let i = 0; i < SIZE; i++) {
      board.push(puzzleString.slice(i * SIZE, (i + 1) * SIZE).split(''));
    }

    if (!solveBoard(board)) {
      return false;
    }

    return board.map((row) => row.join('')).join('');
  }
}

module.exports = SudokuSolver;