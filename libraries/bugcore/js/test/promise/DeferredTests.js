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
//@Require('Deferred')
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
    var Deferred        = bugpack.require('Deferred');
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
    var test            = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests
     * 1) Instantiation of a basic Deferred
     */
    var deferredInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testDeferred = new Deferred();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testDeferred, Deferred),
                "Assert that testDeferred is an instance of Deferred");
            test.assertTrue(Class.doesExtend(this.testDeferred.getDeferredPromise(), Promise),
                "Assert that testDeferred has a promise");
        }
    };
    bugmeta.tag(deferredInstantiationTest).with(
        test().name("Deferred - instantiation test")
    );


    /**
     * This tests
     * 1) Adding then to a Deferred's promise that has not been resolved. Should not immediately execute the then.
     * 2) Resolving the Deferred. Should fire the #then method after a setTimeout
     */
    var deferredThenAndResolveTest = {

        async: true,

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this               = this;
            this.testDeferred       = new Deferred();
            this.testValue          = "testValue";
            this.testFunction       = function(value) {
                test.assertEqual(value, _this.testValue,
                    "Assert that the value received in the #then method is testValue");
            };
            this.testFunctionSpy    = spyOnFunction(this.testFunction);
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this       = this;
            var promise     = this.testDeferred.promise();
            promise.then(this.testFunctionSpy);
            setTimeout(function() {
                test.assertTrue(_this.testFunctionSpy.wasNotCalled(),
                    "Assert that the testFunction was not immediately called since the Deferred has not been resolved");
                _this.testDeferred.resolve(_this.testValue);
                test.assertTrue(_this.testFunctionSpy.wasNotCalled(),
                    "Assert that the testFunction was not immediately called since the Deferred Promises should fire their 'then' methods using a setTimeout");
                setTimeout(function() {
                    test.assertTrue(_this.testFunctionSpy.wasCalled(),
                        "Assert that the testFunction was called after setTimeout expires");
                    test.completeTest();
                }, 0);
            }, 0);
        }
    };
    bugmeta.tag(deferredThenAndResolveTest).with(
        test().name("Deferred - #then and #resolve test")
    );


    /**
     * This tests
     * 1) Resolving a Deferred that has no then methods.
     * 2) Calling #then on a Deferred that has already been resolved. Make sure that the
     */
    var deferredResolveAndThenTest = {

        async: true,

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this               = this;
            this.testDeferred       = new Deferred();
            this.testValue          = "testValue";
            this.testFunction       = function(value) {
                test.assertEqual(value, _this.testValue,
                    "Assert that the value received in the #then method is testValue");
            };
            this.testFunctionSpy    = spyOnFunction(this.testFunction);
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this       = this;
            var promise     = this.testDeferred.promise();
            _this.testDeferred.resolve(_this.testValue);
            promise.then(this.testFunctionSpy);
            test.assertTrue(_this.testFunctionSpy.wasNotCalled(),
                "Assert that the testFunction was not immediately called since the Deferred Promises should fire their 'then' methods using a setTimeout");
            setTimeout(function() {
                test.assertTrue(_this.testFunctionSpy.wasCalled(),
                    "Assert that the testFunction was called after setTimeout expires");
                test.completeTest();
            }, 0);
        }
    };
    bugmeta.tag(deferredResolveAndThenTest).with(
        test().name("Deferred - #resolve and #then test")
    );

    /**
     * This tests
     * 1) Resolving a Deferred that has no then methods.
     * 2) Calling #then on a Deferred that has already been resolved. Make sure that the
     * 3) That Promises A+ 2.2.4 is fulfilled: onFulfilled or onRejected must not be called until the execution context stack contains only platform code.

     */
    var deferredResolveWithAPromiseTest = {

        async: true,

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this               = this;
            this.testDeferred       = new Deferred();
            this.testValue          = "testValue";
            this.testPromise        = new Promise();
            this.testFunction       = function(value) {
                test.assertEqual(value, _this.testValue,
                    "Assert that the value received in the #then method is testValue");
            };
            this.testFunctionSpy    = spyOnFunction(this.testFunction);
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this       = this;
            var promise     = this.testDeferred.promise();
            promise.then(this.testFunctionSpy);
            _this.testDeferred.resolve(_this.testPromise);
            setTimeout(function() {
                test.assertTrue(_this.testFunctionSpy.wasNotCalled(),
                    "Assert that the testFunction was not called after setTimeout since the passed in promise has not been resolved");
                _this.testPromise.resolve([_this.testValue]);

                //TODO BRN: This is a bit of a broken test

                promise.then(function() {
                    test.assertTrue(_this.testFunctionSpy.wasCalled(),
                        "Assert that the testFunction was called");
                    test.completeTest();
                });
            }, 0);
        }
    };
    bugmeta.tag(deferredResolveWithAPromiseTest).with(
        test().name("Deferred - #resolve with a promise test")
    );
});
