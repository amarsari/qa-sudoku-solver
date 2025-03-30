const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

let validPuzzle = '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51';
let completePuzzle = '827549163531672894649831527496157382218396475753284916962415738185763249374928651';

suite('Unit Tests', () => {
    suite('Solver Tests', () => {
        test('Valid puzzle string of 81 characters', () => {
            
            assert.equal(solver.solve(validPuzzle), completePuzzle);
        });
        test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
            assert.equal(solver.solve('invalid puzzle'), false);
        });
        test('Logic handles a puzzle string that is not 81 characters in length', () => {
            assert.equal(solver.solve('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51.'), false);
        });
        test('Logic handles a valid row placement', () => {
            
            assert.equal(solver.checkRowPlacement(validPuzzle, "A", "2", "9"), true);
        });
        test('Logic handles an invalid row placement', () => {
            assert.equal(solver.checkRowPlacement(validPuzzle, "A", "2", "1"), true);
        });
        test('Logic handles a valid column placement', () => {
            assert.equal(solver.checkColPlacement(validPuzzle, "A", "2", "8"), true);
        });
        test('Logic handles an invalid column placement', () => {
            assert.equal(solver.checkColPlacement(validPuzzle, "A", "2", "9"), true);
        });
        test('Logic handles a valid region (3x3 grid) placement', () => {
            assert.equal(solver.checkRegionPlacement(validPuzzle, "A", "2", "0"), true);
        });
        test('Logic handles an invalid region (3x3 grid) placement', () => {
            assert.equal(solver.checkRegionPlacement(validPuzzle, "A", "2", "1"), true);
        });
        test('Valid puzzle strings pass the solver', () => {
            let solvedPuzzle = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
            assert.equal(solver.solve(solvedPuzzle), solvedPuzzle);
        });
        test('Invalid puzzle strings fail the solver', () => {
            assert.equal(solver.solve('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51a'), false);
        });
        test('Solver returns the expected solution for a valid puzzle', () => {
            let completePuzzle = '827549163531672894649831527496157382218396475753284916962415738185763249374928651';
            assert.equal(solver.solve(validPuzzle), completePuzzle);
        });
    });
});
