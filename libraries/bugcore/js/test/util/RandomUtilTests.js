/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Obj')
//@Require('RandomUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var RandomUtil    = bugpack.require('RandomUtil');
    var Obj         = bugpack.require('Obj');
    var BugMeta     = bugpack.require('bugmeta.BugMeta');
    var TestTag     = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta     = BugMeta.context();
    var test        = TestTag.test;


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
            var randomNumber1 = RandomUtil.randomBetween(0, 0);
            test.assertEqual(randomNumber1, 0,
                "Assert random number is 0");

            var randomNumber2 = RandomUtil.randomBetween(0, 1);
            test.assertTrue((randomNumber2 === 0 || randomNumber2 === 1),
                "Assert random number is either equal to 0 or equal to 1");

            var randomNumber3 = RandomUtil.randomBetween(3, 4);
            test.assertTrue((randomNumber3 === 3 || randomNumber3 === 4),
                "Assert random number is either equal to 3 or equal to 4");
        }
    };

    /**
     * This tests
     * 1) Getting a random hex of length 0
     * 2) Getting a random hex of length 1
     * 3) Getting a random hex of length 4
     */
    var randomHexTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            this.validHexValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
            this.isValidHexString = function(hex) {
                for (var i = 0, size = hex.length; i < size; i++) {
                    var hexVal = hex[i];
                    var result = _this.validHexValues.indexOf(hexVal) > -1;
                    if (!result) {
                        return false;
                    }
                }
                return true;
            }
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var randomHex0 = RandomUtil.randomHex(0);
            test.assertEqual(randomHex0, "",
                "Assert random hex of length 0 is empty");

            var randomHex1 = RandomUtil.randomHex(1);
            test.assertTrue(randomHex1.length === 1,
                "Assert random hex length is 1");
            test.assertTrue(this.isValidHexString(randomHex1),
                    "Assert value hex value '" + randomHex1 + "' is a valid hex value");

            var randomHex4 = RandomUtil.randomHex(4);
            test.assertTrue(randomHex1.length === 4,
                "Assert random hex length is 4");
            test.assertTrue(this.isValidHexString(randomHex4),
                    "Assert value hex value '" + randomHex4 + "' is a valid hex value");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(randomBetweenTest).with(
        test().name("RandomUtil - randomBetween test")
    );
    bugmeta.tag(randomHexTest).with(
        test().name("RandomUtil - randomHex test")
    );
});
