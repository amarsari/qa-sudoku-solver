'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      if(solver.validate(puzzle) !== "Valid" ){
        res.json({ error: solver.validate(puzzle) });
        return;
      }

      const row = coordinate.split('')[0];
      const column = coordinate.split('')[1];
      if (coordinate.length !== 2 || !/[a-i]/i.test(row) || !/[1-9]/i.test(column)) {
        res.json({ error: 'Invalid coordinate' });
        return;
      }
      if(!/^[1-9]$/.test(value)){
        res.json({ error: 'Invalid value' });
        return;
      }
      let index = (solver.letterToNumber(row) - 1) * 9 + (parseInt(+column) - 1);
      if (puzzle[index] == value) {
        res.json({ valid: true });
        return;
      }

      let validCol = solver.checkColPlacement(puzzle, row, column, value);
      let validRegion = solver.checkRegionPlacement(puzzle, row, column, value);
      let validRow = solver.checkRowPlacement(puzzle, row, column, value);
      let conflicts = [];
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
