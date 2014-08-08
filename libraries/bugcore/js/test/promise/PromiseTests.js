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
//@Require('Promise')
//@Require('TypeUtil')
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
    var TypeUtil        = bugpack.require('TypeUtil');
    var BugDouble       = bugpack.require('bugdouble.BugDouble');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestTag         = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var spyOnFunction   = BugDouble.spyOnFunction;
    var spyOnObject     = BugDouble.spyOnObject;
    var test            = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests
     * 1) Instantiation of a basic Promise
     */
    var promiseInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testPromise = new Promise();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testPromise, Promise),
                "Assert that testPromise is an instance of Promise");
            test.assertTrue(this.testPromise.isPending(),
                "Assert that the promise defaults to 'pending'");
            test.assertEqual(this.testPromise.getHandlerList().getCount(), 0,
                "Assert that the handler list is empty");
        }
    };

    /**
     * This tests
     * 1) #then method of a Promise using no arguments
     */
    var promiseThenNoArgumentsTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testPromise = new Promise();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var resultPromise = this.testPromise.then();
            test.assertNotEqual(resultPromise, this.testPromise,
                "Assert that the returned promise is not the same promise as the testPromise");
            test.assertEqual(this.testPromise.getHandlerList().getCount(), 0,
                "Assert that the handlerList has 0 handlers");
        }
    };

    /**
     * This tests
     * 1) #then method of a Promise providing the fulfilledFunction argument only
     */
    var promiseThenFulfilledFunctionArgumentOnlyTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testPromise            = new Promise();
            this.testFulfilledFunction  = function() {};
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var resultPromise = this.testPromise.then(this.testFulfilledFunction);
            test.assertNotEqual(resultPromise, this.testPromise,
                "Assert that the returned promise is not the same promise as the testPromise");
            test.assertEqual(this.testPromise.getHandlerList().getCount(), 1,
                "Assert that the handlerList has 1 handlers");
        }
    };

    /**
     * This tests
     * 1) #then method of a Promise providing the rejectedFunction argument only
     */
    var promiseThenRejectedFunctionArgumentOnlyTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testPromise            = new Promise();
            this.testRejectedFunction   = function() {};
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var resultPromise = this.testPromise.then(null, this.testRejectedFunction);
            test.assertNotEqual(resultPromise, this.testPromise,
                "Assert that the returned promise is not the same promise as the testPromise");
            test.assertEqual(this.testPromise.getHandlerList().getCount(), 1,
                "Assert that the handlerList has 1 handlers");
        }
    };

    /**
     * This tests
     * 1) calling #resolvePromise twice throws a Bug
     */
    var promiseResolvePromiseTwiceBugTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testPromise            = new Promise();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            this.testPromise.resolvePromise([]);
            test.assertThrows(function() {
                _this.testPromise.resolvePromise([]);
            }, "Assert that calling #resolvePromise again throws a Bug");
        }
    };

    /**
     * This tests
     * 1) calling #rejectProcess twice throws a Bug
     */
    var promiseRejectPromiseTwiceBugTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testPromise            = new Promise();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            this.testPromise.rejectPromise([]);
            test.assertThrows(function() {
                _this.testPromise.rejectPromise([]);
            }, "Assert that calling #rejectPromise again throws a Bug");
        }
    };

    /**
     * This tests
     * 1) calling #rejectProcess and then #resolvePromise throws a Bug
     */
    var promiseRejectPromiseAndResolvePromiseBugTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testPromise    = new Promise();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            this.testPromise.rejectPromise([]);
            test.assertThrows(function() {
                _this.testPromise.resolvePromise([]);
            }, "Assert that calling #resolvePromise after rejectPromise has already been called throws a Bug");
        }
    };

    /**
     * This tests
     * 1) calling #resolvePromise and passing the promises self as an arg rejects the promise with a TypeError Bug
     */
    var promiseResolvePromiseWithSelfShouldRejectPromiseTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testPromise    = new Promise();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testPromise.resolvePromise([this.testPromise]);
            test.assertTrue(this.testPromise.isRejected(),
                "Assert that the promise has been rejected");
            test.assertEqual(this.testPromise.getReasonList().getCount(), 1,
                "Assert that the testPromise has one reason it's been rejected");
            if (this.testPromise.getReasonList().getCount() === 1) {
                var bug = this.testPromise.getReasonList().getAt(0);
                test.assertEqual(bug.getType(), "TypeError",
                    "Assert that the reason list is a Bug with the type 'TypeError'");
            }
        }
    };

    /**
     * This tests
     * 1) calling #resolvePromise and passing two references of the promises self as args should reject promise once
     */
    var promiseResolvePromiseWithTwoCopiesOfSelfShouldRejectOnceTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testPromise        = new Promise();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testPromise.resolvePromise([this.testPromise, this.testPromise]);
            test.assertTrue(this.testPromise.isRejected(),
                "Assert that the promise has been rejected");
            test.assertEqual(this.testPromise.getReasonList().getCount(), 1,
                "Assert that the testPromise has one reason it's been rejected");
            if (this.testPromise.getReasonList().getCount() === 1) {
                var bug = this.testPromise.getReasonList().getAt(0);
                test.assertEqual(bug.getType(), "TypeError",
                    "Assert that the reason list is a Bug with the type 'TypeError'");
            }
        }
    };

    /**
     * This tests
     * 1) calling #resolvePromise with empty values test
     */
    var promiseResolvePromiseWithEmptyValuesTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testPromise        = new Promise();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testPromise.resolvePromise([]);
            test.assertTrue(this.testPromise.isFulfilled(),
                "Assert that the promise has been fulfilled");
            test.assertTrue(this.testPromise.getValueList().isEmpty(),
                "Assert that the testPromise's valueList is empty");
        }
    };

    /**
     * This tests
     * 1) calling #resolvePromise with a single value test
     */
    var promiseResolvePromiseWithSingleValueTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testPromise        = new Promise();
            this.testValueA         = "ValueA";
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testPromise.resolvePromise([this.testValueA]);
            test.assertTrue(this.testPromise.isFulfilled(),
                "Assert that the promise has been fulfilled");
            test.assertEqual(this.testPromise.getValueList().getCount(), 1,
                "Assert that the testPromise's valueList contains 1 value");
            test.assertEqual(this.testPromise.getValueList().getAt(0), this.testValueA,
                "Assert that the testPromise's valueList[0] is testValueA");
        }
    };

    /**
     * This tests
     * 1) calling #then with a fulfilled function after promise has been fulfilled
     * 2) Promises A+ 2.2.4 is fulfilled: onFulfilled or onRejected must not be called until the execution context stack contains only platform code.
     */
    var promiseThenWithFulfilledFunctionAfterPromiseIsFulfilledTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            var _this                       = this;
            this.testPromise                = new Promise();
            this.testValueA                 = "ValueA";
            this.testFulfilledFunction      = function(value1) {
                test.assertEqual(value1, _this.testValueA,
                    "Assert that value1 is testValueA")
            };
            this.testFulfilledFunctionSpy   = spyOnFunction(this.testFulfilledFunction);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testPromise.resolvePromise([this.testValueA]);
            test.assertTrue(this.testPromise.isFulfilled(),
                "Assert that the promise has been fulfilled");
            test.assertEqual(this.testPromise.getValueList().getAt(0), this.testValueA,
                "Assert that the testPromise's valueList[0] is testValueA");
            var forwardPromise = this.testPromise.then(this.testFulfilledFunctionSpy);
            test.assertFalse(forwardPromise.isFulfilled(),
                "Assert that the forwardPromise has NOT been fulfilled");
            test.assertTrue(forwardPromise.getValueList().isEmpty(),
                "Assert that the forwardPromise's valueList is empty");

            //NOTE BRN: This validates that Promises A+ 2.2.4 is met

            test.assertTrue(this.testFulfilledFunctionSpy.wasNotCalled(),
                "Assert that the fulfilledFunction is not immediately called")
        },

        final: function(test) {
            test.assertTrue(this.testFulfilledFunctionSpy.wasCalled(),
                "Assert that the fulfilledFunction was called");
        }
    };

    /**
     * This tests
     * 1) calling #then without a fulfilled function after promise has been fulfilled
     * 2) Promises A+ - 2.2.7.3: If onFulfilled is not a function and promise1 is fulfilled, promise2 must be fulfilled with the same value as promise1.
     */
    var promiseThenWithoutFulfilledFunctionAfterPromiseIsFulfilledTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testPromise        = new Promise();
            this.testValueA         = "ValueA";
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testPromise.resolvePromise([this.testValueA]);
            test.assertTrue(this.testPromise.isFulfilled(),
                "Assert that the promise has been fulfilled");
            test.assertEqual(this.testPromise.getValueList().getAt(0), this.testValueA,
                "Assert that the testPromise's valueList[0] is testValueA");
            var forwardPromise = this.testPromise.then(this.testFulfilledFunctionSpy);
            test.assertTrue(forwardPromise.isFulfilled(),
                "Assert that the forwardPromise has been fulfilled");
            test.assertEqual(forwardPromise.getValueList().getAt(0), this.testValueA,
                "Assert that the forwardPromise's valueList[0] is testValueA");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(promiseInstantiationTest).with(
        test().name("Promise - instantiation test")
    );
    bugmeta.tag(promiseThenNoArgumentsTest).with(
        test().name("Promise - #then no arguments test")
    );
    bugmeta.tag(promiseThenFulfilledFunctionArgumentOnlyTest).with(
        test().name("Promise - #then fulfilledArgument only test")
    );
    bugmeta.tag(promiseThenRejectedFunctionArgumentOnlyTest).with(
        test().name("Promise - #then rejectedArgument only test")
    );
    bugmeta.tag(promiseResolvePromiseTwiceBugTest).with(
        test().name("Promise - #resolvePromise twice should throw a Bug test")
    );
    bugmeta.tag(promiseRejectPromiseTwiceBugTest).with(
        test().name("Promise - #rejectProcess twice should throw a Bug test")
    );
    bugmeta.tag(promiseRejectPromiseAndResolvePromiseBugTest).with(
        test().name("Promise - #rejectProcess and resolvePromise should throw a Bug test")
    );
    bugmeta.tag(promiseResolvePromiseWithSelfShouldRejectPromiseTest).with(
        test().name("Promise - #resolvePromise with self as arg should reject the promise with a TypeError Bug test")
    );
    bugmeta.tag(promiseResolvePromiseWithTwoCopiesOfSelfShouldRejectOnceTest).with(
        test().name("Promise - #resolvePromise and passing two references of the promises self as args should reject promise once")
    );
    bugmeta.tag(promiseResolvePromiseWithEmptyValuesTest).with(
        test().name("Promise - #resolvePromise with empty values")
    );
    bugmeta.tag(promiseResolvePromiseWithSingleValueTest).with(
        test().name("Promise - #resolvePromise with a single value")
    );
    bugmeta.tag(promiseThenWithFulfilledFunctionAfterPromiseIsFulfilledTest).with(
        test().name("Promise - #then with fulfilledFunction after promise is fulfilled test")
    );
    bugmeta.tag(promiseThenWithoutFulfilledFunctionAfterPromiseIsFulfilledTest).with(
        test().name("Promise - #then with fulfilledFunction after promise is fulfilled test")
    );
});
