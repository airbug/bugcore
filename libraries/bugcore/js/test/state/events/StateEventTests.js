/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('StateEvent')
//@Require('TypeUtil')
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
    var StateEvent  = bugpack.require('StateEvent');
    var TypeUtil    = bugpack.require('TypeUtil');
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

    var stateEventInstantiationWithArgsTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testType           = "testType";
            this.testPreviousState  = "testPreviousState";
            this.testCurrentState   = "testCurrentState";
            this.testStateEVent     = new StateEvent(this.testType, this.testPreviousState, this.testCurrentState);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testStateEVent, StateEvent),
                "Assert instance of StateEvent");
            test.assertEqual(this.testStateEVent.getType(), this.testType,
                "Assert .type was set correctly");
            test.assertEqual(this.testStateEVent.getPreviousState(), this.testPreviousState,
                "Assert .previousState was set correctly");
            test.assertEqual(this.testStateEVent.getCurrentState(), this.testCurrentState,
                "Assert .currentState was set correctly");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(stateEventInstantiationWithArgsTest).with(
        test().name("StateEvent - instantiation with args test")
    );
});
