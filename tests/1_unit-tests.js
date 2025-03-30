const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

let validPuzzle = '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51';
suite('Unit Tests', () => {
    suite('Solver Tests', () => {
        test('Valid puzzle string of 81 characters', () => {
            let completePuzzle = '827549163531672894649831527496157382218396475753284916962415738185763249374928651';
            assert.equal(solver.solve(validPuzzle), completePuzzle);
        });
        //continue from here
        test('Invalid puzzle string length', () => {
            assert.deepEqual(solver.validate('123456789'), { error: 'Expected puzzle to be 81 characters long' });
        });
        test('Invalid characters in puzzle string', () => {
            assert.deepEqual(solver.validate('1234567890'), { error: 'Invalid characters in puzzle' });
        });
        test('Valid characters in puzzle string', () => {
            assert.equal(solver.validate(validPuzzle), "Valid");
        });
    });
});
