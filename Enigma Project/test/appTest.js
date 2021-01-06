const assert = require('chai').assert;
const app = require('../js/SinglePlayerGame');

let genRandNumRes = app.SinglePlayerGame(1).generateGameNumbers();
let checkNumRepRes = app.SinglePlayerGame(1).checkNumbersRepeat(genRandNumRes);

//let test = new app.SinglePlayerGame(1);

//let genRandNumRes = test.SinglePlayerGame.genRandNumRes();
//let checkNumRepRes = test.SinglePlayerGamecheckNumbersRepeat(genRandNumRes);


describe('Single player', function() {


    describe('Task 1', function() {

        describe('isGameOver()', function() {
            it('should return false when the game isn\'t over', function() {
                assert.equal(app.SinglePlayerGame(1).isGameOver(), false)
            });

            // it('should return true when the game is over', function() {
            //     assert.equal(app.SinglePlayerGame.isGameOver(), false)
            // });

        })

        describe('generateRandomNumbers()', function() {
            it('should only generates numbers in range: 0-7', function() {
                let check = true;

                for (let i = 0; i < 4; i++) {
                    if (genRandNumRes[i] > 7 || genRandNumRes[i] < 0) {
                        check = false;
                    }
                }

                assert.equal(check, true)
            });

            it('should return only numbers', function() {

                let check = true;

                for (let i = 0; i < 4; i++) {
                    if (genRandNumRes[i] === NaN) {
                        check = false;
                    }
                }

                assert.equal(check, true)
            })

            it('should return only 4 numbers', function() {
                assert.equal(genRandNumRes.length, 4)
            })

        })

        describe('checkNumbersRepeat()', function() {
            it('should return true when they repeat', function() {
                assert.equal(app.SinglePlayerGame(1).checkNumbersRepeat([1, 2, 3, 3]), true);

            });

            it('should return false when they don\'t repeat', function() {
                assert.equal(app.SinglePlayerGame(1).checkNumbersRepeat([1, 2, 3, 4]), false);

            });

            it('should return false when the size usn\'t equal to 4', function() {
                assert.equal(app.SinglePlayerGame(1).checkNumbersRepeat([1, 3, 3]), false);

            });
        })

        describe('checkNumbersRepeat()', function() {
            it('should return true when they repeat', function() {


            });

            it('should return false when they don\'t repeat', function() {


            });
        })
    })
});