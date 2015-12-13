/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('ArrayUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArrayUtil       = bugpack.require('ArrayUtil');
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
            this.testArray = ['A', 1, this.testObject];
            this.testEqualArray = ['A', 1, this.testObject];
            this.testNotEqualArray = ['B', 1, this.testObject];
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(ArrayUtil.isEqual(this.testArray, this.testArray), true,
                'Assert .isEqual() check returns true for comparison against the same instance');
            test.assertEqual(ArrayUtil.isEqual(this.testArray, this.testEqualArray), true,
                'Assert .isEqual() check returns true for different array instances that have equal contents');
            test.assertEqual(ArrayUtil.isEqual(this.testArray, this.testNotEqualArray), false,
                'Assert .isEqual() check returns false for different array instances that do not have equal contents');
        }
    };

    /**
     * This tests
     * 1) That the static method .indexOf correctly works with a Function parameter
     */
    var arrayUtilIndexOfFunctionTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testArray = ['abc', '123', 'def'];
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var index = ArrayUtil.indexOf(this.testArray, function(value) {
                return value === 'def';
            });
            test.assertEqual(index, 2,
                'Assert .indexOf returned index 2 for the Function test');
            var nonExistIndex = ArrayUtil.indexOf(this.testArray, function(value) {
                return value === '456';
            });
            test.assertEqual(nonExistIndex, -1,
                'Assert indexOf returns -1 for a Function value that does not exist');
        }
    };

    /**
     * This tests
     * 1) That the static method .indexOf correctly works with a RegExp parameter
     */
    var arrayUtilIndexOfRegexTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testArray = ['abc', '123', 'def'];
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var index = ArrayUtil.indexOf(this.testArray, /2/);
            test.assertEqual(index, 1,
                'Assert .indexOf returned index 1 for the RegExp test');
            var nonExistIndex = ArrayUtil.indexOf(this.testArray, /4/);
            test.assertEqual(nonExistIndex, -1,
                'Assert indexOf returns -1 for a RegExp value that does not exist');
        }
    };

    /**
     * This tests
     * 1) That the static method .indexOf correctly works with a String parameter
     */
    var arrayUtilIndexOfStringTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testArray = ['abc', '123', 'def'];
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var index = ArrayUtil.indexOf(this.testArray, 'abc');
            test.assertEqual(index, 0,
                'Assert .indexOf returned index 0 for the Regex test');
            var nonExistIndex = ArrayUtil.indexOf(this.testArray, '456');
            test.assertEqual(nonExistIndex, -1,
                'Assert indexOf returns -1 for a String value that does not exist');
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(arrayUtilIsEqualBasicTest).with(
        test().name('ArrayUtil - .isEqual() basic test')
    );
    bugmeta.tag(arrayUtilIndexOfFunctionTest).with(
        test().name('ArrayUtil - .indexOf() Function test')
    );
    bugmeta.tag(arrayUtilIndexOfRegexTest).with(
        test().name('ArrayUtil - .indexOf() Regex test')
    );
    bugmeta.tag(arrayUtilIndexOfStringTest).with(
        test().name('ArrayUtil - .indexOf() String test')
    );
});
