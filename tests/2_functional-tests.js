const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

//let validPuzzle = '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51';
let validPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

let validCompletePuzzle = '827549163531672894649831527496157382218396475753284916962415738185763249374928651';
let invalidPuzzle = '82..4..6...16..89...98314.749.157.............53..4...96.415..81..7632..3...28.51';


suite('Functional Tests', () => {
    //Solve a puzzle with valid puzzle string: POST request to /api/solve
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.solution, '827549163531672894649831527496157382218396475753284916962415738185763249374928651');
                done();
            });
    });
    //Solve a puzzle with missing puzzle string: POST request to /api/solve
    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({})
            .end((_, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body.error, { error: 'Required field missing' });
                done();
            });
    });
    //Solve a puzzle with invalid characters: POST request to /api/solve
    test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.5a' })
            .end((_, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body.error, { error: 'Invalid characters in puzzle' });
                done();
            });
    });
    //Solve a puzzle with incorrect length: POST request to /api/solve
    test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.7...3' })
            .end((_, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body.error, { error: 'Expected puzzle to be 81 characters long' })
                done();
            });
    });
    //Solve a puzzle that cannot be solved: POST request to /api/solve
    test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
        chai.request(server)
        .post('/api/solve')
        .send({ puzzle: invalidPuzzle })
        .end((_, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Puzzle cannot be solved');
            done();
        });
    });
    //Check a puzzle placement with all fields: POST request to /api/check
    test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", coordinate: "A1", value: "7" })
            .end((_, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, true);
                done();
            });
    });
    //Check a puzzle placement with single placement conflict: POST request to /api/check
    test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: validPuzzle, 
                coordinate: "A3", value: 8 })
            .end((_, res) => {
                assert.equal(res.status, 200);
               
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 1);
                done();
            });
    });
});

