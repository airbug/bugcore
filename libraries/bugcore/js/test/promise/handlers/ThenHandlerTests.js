/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Promise')
//@Require('ThenHandler')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Promise         = bugpack.require('Promise');
    var ThenHandler     = bugpack.require('ThenHandler');
    var BugDouble       = bugpack.require('bugdouble.BugDouble');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestTag         = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var spyOnFunction   = BugDouble.spyOnFunction;
    var bugmeta         = BugMeta.context();
    var test            = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests
     * 1) Instantiation of a basic ThenHandler
     */
    var thenHandlerInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testFulfilledFunction  = function() {};
            this.testRejectedFunction   = function() {};
            this.testForwardPromise     = new Promise();
            this.testThenHandler   = new ThenHandler(this.testFulfilledFunction, this.testRejectedFunction, this.testForwardPromise);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testThenHandler, ThenHandler),
                "Assert that testThenHandler is an instance of ThenHandler");
            test.assertEqual(this.testThenHandler.getFulfilledFunction(), this.testFulfilledFunction,
                "Assert that #getFulfilledFunction returns the method passed in during instantiation");
            test.assertEqual(this.testThenHandler.getRejectedFunction(), this.testRejectedFunction,
                "Assert that #getRejectedFunction returns the method passed in during instantiation");
            test.assertEqual(this.testThenHandler.getForwardPromise(), this.testForwardPromise,
                "Assert that #getForwardPromise returns the Promise passed in during instantiation");
        }
    };

    /**
     * This tests
     * 1) calling #handleFulfilled using no values on a ThenHandler
     */
    var thenHandlerHandleFulfilledNoValuesTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testValues                 = [];
            this.testFulfilledFunction      = function() {
                test.assertEqual(arguments.length, 0,
                    "Assert no arguments were passed to the fulfilled function");
            };
            this.testFulfilledFunctionSpy   = spyOnFunction(this.testFulfilledFunction);
            this.testRejectedFunction       = function() {};
            this.testRejectedFunctionSpy    = spyOnFunction(this.testRejectedFunction);
            this.testForwardPromise         = new Promise();
            this.testThenHandler   = new ThenHandler(this.testFulfilledFunctionSpy, this.testRejectedFunctionSpy, this.testForwardPromise);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testThenHandler.handleFulfilled(this.testValues);
            test.assertTrue(this.testFulfilledFunctionSpy.wasCalled(),
                "Assert testFulfilledFunction was called");
            test.assertTrue(this.testRejectedFunctionSpy.wasNotCalled(),
                "Assert testRejectedFunction was not called");
            test.assertTrue(this.testForwardPromise.isFulfilled(),
                "Assert testForwardPromise is resolved");
            test.assertEqual(this.testForwardPromise.getValueList().getCount(), 0,
                "Assert testForwardPromise was resolved with 0 values");
        }
    };

    /**
     * This tests
     * 1) calling #handleFulfilled using no values on a ThenHandler with no fulfilledFunction
     */
    var thenHandlerNoFulfilledFunctionHandleFulfilledNoValuesTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testValues                 = [];
            this.testRejectedFunction       = function() {};
            this.testRejectedFunctionSpy    = spyOnFunction(this.testRejectedFunction);
            this.testForwardPromise         = new Promise();
            this.testThenHandler            = new ThenHandler(null, this.testRejectedFunctionSpy, this.testForwardPromise);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testThenHandler.handleFulfilled(this.testValues);
            test.assertTrue(this.testRejectedFunctionSpy.wasNotCalled(),
                "Assert testRejectedFunction was not called");
            test.assertTrue(this.testForwardPromise.isFulfilled(),
                "Assert testForwardPromise is resolved");
            test.assertEqual(this.testForwardPromise.getValueList().getCount(), 0,
                "Assert testForwardPromise was resolved with 0 values");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(thenHandlerInstantiationTest).with(
        test().name("ThenHandler - instantiation test")
    );
    bugmeta.tag(thenHandlerHandleFulfilledNoValuesTest).with(
        test().name("ThenHandler - #handleFulfilled no values test")
    );
    bugmeta.tag(thenHandlerNoFulfilledFunctionHandleFulfilledNoValuesTest).with(
        test().name("ThenHandler - no fulfilledFunction call #handleFulfilled with no values test")
    );
});
