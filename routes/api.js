'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    if (!puzzle || !coordinate || !value) {
      return res.json({ error: 'Required field(s) missing' });
    }

    const validationResult = solver.validate(puzzle);
    if (validationResult !== 'Valid') {
      return res.json({ error: validationResult.error }); // Access the error property
    }

    if (typeof coordinate !== 'string' || coordinate.length !== 2) {
      return res.json({ error: 'Invalid coordinate' });
    }

    const row = coordinate[0].toUpperCase();
    const column = coordinate[1];

    if (!/^[A-I]$/.test(row) || !/^[1-9]$/.test(column)) {
      return res.json({ error: 'Invalid coordinate' });
    }

    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: 'Invalid value' });
    }

    const index = (solver.letterToNumber(row) - 1) * 9 + (parseInt(column) - 1);

    if (puzzle[index] === value) {
      return res.json({ valid: true });
    }

    const validCol = solver.checkColPlacement(puzzle, row, column, parseInt(value)); // Ensure value is a number
    const validRegion = solver.checkRegionPlacement(puzzle, row, column, parseInt(value)); // Ensure value is a number
    const validRow = solver.checkRowPlacement(puzzle, row, column, parseInt(value)); // Ensure value is a number

    const conflicts = [];
    if (validCol && validRow && validRegion) {
      res.json({ valid: true });
    } else {
      if (!validRow) {
        conflicts.push('row');
      }
      if (!validCol) {
        conflicts.push('column');
      }
      if (!validRegion) {
        conflicts.push('region');
      }
      res.json({ valid: false, conflict: conflicts });
    }
  });
    
  app.route('/api/solve')
    .post((req, res) => {
       const puzzle = req.body.puzzle;
       if(solver.validate(puzzle) !== "Valid" ){
        res.json({ error: solver.validate(puzzle) });
        return;
      }
       const solution = solver.solve(puzzle);
       if(!solution) {
         res.json({ error: 'Puzzle cannot be solved' });
         return;
       }
       res.json({ solution: solution });
       return;
    });
};
