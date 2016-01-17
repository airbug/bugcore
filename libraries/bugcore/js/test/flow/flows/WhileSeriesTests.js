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
//@Require('Flows')
//@Require('Throwables')
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
    var Throwables  = bugpack.require('Throwables');
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
     * 1) That the while series completes
     */
    var bugflowExecuteWhileSeriesTest = {

        async: true,


        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            this.numberAssertionsStarted = 0;
            this.numberTasksCompleted = 0;
            this.numberTasksStarted = 0;
            this.testAssertionMethod = function(flow) {
                _this.numberAssertionsStarted++;
                return (_this.numberAssertionsStarted <= 2);
            };
            this.testTask = Flows.$task(function(flow) {
                _this.numberTasksStarted++;
                test.assertEqual(_this.numberTasksStarted, _this.numberAssertionsStarted,
                    "Assert tasks are executed in series with assertions");
                test.assertEqual(_this.numberTasksCompleted, _this.numberTasksStarted - 1,
                    "Assert tasks are executed in series");
                setTimeout(function() {
                    _this.numberTasksCompleted++;
                    flow.complete();
                }, 0);
            });
            this.whileSeries = Flows.$whileSeries(this.testAssertionMethod, this.testTask);
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            var executeCallbackFired = false;
            this.whileSeries.execute(function(throwable) {
                test.assertFalse(executeCallbackFired,
                    "Assert that the execute callback has not already fired");
                executeCallbackFired = true;
                if (!throwable) {
                    test.assertEqual(_this.numberTasksStarted, 2,
                        "Assert testTask was started twice");
                    test.assertEqual(_this.numberTasksCompleted, 2,
                        "Assert testTask was completed twice");
                    test.assertEqual(_this.numberAssertionsStarted, 3,
                        "Assert that the ForEachParallel iterated twice and ended on the third");
                } else {
                    test.error(throwable);
                }
                test.completeTest();
            });
        }
    };


    /**
     * This tests..
     * 1) That the while series does not execute another assertion until the previous assertion completes
     */
    var bugflowExecuteWhileSeriesWithAsyncAssertionTest = {

        async: true,


        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            this.numberAssertionsCompleted = 0;
            this.numberAssertionsStarted = 0;
            this.numberTasksCompleted = 0;
            this.numberTasksStarted = 0;
            this.testAsyncAssertionMethod = function(flow) {
                test.assertEqual(_this.numberAssertionsStarted, _this.numberTasksCompleted,
                    "Assert that assertions are running in series with tasks");
                _this.numberAssertionsStarted++;
                if (_this.numberAssertionsStarted > 3) {
                    throw new Throwables.exception("TestException", {}, "Test assertions are running infinitely");
                }
                setTimeout(function() {
                    _this.numberAssertionsCompleted++;
                    test.assertEqual(_this.numberAssertionsCompleted, _this.numberAssertionsStarted,
                        "Assert that previous assertion completed before the next one started");
                    flow.assert(_this.numberAssertionsStarted < 3);
                }, 0);
            };
            this.testWhileTask = Flows.$task(function(flow) {
                _this.numberTasksStarted++;
                setTimeout(function() {
                    _this.numberTasksCompleted++;
                    flow.complete();
                }, 0);
            });
            this.whileSeries = Flows.$whileSeries(this.testAsyncAssertionMethod, this.testWhileTask);
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            var executeCallbackFired = false;
            this.whileSeries.execute(function(throwable) {
                test.assertFalse(executeCallbackFired,
                    "Assert that the execute callback has not already fired");
                executeCallbackFired = true;
                if (!throwable) {
                    test.assertEqual(_this.numberAssertionsStarted, 3,
                        "Assert three assertions started");
                    test.assertEqual(_this.numberAssertionsCompleted, 3,
                        "Assert three assertions completed");
                    test.assertEqual(_this.numberTasksStarted, 2,
                        "Assert that the ForEachParallel started 2 tasks");
                    test.assertEqual(_this.numberTasksCompleted, 2,
                        "Assert that the ForEachParallel completed 2 tasks");
                } else {
                    test.error(throwable);
                }
                test.completeTest();
            });
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(bugflowExecuteWhileSeriesTest).with(
        test().name("Flows WhileSeries - execute test")
    );
    bugmeta.tag(bugflowExecuteWhileSeriesWithAsyncAssertionTest).with(
        test().name("Flows WhileSeries - execute with async assertion test")
    );
});
