const assert = require('chai').assert;
const app = require('../../public/js/SinglePlayerGame');

describe('Single player', function() {


    describe('Task 1', function() {

        describe('checkUserInput()', function() {
            it('should return an error if the length is not 4', function() {
                assert.notEqual(app.SinglePlayerGame().checkUserInput([1, 2, 3] && [1, 2, 3, 4, 5]).err, "");

            });

            it('should return an error if the numbers repeat', function() {
                assert.notEqual(app.SinglePlayerGame().checkUserInput([1, 2, 3, 3] && [5, 6, 3, 3]).err, "");

            });

            it('should return an error if the input is not a number', function() {
                assert.notEqual(app.SinglePlayerGame().checkUserInput("test" && true).err, "");

            });

            it('should return an error if the input is out of range 0-7', function() {
                assert.notEqual(app.SinglePlayerGame().checkUserInput([-1, -5, 3, 5] && [7, 8, 9, 10]).err, "");

            });

            /*it('should return an error if the input is repeated', function() {
                assert.notEqual(app.SinglePlayerGame().checkUserInput([1, 2, 3, 4] && [1, 2, 3, 4]).err, "");

            });*/

            it('should not return an error if the input is correct', function() {
                assert.equal(app.SinglePlayerGame().checkUserInput([1, 2, 3, 4] && [5, 6, 7, 4]).err, "");
            });

        })

        describe('isNumericInput()', function() {
            it('should return true when a number is given', function() {
                assert.equal(app.SinglePlayerGame().isNumericInput(1234), true);
            });

            it('should return false when a string is given', function() {
                assert.equal(app.SinglePlayerGame().isNumericInput("test"), false);
            });

        })

        describe('checkNumbersRepeat()', function() {

            it('should return true if they repeat', function() {
                assert.equal(app.SinglePlayerGame().checkNumbersRepeat([1, 2, 3, 3]), true);
            });

            it('should return false if they don\'t repeat', function() {
                assert.equal(app.SinglePlayerGame().checkNumbersRepeat([1, 2, 3, 4]), false);
            });

        })
    })
});



// to run the checks open the terminal (ctrl + `) and type "npm run test".