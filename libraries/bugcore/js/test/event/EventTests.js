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
//@Require('Event')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Event       = bugpack.require('Event');
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
     * This tests
     * 1) Instantiation of a new Event
     * 2) That the 'target' value is null after instantiation since the target is set when the event is dispatched
     */
    var eventInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testType = 'testEventType';
            this.testData = 'testEventData';
            this.event = new Event(this.testType, this.testData);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.event, Event),
                'Assert instance of Event');
            test.assertEqual(this.event.getClass().getConstructor(), Event,
                'Assert #getClass#getConstructor returns Event');
            test.assertEqual(this.event.getBubbles(), true,
                'Assert event bubbles by default after instantiation');
            test.assertEqual(this.event.getData(), this.testData,
                'Assert event data was set correctly during instantiation');
            test.assertEqual(this.event.isPropagationStopped(), false,
                'Assert propagation is not stopped by default');
            test.assertEqual(this.event.getTarget(), null,
                'Assert target is null after instantiation');
            test.assertEqual(this.event.getType(), this.testType,
                'Assert event type was set correctly during instantiation');
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(eventInstantiationTest).with(
        test().name('Event instantiation test')
    );
});
