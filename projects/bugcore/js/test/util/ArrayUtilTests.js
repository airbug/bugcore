/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('ArrayUtil')
//@Require('Class')
//@Require('IdGenerator')
//@Require('TypeUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArrayUtil       = bugpack.require('ArrayUtil');
    var Class           = bugpack.require('Class');
    var IdGenerator     = bugpack.require('IdGenerator');
    var TypeUtil        = bugpack.require('TypeUtil');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestTag         = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var test            = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests
     * 1) That the static method .isEqual correctly works for a shallow equality test
     */
    var arrayUtilIsEqualBasicTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testObject = {};
            this.testArray = ["A", 1, this.testObject];
            this.testEqualArray = ["A", 1, this.testObject];
            this.testNotEqualArray = ["B", 1, this.testObject];
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(ArrayUtil.isEqual(this.testArray, this.testArray), true,
                "Assert .isEqual() check returns true for comparison against the same instance");
            test.assertEqual(ArrayUtil.isEqual(this.testArray, this.testEqualArray), true,
                "Assert .isEqual() check returns true for different array instances that have equal contents");
            test.assertEqual(ArrayUtil.isEqual(this.testArray, this.testNotEqualArray), false,
                "Assert .isEqual() check returns false for different array instances that do not have equal contents");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(arrayUtilIsEqualBasicTest).with(
        test().name("ArrayUtil - .isEqual() basic test")
    );
});
