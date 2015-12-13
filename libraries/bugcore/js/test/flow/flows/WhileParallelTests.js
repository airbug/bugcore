/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Flows')
//@Require('Throwables')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

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
     * 1) That the while parallel completes
     */
    var bugflowExecuteWhileParallelTest = {

        async: true,


        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            this.testIndex = -1;
            this.numberTasksCompleted = 0;
            this.numberTasksStarted = 0;
            this.testAssertionMethod = function() {
                _this.testIndex++;
                return (_this.testIndex < 2);
            };
            this.testTask = Flows.$task(function(flow) {
                _this.numberTasksStarted++;
                if (_this.numberTasksStarted == 2) {
                    test.assertEqual(_this.numberTasksCompleted, 0,
                        'Assert tasks are executed in parallel');
                }
                setTimeout(function() {
                    _this.numberTasksCompleted++;
                    flow.complete();
                }, 0);
            });
            this.whileParallel = Flows.$whileParallel(this.testAssertionMethod, this.testTask);
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            var executeCallbackFired = false;
            this.whileParallel.execute(function(throwable) {
                test.assertFalse(executeCallbackFired,
                    'Assert that the execute callback has not already fired');
                executeCallbackFired = true;
                if (!throwable) {
                    test.assertEqual(_this.numberTasksCompleted, 2,
                        'Assert testTask was run twice');
                    test.assertEqual(_this.testIndex, 2,
                        'Assert that the ForEachParallel iterated 2 times');
                } else {
                    test.error(throwable);
                }
                test.completeTest();
            });
        }
    };


    /**
     * This tests..
     * 1) That the while parallel does not execute another assertion until the previous assertion completes
     */
    var bugflowExecuteWhileParallelWithAsyncAssertionTest = {

        async: true,


        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            this.numberAssertionsCompleted = 0;
            this.numberAssertionsStarted = 0;
            this.testAsyncAssertionMethod = function(flow) {
                _this.numberAssertionsStarted++;
                if (_this.numberAssertionsStarted > 3) {
                    throw new Throwables.exception('TestException', {}, 'Test assertions are running infinitely');
                }
                setTimeout(function() {
                    _this.numberAssertionsCompleted++;
                    test.assertEqual(_this.numberAssertionsCompleted, _this.numberAssertionsStarted,
                        'Assert that previous assertion completed before the next one started');
                    flow.assert(_this.numberAssertionsStarted < 3);
                }, 0);
            };
            this.numberTasksCompleted = 0;
            this.numberTasksStarted = 0;
            this.testWhileTask = Flows.$task(function(flow) {
                _this.numberTasksStarted++;
                setTimeout(function() {
                    _this.numberTasksCompleted++;
                    flow.complete();
                }, 0);
            });
            this.whileParallel = Flows.$whileParallel(this.testAsyncAssertionMethod, this.testWhileTask);
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            var executeCallbackFired = false;
            this.whileParallel.execute(function(throwable) {
                test.assertFalse(executeCallbackFired,
                    'Assert that the execute callback has not already fired');
                executeCallbackFired = true;
                if (!throwable) {
                    test.assertEqual(_this.numberAssertionsStarted, 3,
                        'Assert three assertions started');
                    test.assertEqual(_this.numberAssertionsCompleted, 3,
                        'Assert three assertions completed');
                    test.assertEqual(_this.numberTasksStarted, 2,
                        'Assert that the ForEachParallel started 2 tasks');
                    test.assertEqual(_this.numberTasksCompleted, 2,
                        'Assert that the ForEachParallel completed 2 tasks');
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

    bugmeta.tag(bugflowExecuteWhileParallelTest).with(
        test().name('Flows WhileParallel - execute test')
    );
    bugmeta.tag(bugflowExecuteWhileParallelWithAsyncAssertionTest).with(
        test().name('Flows WhileParallel - execute with async assertion test')
    );
});
