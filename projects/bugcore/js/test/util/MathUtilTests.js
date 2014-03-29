//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('MathUtil')
//@Require('Obj')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var MathUtil        = bugpack.require('MathUtil');
var Obj             = bugpack.require('Obj');
var BugMeta         = bugpack.require('bugmeta.BugMeta');
var TestAnnotation  = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta         = BugMeta.context();
var test            = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/**
 * This tests
 * 1) Getting a random number between 0 and 0
 * 2) Getting a random number between 0 and 1
 * 3) Getting a random number between 3 and 4
 */
var randomBetweenTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {

    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var randomNumber1 = MathUtil.randomBetween(0, 0);
        test.assertEqual(randomNumber1, 0,
            "Assert random number is 0");

        var randomNumber2 = MathUtil.randomBetween(0, 1);
        test.assertTrue((randomNumber2 === 0 || randomNumber2 === 1),
            "Assert random number is either equal to 0 or equal to 1");

        var randomNumber3 = MathUtil.randomBetween(3, 4);
        test.assertTrue((randomNumber3 === 3 || randomNumber3 === 4),
            "Assert random number is either equal to 3 or equal to 4");
    }
};
bugmeta.annotate(randomBetweenTest).with(
    test().name("Random between test")
);
