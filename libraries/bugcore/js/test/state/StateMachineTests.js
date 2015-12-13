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
//@Require('Set')
//@Require('StateEvent')
//@Require('StateMachine')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Set             = bugpack.require('Set');
    var StateEvent      = bugpack.require('StateEvent');
    var StateMachine    = bugpack.require('StateMachine');
    var BugDouble       = bugpack.require('bugdouble.BugDouble');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestTag         = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var spyOnFunction   = BugDouble.spyOnFunction;
    var bugmeta         = BugMeta.context();
    var test            = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var stateMachineInstantiationWithArgsTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testStateMachineConfig = {
                states: [
                    'testStateA',
                    'testStateB'
                ],
                initialState: 'testStateA'
            };
            this.testStateMachine   = new StateMachine(this.testStateMachineConfig);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testStateMachine, StateMachine),
                'Assert instance of StateMachine');
            var availableStateSet = this.testStateMachine.getAvailableStateSet();
            test.assertTrue(Class.doesExtend(availableStateSet, Set),
                'Assert .availableStateSet is an instance of Set');
            test.assertTrue(availableStateSet.contains('testStateA'),
                'Assert .availableStateSet contains "testStateA"');
            test.assertTrue(availableStateSet.contains('testStateB'),
                'Assert .availableStateSet contains "testStateB"');
            test.assertEqual(this.testStateMachine.getCurrentState(), 'testStateA',
                'Assert .currentState was set correctly');
        }
    };

    var stateMachineChangeStateTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testStateMachineConfig = {
                states: [
                    'testStateA',
                    'testStateB'
                ],
                initialState: 'testStateA'
            };
            this.testStateMachine   = new StateMachine(this.testStateMachineConfig);
            this.testEventListener  = function(event) {
                test.assertTrue(Class.doesExtend(event, StateEvent),
                    'Assert event received is a StateEvent');
                test.assertEqual(event.getCurrentState(), 'testStateB',
                    'Assert StateEvent.currentState is "testStateB"');
                test.assertEqual(event.getPreviousState(), 'testStateA',
                    'Assert StateEvent.previousState is "testStateA"');
            };
            this.testEventListenerSpy        = spyOnFunction(this.testEventListener);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testStateMachine.getCurrentState(), 'testStateA',
                'Assert .currentState is "testStateA"');
            this.testStateMachine.addEventListener(StateEvent.EventTypes.STATE_CHANGED, this.testEventListenerSpy);
            this.testStateMachine.changeState('testStateB');
            test.assertTrue(this.testEventListenerSpy.wasCalled(),
                'Assert eventListener was fired');
            test.assertEqual(this.testStateMachine.getCurrentState(), 'testStateB',
                'Assert StateMachine.currentState has been set to "testStateB"');
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(stateMachineInstantiationWithArgsTest).with(
        test().name('StateMachine - instantiation with args test')
    );
    bugmeta.tag(stateMachineChangeStateTest).with(
        test().name('StateMachine - .changeState test')
    );
});
