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
//@Require('Promise')
//@Require('ThenHandler')
//@Require('Throwables')
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
    var ThenHandler     = bugpack.require('ThenHandler');
    var Throwables      = bugpack.require('Throwables');
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
            test.assertEqual(this.testPromise.getHandlerList().getCount(), 1,
                "Assert that the handlerList has 1 handler");
            if (this.testPromise.getHandlerList().getCount() === 1) {
                var handler = this.testPromise.getHandlerList().getAt(0);
                test.assertTrue(Class.doesExtend(this.testPromise.getHandlerList().getAt(0), ThenHandler),
                    "Assert handler is ThenHandler");
            }
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
                "Assert that the handlerList has 1 handler");
            if (this.testPromise.getHandlerList().getCount() === 1) {
                var handler = this.testPromise.getHandlerList().getAt(0);
                test.assertTrue(Class.doesExtend(this.testPromise.getHandlerList().getAt(0), ThenHandler),
                    "Assert handler is ThenHandler");
            }
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
                "Assert that the handlerList has 1 handler");
            if (this.testPromise.getHandlerList().getCount() === 1) {
                var handler = this.testPromise.getHandlerList().getAt(0);
                test.assertTrue(Class.doesExtend(this.testPromise.getHandlerList().getAt(0), ThenHandler),
                    "Assert handler is ThenHandler");
            }
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
     * 1) calling #resolvePromise and passing two references of the promises self as args should reject promise once with two reasons
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
            test.assertEqual(this.testPromise.getReasonList().getCount(), 2,
                "Assert that the testPromise has two reasons it's been rejected");
            if (this.testPromise.getReasonList().getCount() === 2) {
                var bug0 = this.testPromise.getReasonList().getAt(0);
                test.assertEqual(bug0.getType(), "TypeError",
                    "Assert that the reasonList[0] is a Bug with the type 'TypeError'");
                var bug1 = this.testPromise.getReasonList().getAt(1);
                test.assertEqual(bug1.getType(), "TypeError",
                    "Assert that the reasonList[1] is a Bug with the type 'TypeError'");
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
     * 1) calling #resolvePromise with a single Promise test
     */
    var promiseResolvePromiseWithSinglePromiseTest = {

        async: true,


        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            this.testPromise        = new Promise();
            this.testPromiseA       = new Promise();
            this.testValueA         = "ValueA";
            this.testFulfilledFunction      = function(value1) {
                test.assertEqual(value1, _this.testValueA,
                    "Assert that value1 is testValueA");
                test.assertTrue(_this.testPromise.isFulfilled(),
                    "Assert that the testPromise is fulfilled");
                test.assertEqual(_this.testPromise.getValueList().getCount(), 1,
                    "Assert that the testPromise's valueList contains 1 value");
                test.assertEqual(_this.testPromise.getValueList().getAt(0), _this.testValueA,
                    "Assert that the testPromise's valueList[0] is testValueA");
                test.completeTest();
            };
            this.testFulfilledFunctionSpy   = spyOnFunction(this.testFulfilledFunction);
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testPromise.resolvePromise([this.testPromiseA]);
            test.assertFalse(this.testPromise.isFulfilled(),
                "Assert that the testPromise has NOT been fulfilled");
            test.assertFalse(this.testPromiseA.isFulfilled(),
                "Assert that testPromiseA has NOT been fulfilled");
            test.assertTrue(this.testPromise.isPending(),
                "Assert that the testPromise is pending");
            test.assertTrue(this.testPromiseA.isPending(),
                "Assert that the testPromiseA is pending");
            this.testPromiseA.resolvePromise([this.testValueA]);

            test.assertTrue(this.testPromiseA.isFulfilled(),
                "Assert that testPromiseA is fulfilled");
            test.assertEqual(this.testPromiseA.getValueList().getCount(), 1,
                "Assert that the testPromiseA's valueList contains 1 value");
            test.assertEqual(this.testPromiseA.getValueList().getAt(0), this.testValueA,
                "Assert that the testPromiseA's valueList[0] is testValueA");

            this.testPromise.then(this.testFulfilledFunctionSpy);
        },

        final: function(test) {
            test.assertTrue(this.testFulfilledFunctionSpy.wasCalled(),
                "Assert that the fulfilledFunction was called");
            test.completeFinalize();
        }
    };

    /**
     * This tests
     * 1) That a forward promise will resolve to a value when only a reject handler was used on the then() call
     * 2) That the rejected handler is not called when a promise is fulfilled
     */
    var promiseRejectHandlerOnlyForwardPromiseTest = {

        async: true,

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this                               = this;
            this.testValueA                         = "testValueA";
            this.testFulfilledPromise               = new Promise();
            this.testRejectedFunction               = function() {};
            this.testForwardFulfilledFunction       = function(value1) {
                test.assertEqual(value1, _this.testValueA,
                    "Assert that value1 is testValueA");
                test.assertTrue(_this.testForwardPromise.isFulfilled(),
                    "Assert that the testForwardPromise is fulfilled");
                test.assertEqual(_this.testForwardPromise.getValueList().getCount(), 1,
                    "Assert that the testForwardPromise's valueList contains 1 value");
                test.assertEqual(_this.testForwardPromise.getValueList().getAt(0), _this.testValueA,
                    "Assert that the testForwardPromise's valueList[0] is testValueA");
                test.completeTest();
            };
            this.testRejectedFunctionSpy            = spyOnFunction(this.testRejectedFunction);
            this.testForwardFulfilledFunctionSpy    = spyOnFunction(this.testForwardFulfilledFunction);
            this.testForwardPromise                 = this.testFulfilledPromise.then(null, this.testRejectedFunctionSpy);
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testForwardPromise.then(this.testForwardFulfilledFunctionSpy);
            this.testFulfilledPromise.resolvePromise([this.testValueA]);
            test.assertTrue(this.testFulfilledPromise.isFulfilled(),
                "Assert that the fulfilled promise has been fulfilled");
        },

        final: function(test) {
            test.assertTrue(this.testRejectedFunctionSpy.wasNotCalled(),
                "Assert that the testRejectedFunction was NOT called");
            test.assertTrue(this.testForwardFulfilledFunctionSpy.wasCalled(),
                "Assert that the testForwardFulfilledFunction was called");
            test.completeFinalize();
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
     * 2) Promises A+ 2.2.5 is fulfilled: onFulfilled and onRejected must be called as functions (i.e. with no this value).
     */
    var promiseOnFulfilledAndOnRejectedCalledAsFunctionsTest = {

        async: true,

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testFulfilledPromise       = new Promise();
            this.testRejectedPromise        = new Promise();
            this.testFulfilledFunction      = function() {
                'use strict';
                var _this = this;
                test.assertEqual(_this, undefined,
                    "Assert that 'this' is undefined in fulfilled method");
            };
            this.testRejectedFunction       = function() {
                'use strict';
                var _this = this;
                test.assertEqual(_this, undefined,
                    "Assert that 'this' is undefined in rejected method");
                test.completeTest();
            };
            this.testFulfilledFunctionSpy   = spyOnFunction(this.testFulfilledFunction);
            this.testRejectedFunctionSpy   = spyOnFunction(this.testRejectedFunction);
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testFulfilledPromise.then(this.testFulfilledFunctionSpy, null);
            this.testFulfilledPromise.resolvePromise([]);
            test.assertTrue(this.testFulfilledPromise.isFulfilled(),
                "Assert that the fulfilled promise has been fulfilled");

            this.testRejectedPromise.then(null, this.testRejectedFunctionSpy);
            this.testRejectedPromise.rejectPromise([]);
            test.assertTrue(this.testRejectedPromise.isRejected(),
                "Assert that the rejected promise has been rejected");
        },

        final: function(test) {
            test.assertTrue(this.testFulfilledFunctionSpy.wasCalled(),
                "Assert that the fulfilledFunction was called");
            test.assertTrue(this.testRejectedFunctionSpy.wasCalled(),
                "Assert that the rejectedFunction was called");
            test.completeFinalize();
        }
    };

    /**
     * This tests
     * 1) Each call to then() returns a different Promise
     * 2) Promises A+ 2.2.6 is fulfilled: then may be called multiple times on the same promise.
     */
    var promiseMultipleCallsToThen = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testPromise       = new Promise();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            var returnedPromise1 = this.testPromise.then(function() {}, null);
            test.assertNotThrows(function() {
                var returnedPromise2 = _this.testPromise.then(function() {}, null);
                test.assertNotEqual(returnedPromise1, returnedPromise2,
                    "Assert returned promise 1 and returned promise 2 are not the same promise");
            }, "Assert calling then() twice in a row does not throw an exception");

            this.testPromise.resolvePromise([]);
            test.assertTrue(this.testPromise.isFulfilled(),
                "Assert that the fulfilled promise has been fulfilled");

            var returnedPromise3 = this.testPromise.then(function() {}, null);
            test.assertNotEqual(returnedPromise1, returnedPromise3,
                "Assert returned process after  promise has been resolved is not the same promise");
        }
    };

    /**
     * This tests
     * 1) Promises A+ 2.2.6.1 is fulfilled: If/when promise is fulfilled, all respective onFulfilled callbacks must execute in the order of their originating calls to then.
     */
    var promiseMultipleCallsToThenFulfilledExecutionOrderTest = {

        async: true,


        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this                       = this;
            this.testValueA                 = "ValueA";
            this.testPromise                = new Promise();
            this.testFulfilledFunction1      = function(value1) {
                test.assertEqual(value1, _this.testValueA,
                    "Assert that value1 is testValueA")
                test.assertTrue(_this.testFulfilledFunction2Spy.wasNotCalled(),
                    "Assert test fulfilled function 2 has not been called yet");
            };
            this.testFulfilledFunction1Spy   = spyOnFunction(this.testFulfilledFunction1);
            this.testFulfilledFunction2      = function(value2) {
                test.assertEqual(value2, _this.testValueA,
                    "Assert that value2 is testValueA");
                test.assertTrue(_this.testFulfilledFunction1Spy.wasCalled(),
                    "Assert test fulfilled function 1 has been called yet");
                test.completeTest();
            };
            this.testFulfilledFunction2Spy   = spyOnFunction(this.testFulfilledFunction2);
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            this.testPromise.then(this.testFulfilledFunction1Spy);
            this.testPromise.then(this.testFulfilledFunction2Spy);
            this.testPromise.resolvePromise([this.testValueA]);
            test.assertTrue(this.testPromise.isFulfilled(),
                "Assert that the fulfilled promise has been fulfilled");
        },

        final: function(test) {
            test.assertTrue(this.testFulfilledFunction1Spy.wasCalled(),
                "Assert that the fulfilledFunction1 was called");
            test.assertTrue(this.testFulfilledFunction2Spy.wasCalled(),
                "Assert that the fulfilledFunction2 was called");
            test.completeFinalize();
        }
    };

    /**
     * This tests
     * 1) Promises A+ 2.2.6.2 is fulfilled: If/when promise is rejected, all respective onRejected callbacks must execute in the order of their originating calls to then.
     */
    var promiseMultipleCallsToThenRejectedExecutionOrderTest = {

        async: true,


        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this                       = this;
            this.testValueA                 = "ValueA";
            this.testPromise                = new Promise();
            this.testRejectedFunction1      = function(value1) {
                test.assertEqual(value1, _this.testValueA,
                    "Assert that value1 is testValueA");
                test.assertTrue(_this.testRejectedFunction2Spy.wasNotCalled(),
                    "Assert test fulfilled function 2 has not been called yet");
            };
            this.testRejectedFunction1Spy   = spyOnFunction(this.testRejectedFunction1);
            this.testRejectedFunction2      = function(value2) {
                test.assertEqual(value2, _this.testValueA,
                    "Assert that value2 is testValueA");
                test.assertTrue(_this.testRejectedFunction1Spy.wasCalled(),
                    "Assert testRejectedFunction1 has been called yet");
                test.completeTest();
            };
            this.testRejectedFunction2Spy   = spyOnFunction(this.testRejectedFunction2);
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            this.testPromise.then(null, this.testRejectedFunction1Spy);
            this.testPromise.then(null, this.testRejectedFunction2Spy);
            this.testPromise.rejectPromise([this.testValueA]);
            test.assertTrue(this.testPromise.isRejected(),
                "Assert that the promise has been rejected");
        },

        final: function(test) {
            test.assertTrue(this.testRejectedFunction1Spy.wasCalled(),
                "Assert that the rejectedFunction1 was called");
            test.assertTrue(this.testRejectedFunction2Spy.wasCalled(),
                "Assert that the rejectedFunction2 was called");
            test.completeFinalize();
        }
    };

    /**
     * This tests
     * 1) returning a value X from onFulfilled should resolve forwardPromise with X
     * 2) returning a value X from onRejected should resolve forwardPromise with X
     * 2) Promises A+ - 2.2.7.1: If either onFulfilled or onRejected returns a value x, run the Promise Resolution Procedure [[Resolve]](promise2, x).
     */
    var promiseReturnValueOnFulfilledAndOnRejectedTest = {

        async: true,

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this                       = this;
            this.testValueA                 = "testValueA";
            this.testFulfilledPromise       = new Promise();
            this.testRejectedPromise        = new Promise();
            this.testReturnValueFulfilledFunction      = function() {
                return _this.testValueA;
            };
            this.testReturnValueRejectedFunction       = function() {
                return _this.testValueA;
            };
            this.forwardFulfilledPromise = this.testFulfilledPromise.then(this.testReturnValueFulfilledFunction);
            this.forwardRejectedPromise = this.testRejectedPromise.then(null, this.testReturnValueRejectedFunction);
            this.forwardFulfilledPromiseOnFulfilled = function (value) {
                test.assertEqual(value, _this.testValueA,
                    "Assert resolved value is testValueA");
            };
            this.forwardRejectedPromiseOnFulfilled = function (value) {
                test.assertEqual(value, _this.testValueA,
                    "Assert resolved value is testValueA");
                test.completeTest();
            };
            this.forwardFulfilledPromiseOnFulfilledSpy = spyOnFunction(this.forwardFulfilledPromiseOnFulfilled);
            this.forwardRejectedPromiseOnFulfilledSpy = spyOnFunction(this.forwardRejectedPromiseOnFulfilled);
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            this.forwardFulfilledPromise.then(this.forwardFulfilledPromiseOnFulfilledSpy);
            this.testFulfilledPromise.resolvePromise([]);
            test.assertTrue(this.testFulfilledPromise.isFulfilled(),
                "Assert that the fulfilled promise has been fulfilled");

            this.forwardRejectedPromise.then(this.forwardRejectedPromiseOnFulfilledSpy);
            this.testRejectedPromise.rejectPromise([]);
            test.assertTrue(this.testRejectedPromise.isRejected(),
                "Assert that the rejected promise has been rejected");
        },


        final: function(test) {
            test.assertTrue(this.forwardFulfilledPromiseOnFulfilledSpy.wasCalled(),
                "Assert that the forwardFulfilledPromiseOnFulfilled function was called");
            test.assertTrue(this.forwardRejectedPromiseOnFulfilledSpy.wasCalled(),
                "Assert that the forwardRejectedPromiseOnFulfilled was called");
            test.completeFinalize();
        }
    };

    /**
     * This tests
     * 1) throwing an exception E from onFulfilled should reject forwardPromise with E
     * 2) throwing an exception E from onRejected should reject forwardPromise with E
     * 2) Promises A+ - 2.2.7.2: If either onFulfilled or onRejected throws an exception e, promise2 must be rejected with e as the reason.
     */
    var promiseThrowExceptionFromOnFulfilledAndOnRejectedTest = {

        async: true,

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this                       = this;
            this.testException              = Throwables.exception("TestException");
            this.testFulfilledPromise       = new Promise();
            this.testRejectedPromise        = new Promise();
            this.testReturnValueFulfilledFunction      = function() {
                throw _this.testException;
            };
            this.testReturnValueRejectedFunction       = function() {
                throw _this.testException;
            };
            this.forwardFulfilledPromise = this.testFulfilledPromise.then(this.testReturnValueFulfilledFunction);
            this.forwardRejectedPromise = this.testRejectedPromise.then(null, this.testReturnValueRejectedFunction);
            this.forwardFulfilledPromiseOnRejected = function (reason) {
                test.assertEqual(reason, _this.testException,
                    "Assert rejected reason is testException");
            };
            this.forwardRejectedPromiseOnRejected = function (reason) {
                test.assertEqual(reason, _this.testException,
                    "Assert rejected reason is testException");
                test.completeTest();
            };
            this.forwardFulfilledPromiseOnRejectedSpy = spyOnFunction(this.forwardFulfilledPromiseOnRejected);
            this.forwardRejectedPromiseOnRejectedSpy = spyOnFunction(this.forwardRejectedPromiseOnRejected);
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.forwardFulfilledPromise.then(null, this.forwardFulfilledPromiseOnRejectedSpy);
            this.testFulfilledPromise.resolvePromise([]);
            test.assertTrue(this.testFulfilledPromise.isFulfilled(),
                "Assert that the fulfilled promise has been fulfilled");

            this.forwardRejectedPromise.then(null, this.forwardRejectedPromiseOnRejectedSpy);
            this.testRejectedPromise.rejectPromise([]);
            test.assertTrue(this.testRejectedPromise.isRejected(),
                "Assert that the rejected promise has been rejected");
        },


        final: function(test) {
            test.assertTrue(this.forwardFulfilledPromiseOnRejectedSpy.wasCalled(),
                "Assert that the forwardFulfilledPromiseOnRejected function was called");
            test.assertTrue(this.forwardRejectedPromiseOnRejectedSpy.wasCalled(),
                "Assert that the forwardRejectedPromiseOnRejected was called");
            test.completeFinalize();
        }
    };

    /**
     * This tests
     * 1) calling #then without a fulfilled function after promise has been fulfilled
     * 2) Promises A+ - 2.2.7.3: If onFulfilled is not a function and promise1 is fulfilled, promise2 must be fulfilled with the same value as promise1.
     */
    var promiseThenWithoutFulfilledFunctionAfterPromiseIsFulfilledTest = {

        async: true,


        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testPromise        = new Promise();
            this.testValueA         = "ValueA";
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            this.testPromise.resolvePromise([this.testValueA]);
            test.assertTrue(this.testPromise.isFulfilled(),
                "Assert that the promise has been fulfilled");
            test.assertEqual(this.testPromise.getValueList().getAt(0), this.testValueA,
                "Assert that the testPromise's valueList[0] is testValueA");
            var forwardPromise = this.testPromise.then();
            forwardPromise.then(function() {
                test.assertTrue(forwardPromise.isFulfilled(),
                    "Assert that the forwardPromise has been fulfilled");
                test.assertEqual(forwardPromise.getValueList().getAt(0), _this.testValueA,
                    "Assert that the forwardPromise's valueList[0] is testValueA");
                test.completeTest();
            })
        }
    };


    /**
     * This tests
     * 1) calling #then without a rejection function after promise has been rejected
     * 2) Promises A+ - 2.2.7.4: If onRejected is not a function and promise1 is rejected, promise2 must be rejected with the same reason as promise1.
     */
    var promiseThenWithoutRejectedFunctionAfterPromiseIsRejectedTest = {

        async: true,


        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testPromise        = new Promise();
            this.testReasonA         = "ReasonA";
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            this.testPromise.rejectPromise([this.testReasonA]);
            test.assertTrue(this.testPromise.isRejected(),
                "Assert that the promise has been rejected");
            test.assertEqual(this.testPromise.getReasonList().getAt(0), this.testReasonA,
                "Assert that the testPromise's reasonList[0] is testReasonA");
            var forwardPromise = this.testPromise.then();
            forwardPromise.then(null, function() {
                test.assertTrue(forwardPromise.isRejected(),
                    "Assert that the forwardPromise has been rejected");
                test.assertEqual(forwardPromise.getReasonList().getAt(0), _this.testReasonA,
                    "Assert that the forwardPromise's reasonList[0] is testReasonA");
                test.completeTest();
            });
        }
    };

    /**
     * This tests
     * 1) calling #resolvePromise and passing the promises self as an arg rejects the promise with a TypeError Bug
     * 2) Promises A+ - 2.3.1: If promise and x refer to the same object, reject promise with a TypeError as the reason.
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
    bugmeta.tag(promiseResolvePromiseWithTwoCopiesOfSelfShouldRejectOnceTest).with(
        test().name("Promise - #resolvePromise and passing two references of the promises self as args should reject promise once")
    );
    bugmeta.tag(promiseResolvePromiseWithEmptyValuesTest).with(
        test().name("Promise - #resolvePromise with empty values")
    );
    bugmeta.tag(promiseResolvePromiseWithSingleValueTest).with(
        test().name("Promise - #resolvePromise with a single value")
    );
    bugmeta.tag(promiseResolvePromiseWithSinglePromiseTest).with(
        test().name("Promise - #resolvePromise with a single Promise")
    );
    bugmeta.tag(promiseRejectHandlerOnlyForwardPromiseTest).with(
        test().name("Promise - reject handler only forward promise test")
    );
    bugmeta.tag(promiseThenWithFulfilledFunctionAfterPromiseIsFulfilledTest).with(
        test().name("Promise - #then with fulfilledFunction after promise is fulfilled test")
    );
    bugmeta.tag(promiseOnFulfilledAndOnRejectedCalledAsFunctionsTest).with(
        test().name("Promise - onFulfilled and onRejected must execute as functions")
    );
    bugmeta.tag(promiseMultipleCallsToThen).with(
        test().name("Promise - Multiple calls to then()")
    );
    bugmeta.tag(promiseMultipleCallsToThenFulfilledExecutionOrderTest).with(
        test().name("Promise - Multiple calls to then() fulfilled execution order test")
    );
    bugmeta.tag(promiseMultipleCallsToThenRejectedExecutionOrderTest).with(
        test().name("Promise - Multiple calls to then() rejected execution order test")
    );
    bugmeta.tag(promiseReturnValueOnFulfilledAndOnRejectedTest).with(
        test().name("Promise - Return value from onFulfilled and onRejected test")
    );
    bugmeta.tag(promiseThrowExceptionFromOnFulfilledAndOnRejectedTest).with(
        test().name("Promise - Throw exception from onFulfilled and onRejected test")
    );
    bugmeta.tag(promiseThenWithoutFulfilledFunctionAfterPromiseIsFulfilledTest).with(
        test().name("Promise - #then with fulfilledFunction after promise is fulfilled test")
    );
    bugmeta.tag(promiseThenWithoutRejectedFunctionAfterPromiseIsRejectedTest).with(
        test().name("Promise - #then with rejectedFunction after promise is rejected test")
    );
    bugmeta.tag(promiseResolvePromiseWithSelfShouldRejectPromiseTest).with(
        test().name("Promise - #resolvePromise with self as arg should reject the promise with a TypeError Bug test")
    );
});
