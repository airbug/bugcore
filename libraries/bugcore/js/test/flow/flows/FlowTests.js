/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Flow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Flow        = bugpack.require('Flow');
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
     * 1) That the Flow is marked as executed after execute is called
     */
    var flowExecuteFlowTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.flow = new Flow();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.flow.execute();
            test.assertEqual(this.flow.hasExecuted(), true,
                'Assert flow has executed');
        }
    };


    /**
     * This tests..
     * 1) That the Flow correctly completes
     * 2) That the Flow correctly executes the callback
     */
    var flowCompleteFlowTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.flow = new Flow();
            this.callbackCalled = false;
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertEqual(this.flow.hasExecuted(), false,
                'Assert flow has not executed');
            test.assertEqual(this.flow.hasCompleted(), false,
                'Assert flow has not completed');
            this.flow.execute(function(throwable) {
                _this.callbackCalled = true;
                test.assertEqual(throwable, null,
                    'Assert throwable is null');
            });
            test.assertEqual(this.flow.hasExecuted(), true,
                'Assert flow has executed');
            test.assertEqual(this.flow.hasCompleted(), false,
                'Assert flow has not completed');
            this.flow.complete();
            test.assertEqual(this.flow.hasExecuted(), true,
                'Assert flow has executed');
            test.assertEqual(this.flow.hasCompleted(), true,
                'Assert flow has completed');
            test.assertTrue(this.callbackCalled,
                'Assert callback was called');
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(flowExecuteFlowTest).with(
        test().name('Flow - execute without extension test')
    );
    bugmeta.tag(flowCompleteFlowTest).with(
        test().name('Flow - #complete test')
    );
});
