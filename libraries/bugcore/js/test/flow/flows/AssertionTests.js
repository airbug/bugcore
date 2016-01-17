/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Assertion')
//@Require('Class')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Assertion   = bugpack.require('Assertion');
    var Class       = bugpack.require('Class');
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
     * This tests..
     * 1) Assertion instantiation
     */
    var assertionInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testAssertionMethod    = function(flow) {};
            this.testAssertion          = new Assertion(this.testAssertionMethod);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testAssertion, Assertion),
                "Assert testAssertion extends Assertion");
            test.assertEqual(this.testAssertion.getAssertionMethod(), this.testAssertionMethod,
                "Assert Assertion.assertionMethod was set correctly");
            test.assertEqual(this.testAssertion.getAssertCalled(), false,
                "Assert Assertion.assertedCalled defaults to false");
        }
    };

    /**
     * This tests..
     * 1) That the Assertion correctly completes after assert is called
     * 2) That the Flow correctly executes the callback
     */
    var assertionAssertTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            this.assertionMethodCalled  = false;
            this.callbackCalled         = false;
            this.testAssertionMethod    = function(flow) {
                _this.assertionMethodCalled = true;
                flow.assert(_this.testAssertValue);
            };
            this.testAssertion          = new Assertion(this.testAssertionMethod);
            this.testAssertValue        = true;
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            this.testAssertion.execute(function(throwable, result) {
                _this.callbackCalled = true;
                test.assertEqual(throwable, null,
                    "Assert throwable is null");
                test.assertEqual(result, _this.testAssertValue,
                    "Assert value was passed to callback correctly");
            });
            test.assertTrue(this.assertionMethodCalled,
                "Assert assertion method called");
            test.assertTrue(this.callbackCalled,
                "Assert callback was called");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(assertionInstantiationTest).with(
        test().name("Assertion - instantiation test")
    );
    bugmeta.tag(assertionAssertTest).with(
        test().name("Assertion - #assert test")
    );
});
