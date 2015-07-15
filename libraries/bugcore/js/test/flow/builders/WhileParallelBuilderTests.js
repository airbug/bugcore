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
//@Require('FlowBuilder')
//@Require('TaskBuilder')
//@Require('WhileParallelBuilder')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var FlowBuilder             = bugpack.require('FlowBuilder');
    var TaskBuilder             = bugpack.require('TaskBuilder');
    var WhileParallelBuilder    = bugpack.require('WhileParallelBuilder');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var TestTag                 = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var test                    = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests..
     * 1) WhileParallelBuilder instantiation
     */
    var whileParallelBuilderInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testAssertionMethod                = function(flow) {};
            this.testAssertPassFlowBuilderMethod    = function() {};
            this.testWhileParallelBuilder           = new WhileParallelBuilder(this.testAssertionMethod, this.testAssertPassFlowBuilderMethod);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testWhileParallelBuilder, WhileParallelBuilder),
                "Assert testWhileParallelBuilder extends WhileParallelBuilder");
            test.assertEqual(this.testWhileParallelBuilder.getAssertionMethod(), this.testAssertionMethod,
                "Assert WhileParallelBuilder.assertionMethod was set correctly");
            test.assertTrue(Class.doesExtend(this.testWhileParallelBuilder.getAssertPassFlowBuilder(), TaskBuilder),
                "Assert WhileParallelBuilder.assertPassFlowBuilder is an instance of TaskBuilder");
            test.assertEqual(this.testWhileParallelBuilder.getAssertPassFlowBuilder().getTaskMethod(), this.testAssertPassFlowBuilderMethod,
                "Assert WhileParallelBuilder.assertPassFlowBuilder.taskMethod was set correctly");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(whileParallelBuilderInstantiationTest).with(
        test().name("WhileParallelBuilder - instantiation test")
    );
});
