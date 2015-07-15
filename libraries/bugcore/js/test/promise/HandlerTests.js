/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Handler')
//@Require('Promise')
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
    var Handler     = bugpack.require('Handler');
    var Promise     = bugpack.require('Promise');
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
     * 1) Instantiation of a basic Handler
     */
    var handlerInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testForwardPromise     = new Promise();
            this.testHandler            = new Handler(this.testForwardPromise);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testHandler, Handler),
                "Assert that testHandler is an instance of Handler");
            test.assertEqual(this.testHandler.getForwardPromise(), this.testForwardPromise,
                "Assert that #getForwardPromise returns the Promise passed in during instantiation");
        }
    };

    /**
     * This tests
     * 1) #fireHandleMethod test with method that throws exception
     */
    var handlerFireHandleMethodWithThrowTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            var _this = this;
            this.testError              = new Error();
            this.testMethod             = function() {
                throw _this.testError;
            };
            this.testForwardPromise     = new Promise();
            this.testHandler            = new Handler(this.testForwardPromise);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testHandler.fireHandleMethod(this.testMethod, []);
            test.assertTrue(this.testForwardPromise.isRejected(),
                "Assert that the forward promise has been rejected");
            test.assertEqual(this.testForwardPromise.getReasonList().getCount(), 1,
                "Assert that the reasonList contains 1 reason");
            if (this.testForwardPromise.getReasonList().getCount() === 1) {
                test.assertEqual(this.testForwardPromise.getReasonList().getAt(0), this.testError,
                    "Assert that the reason at index 0 is the testError");
            }
        }
    };

    /**
     * This tests
     * 1) #fireHandleMethod test with method that returns value
     */
    var handlerFireHandleMethodWithReturnTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            var _this = this;
            this.testValue              = "testValue";
            this.testMethod             = function() {
                return _this.testValue;
            };
            this.testForwardPromise     = new Promise();
            this.testHandler            = new Handler(this.testForwardPromise);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testHandler.fireHandleMethod(this.testMethod, []);
            test.assertTrue(this.testForwardPromise.isFulfilled(),
                "Assert that the forward promise has been fulfilled");
            test.assertEqual(this.testForwardPromise.getValueList().getCount(), 1,
                "Assert that the valueList contains 1 reason");
            if (this.testForwardPromise.getValueList().getCount() === 1) {
                test.assertEqual(this.testForwardPromise.getValueList().getAt(0), this.testValue,
                    "Assert that the value at index 0 is the testValue");
            }
        }
    };

    /**
     * This tests
     * 1) #fireHandleMethod test with method that returns no value
     */
    var handlerFireHandleMethodWithReturnNoValueTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testMethod             = function() {
            };
            this.testForwardPromise     = new Promise();
            this.testHandler            = new Handler(this.testForwardPromise);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testHandler.fireHandleMethod(this.testMethod, []);
            test.assertTrue(this.testForwardPromise.isFulfilled(),
                "Assert that the forward promise has been fulfilled");
            test.assertEqual(this.testForwardPromise.getValueList().getCount(), 0,
                "Assert that the valueList contains 0 values");
        }
    };

    /**
     * This tests
     * 1) call #handleFulfilled once test
     * 2) That #handleFulfilled throws an AbstractMethodNotImplemented bug when not implemented
     */
    var handlerCallHandleFulfilledOnceTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testForwardPromise     = new Promise();
            this.testHandler            = new Handler(this.testForwardPromise);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertThrows(function() {
                try {
                    _this.testHandler.handleFulfilled([]);
                } catch(e) {
                    test.assertEqual(e.getType(), "AbstractMethodNotImplemented",
                        "Assert error is of type AbstractMethodNotImplemented");
                    throw e;
                }
            }, "Assert that calling handleFulfilled once throws an AbstractMethodNotImplemented bug when not implemented");
        }
    };

    /**
     * This tests
     * 1) call #handleRejected once test
     * 2) That #handleRejected throws an AbstractMethodNotImplemented bug when not implemented
     */
    var handlerCallHandleRejectedOnceTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testForwardPromise     = new Promise();
            this.testHandler            = new Handler(this.testForwardPromise);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertThrows(function() {
                try {
                    _this.testHandler.handleRejected([]);
                } catch(e) {
                    test.assertEqual(e.getType(), "AbstractMethodNotImplemented",
                        "Assert error is of type AbstractMethodNotImplemented");
                    throw e;
                }
            }, "Assert that calling handleFulfilled once throws an AbstractMethodNotImplemented bug when not implemented");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(handlerInstantiationTest).with(
        test().name("Handler - instantiation test")
    );
    bugmeta.tag(handlerFireHandleMethodWithThrowTest).with(
        test().name("Handler - #fireHandleMethod with throw test")
    );
    bugmeta.tag(handlerFireHandleMethodWithReturnTest).with(
        test().name("Handler - #fireHandleMethod with method that returns value test")
    );
    bugmeta.tag(handlerFireHandleMethodWithReturnNoValueTest).with(
        test().name("Handler - #fireHandleMethod with method that returns NO value test")
    );
    bugmeta.tag(handlerCallHandleFulfilledOnceTest).with(
        test().name("Handler - call #handleFulfilled once test")
    );
    bugmeta.tag(handlerCallHandleRejectedOnceTest).with(
        test().name("Handler - call #handleRejected once test")
    );
});
