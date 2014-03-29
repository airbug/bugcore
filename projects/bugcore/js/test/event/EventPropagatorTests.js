//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Event')
//@Require('EventPropagator')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Event           = bugpack.require('Event');
var EventPropagator = bugpack.require('EventPropagator');
var BugMeta         = bugpack.require('bugmeta.BugMeta');
var TestAnnotation  = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta         = BugMeta.context();
var test            = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/**
 * This tests
 * 1) Instantiating an EventPropagator
 * 2) That the propagator target is set to itself if no target is passed in during instantiation
 * 3) That the propagator target is set to the value passed in during instantiation
 */
var eventPropagatorInstantiationTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.eventPropagatorWithoutTarget = new EventPropagator();
        this.testTarget = {};
        this.eventPropagatorWithTarget = new EventPropagator(this.testTarget);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.eventPropagatorWithoutTarget.getTarget(), this.eventPropagatorWithoutTarget,
            "Assert target is set to itself if no target is passed in during instantiation");
        test.assertEqual(this.eventPropagatorWithTarget.getTarget(), this.testTarget,
            "Assert target is set to the target passed in during instantiation");
    }
};
bugmeta.annotate(eventPropagatorInstantiationTest).with(
    test().name("EventPropagator instantiation test")
);

/**
 * This tests
 * 1) Adding an eventPropagator
 * 2) Propagating a simple event
 */
var eventPropagatrSimpleAddEventPropagatorPropagateEventTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.eventPropagator = new EventPropagator();
        this.testEventType = "testEventType";
        this.testEventData = "testEventData";
        this.testEvent = new Event(this.testEventType, this.testEventData);
        this.addedPropagateEventCalled = false;
        this.addedEventPropagator = new EventPropagator();
        //TODO BRN: Use a spy library here instead
        this.addedEventPropagator.propagateEvent = function(event) {
            _this.addedPropagateEventCalled = true;
            test.assertEqual(event.getData(), _this.testEventData,
                "Assert that event data was the same");
            test.assertEqual(event.getType(), _this.testEventType,
                "Assert that event type was the same");
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.eventPropagator.addEventPropagator(this.addedEventPropagator);
        this.eventPropagator.propagateEvent(this.testEvent);
        test.assertTrue(this.addedPropagateEventCalled,
            "Assert that propagateEvent was called on the added eventPropagator");
    }
};
bugmeta.annotate(eventPropagatrSimpleAddEventPropagatorPropagateEventTest).with(
    test().name("EventPropagator simple add eventPropagator and propagateEvent test")
);

//TODO BRN: Add a test for stopPropagation
//TODO BRN: Add a test that ensures an eventPropagator cannot be added more than once
//TODO BRN: Add a test for removeEventPropagator
