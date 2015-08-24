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
//@Require('Flows')
//@Require('Promises')
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
    var Flows       = bugpack.require('Flows');
    var Promises    = bugpack.require('Promises');
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
     * 1) Adding a callback to end of series
     * 2) Returning a promise from task within series
     * 3) Ensuring that callback receives values resolved by last task in series
     */
    var flowsResolveSeriesWithPromiseToCallbackTest = {

        async: true,

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this           = this;
            this.testValue      = "TestValue";
            this.testDeferred   = Promises.deferred();
            this.testSeries     = Flows.$series([
                function() {
                    setTimeout(function() {
                        _this.testDeferred.resolve(_this.testValue);
                    }, 0);
                    return _this.testDeferred.promise();
                }
            ]);
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this           = this;
            this.testSeries.callback(function(throwable, value) {
                test.assertEqual(value, _this.testValue,
                    "Assert value received in callback is equal to testValue");
                test.completeTest();
            })
        }
    };

    /**
     * This tests..
     * 1) Returning a promise from Task
     * 2) Ensuring that callback receives values resolved by Promise returned from Task
     */
    var flowsResolveTaskWithPromiseTest = {

        async: true,

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this           = this;
            this.testValue      = "TestValue";
            this.testDeferred   = Promises.deferred();
            this.testTask       = Flows.$task(function() {
                setTimeout(function() {
                    _this.testDeferred.resolve(_this.testValue);
                }, 0);
                return _this.testDeferred.promise();
            });
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this           = this;
            this.testTask.execute(function(throwable, value) {
                test.assertEqual(value, _this.testValue,
                    "Assert value received in callback is equal to testValue");
                test.completeTest();
            })
        }
    };

    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(flowsResolveSeriesWithPromiseToCallbackTest).with(
        test().name("Flows - resolve Series with Promise to callback test")
    );
    bugmeta.tag(flowsResolveTaskWithPromiseTest).with(
        test().name("Flows - resolve Task with Promise test")
    );
});
