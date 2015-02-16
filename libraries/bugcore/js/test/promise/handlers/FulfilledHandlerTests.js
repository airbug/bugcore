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
//@Require('FulfilledHandler')
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

    var Class               = bugpack.require('Class');
    var FulfilledHandler    = bugpack.require('FulfilledHandler');
    var Promise             = bugpack.require('Promise');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var TestTag             = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var test                = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests
     * 1) Instantiation of a basic FulfilledHandler
     */
    var fulfilledHandlerInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testMethod             = function() {};
            this.testForwardPromise     = new Promise();
            this.testFulfilledHandler   = new FulfilledHandler(this.testMethod, this.testForwardPromise);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testFulfilledHandler, FulfilledHandler),
                "Assert that testFulfilledHandler is an instance of FulfilledHandler");
            test.assertEqual(this.testFulfilledHandler.getMethod(), this.testMethod,
                "Assert that #getMethod returns the method passed in during instantiation");
            test.assertEqual(this.testFulfilledHandler.getForwardPromise(), this.testForwardPromise,
                "Assert that #getForwardPromise returns the Promise passed in during instantiation");
        }
    };
    bugmeta.tag(fulfilledHandlerInstantiationTest).with(
        test().name("FulfilledHandler - instantiation test")
    );


    /**
     * This tests
     * 1) calling #handle when no method has been supplied
     */
    var fulfilledHandlerHandleNoMethodTest = {

        async: true,

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testMethod             = null;
            this.testArgs               = ["testValue1", "testValue2"];
            this.testForwardPromise     = new Promise();
            this.testFulfilledHandler   = new FulfilledHandler(this.testMethod, this.testForwardPromise);
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            this.testFulfilledHandler.handle(this.testArgs);
            setTimeout(function() {
                var valueList = _this.testForwardPromise.getValueList();
                test.assertEqual(valueList.getCount(), _this.testArgs.length,
                    "Assert that the valueList has the same number of values as the testArgs");
                if (valueList.getCount() === _this.testArgs.length) {
                    _this.testArgs.forEach(function(value, index) {
                        test.assertEqual(value, valueList.getAt(index),
                            "Assert that the value from testArgs matches the value in valueList at the same index");
                    });
                }
                test.completeTest();
            }, 0);
        }
    };
    bugmeta.tag(fulfilledHandlerHandleNoMethodTest).with(
        test().name("FulfilledHandler - #handle no method test")
    );
});
