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
//@Require('Task')
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


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(taskExecuteTest).with(
        test().name("Task - #execute test")
    );
    bugmeta.tag(taskExecuteWithoutCallbackTest).with(
        test().name("Task - #execute without callback test")
    );
});
