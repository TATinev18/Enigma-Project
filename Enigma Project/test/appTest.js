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

            // it('should return false when the size isn\'t equal to 4', function() {
            //     assert.equal(app.SinglePlayerGame(1).checkNumbersRepeat([1, 3, 3]), false);

            // });
        })

        // describe('checkVictoryConditions()', function() {
        //     it('should win British when they guess the number', function() {
        //         checkVictoryConditions()

        //     });

        //     it('should win German after the last round (13)', function() {


        //     });

        //     it('should return NONE when no one has won yet', function() {


        //     });
        // })


        describe('checkUserInput()', function() {
            it('should return an error if the length is not 4', function() {
                assert.notEqual(app.SinglePlayerGame(1).checkUserInput([1, 2, 3] && [1, 2, 3, 4, 5]).err, "");

            });

            it('should return an error if the numbers repeat', function() {
                assert.notEqual(app.SinglePlayerGame(1).checkUserInput([1, 2, 3, 3] && [5, 6, 3, 3]).err, "");

            });

            it('should return an error if the input is not a number', function() {
                assert.notEqual(app.SinglePlayerGame(1).checkUserInput("test" && true).err, "");

            });

            it('should return an error if the input is out of range 0-7', function() {
                assert.notEqual(app.SinglePlayerGame(1).checkUserInput([-1, -5, 3, 5] && [7, 8, 9, 10]).err, "");

            });

            it('should return an error if the input is repeated', function() {
                assert.notEqual(app.SinglePlayerGame(1).checkUserInput([1, 2, 3, 4] && [1, 2, 3, 4]).err, "");

            });

            it('should not return an error if the input is correct', function() {
                assert.equal(app.SinglePlayerGame(1).checkUserInput([1, 2, 3, 4] && [5, 6, 7, 8]).err, "");
            });

        })

    })
});



// to run the checks open the terminal (ctrl + `) and type "npm run test".