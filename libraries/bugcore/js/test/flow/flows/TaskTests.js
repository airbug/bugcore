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
//@Require('Task')
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
    var Task        = bugpack.require('Task');
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
     * 1) That the taskMethod is executed within the taskContext
     * 2) That the task args are properly passed to the taskMethod
     * 3) That the Task execute callback is properly fired
     */
    var taskExecuteTest = {

        async: true,

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            this.arg1 = "arg1";
            this.arg2 = "arg2";
            this.taskContext = {
                contextCheck: "contextCheck",
                taskMethod: function(flow, arg1, arg2) {
                    test.assertEqual(this.contextCheck, _this.taskContext.contextCheck,
                        "Assert taskMethod was executed within the taskContext");
                    test.assertEqual(arg1, _this.arg1,
                        "Assert arg1 was 'arg1'");
                    test.assertEqual(arg2, _this.arg2,
                        "Assert arg2 was 'arg2'");
                    flow.complete();
                }
            };
            this.task = new Task(this.taskContext.taskMethod, this.taskContext);
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.task.execute([this.arg1, this.arg2], function() {
                test.assertTrue(true, "Task execute callback was executed");
                test.completeTest();
            });
        }
    };

    /**
     * This tests..
     * 1) That the taskMethod is executed
     * 2) That a Task can be executed without error when a callback is not supplied
     */
    var taskExecuteWithoutCallbackTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            this.taskMethodExecuted = false;
            this.taskMethod = function(flow) {
                _this.taskMethodExecuted = true;
                flow.complete();
            };
            this.task = new Task(this.taskMethod);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.task.execute();
            test.assertTrue(this.taskMethodExecuted,
                "Assert task method was executed");
        }
    };

    /**
     * This tests..
     * 1) Task.complete with no arguments
     * 2) That Task is in the completed state after Task.complete is called
     * 3) That Task is not in the resolving state after Task.complete is called with no arguments
     * 4) That Task is not in the errored state after Task.complete is called
     */
    var taskCompleteTest = {

        async: true,

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.taskMethod = function(flow) {
                flow.complete();
            };
            this.task = new Task(this.taskMethod);
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            this.task.execute(function() {
                test.assertTrue(_this.task.hasCompleted(), "Assert Task is in the completed state");
                test.assertFalse(_this.task.isResolving(), "Assert Task is not in the resolving state");
                test.assertFalse(_this.task.hasErrored(), "Assert Task is not in the errored state");
                test.completeTest();
            });
        }
    };

    /**
     * This tests..
     * 1) Task.complete with exception
     * 2) That Task is in the errored state after Task.complete is called with an exception argument
     * 3) That Task is not in the resolving state after Task.complete is called with an exception argument
     * 4) That Task is not in the completed state after Task.complete is called with an exception argument
     */
    var taskCompleteWithExceptionTest = {

        async: true,

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            this.testException = Throwables.exception("TestException");
            this.taskMethod = function(flow) {
                flow.complete(_this.testException);
            };
            this.task = new Task(this.taskMethod);
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            this.task.execute(function(throwable) {
                test.assertEqual(throwable, _this.testException,
                    "Assert throwable passed to execute callback is testException");
                test.assertFalse(_this.task.hasCompleted(), "Assert Task is NOT in the completed state");
                test.assertFalse(_this.task.isResolving(), "Assert Task is not in the resolving state");
                test.assertTrue(_this.task.hasErrored(), "Assert Task is in the errored state");
                test.completeTest();
            });
        }
    };

    /**
     * This tests..
     * 1) Task.error with no arguments
     * 2) That Task is in the errored state after Task.error is called
     * 3) That Task is not in the resolving state after Task.error is called with no arguments
     * 4) That Task is not in the completed state after Task.error is called with no arguments
     */
    var taskErrorTest = {

        async: true,

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.taskMethod = function(flow) {
                flow.error();
            };
            this.task = new Task(this.taskMethod);
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            this.task.execute(function() {
                test.assertFalse(_this.task.hasCompleted(), "Assert Task is NOT in the completed state");
                test.assertFalse(_this.task.isResolving(), "Assert Task is NOT in the resolving state");
                test.assertTrue(_this.task.hasErrored(), "Assert Task IS in the errored state");
                test.completeTest();
            });
        }
    };

    /**
     * This tests..
     * 1) That the taskMethod can return a value to complete the task
     */
    var taskReturnValueTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            this.taskMethodExecuted = false;
            this.testReturnValue  = "testReturnValue";
            this.taskMethod = function() {
                _this.taskMethodExecuted = true;
                return _this.testReturnValue;
            };
            this.task = new Task(this.taskMethod);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            this.task.execute(function(throwable, value) {
                test.assertEqual(throwable, null,
                    "Assert throwable is null");
                test.assertEqual(value, _this.testReturnValue,
                    "Assert return value was passed to callback")
            });
            test.assertTrue(this.taskMethodExecuted,
                "Assert task method was executed");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(taskExecuteTest).with(
        test().name("Task - #execute test")
    );
    bugmeta.tag(taskExecuteWithoutCallbackTest).with(
        test().name("Task - #execute without callback test")
    );
    bugmeta.tag(taskCompleteTest).with(
        test().name("Task - #complete test")
    );
    bugmeta.tag(taskCompleteWithExceptionTest).with(
        test().name("Task - #complete with Exception test")
    );
    bugmeta.tag(taskErrorTest).with(
        test().name("Task - #error test")
    );
    bugmeta.tag(taskReturnValueTest).with(
        test().name("Task - return value test")
    );
});
