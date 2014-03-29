//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Event')
//@Require('EventDispatcher')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var EventDispatcher = bugpack.require('EventDispatcher');
var Event           = bugpack.require('Event');
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
 * 1) Instantiating an EventDispatcher
 * 2) That the dispatcher target is set to itself if no target is passed in during instantiation
 * 3) That the dispatcher target is set to the value passed in during instantiation
 */
var eventDispatcherInstantiationTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.eventDispatcherWithoutTarget = new EventDispatcher();
        this.testTarget = {};
        this.eventDispatcherWithTarget = new EventDispatcher(this.testTarget);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.eventDispatcherWithoutTarget.getParentPropagator(), undefined,
            "Assert parentPropagator defaults to undefined");
        test.assertEqual(this.eventDispatcherWithoutTarget.getTarget(), this.eventDispatcherWithoutTarget,
            "Assert dispatcher target is set to itself if no target is passed in during instantiation");
        test.assertEqual(this.eventDispatcherWithTarget.getTarget(), this.testTarget,
            "Assert dispatcher target is set to the target passed in during instantiation");
    }
};
bugmeta.annotate(eventDispatcherInstantiationTest).with(
    test().name("EventDispatcher instantiation test")
);


/**
 * This tests
 * 1) Adding and event listener
 * 2) Dispatching a simple event
 */
var eventDispatcherSimpleAddEventListenerDispatchEventTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.eventDispatcher = new EventDispatcher();
        this.testEventType = "testEventType";
        this.testEventData = "testEventData";
        this.testEvent = new Event(this.testEventType, this.testEventData);

        this.calledVar = false;
        this.testContextVar = "some value";
        this.testListenerContext = {
            testContextVar: this.testContextVar
        };
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        this.testListenerFunction = function(event) {
            _this.calledVar = true;
            test.assertEqual(this.testContextVar, _this.testContextVar,
                "Assert the listener function was called in the listener context");
            test.assertEqual(event.getType(), _this.testEventType,
                "Assert event type received was the event type published");
            test.assertEqual(event.getData(), _this.testEventData,
                "Assert event data received was the event data published");
            test.assertEqual(event.getTarget(), _this.eventDispatcher,
                "Assert event target is the dispatcher that dispatched the event");
        };
        this.eventDispatcher.addEventListener(this.testEventType, this.testListenerFunction, this.testListenerContext);
        this.eventDispatcher.dispatchEvent(this.testEvent);
        test.assertTrue(this.calledVar, "Assert listener function was called.");
    }
};
bugmeta.annotate(eventDispatcherSimpleAddEventListenerDispatchEventTest).with(
    test().name("EventDispatcher simple add event listener and dispatch event test")
);


/**
 * This tests
 * 1) Adding an anonymous event listener
 * 2) Dispatching a simple event with anonymous listeners
 */
var eventDispatcherAddAnonymousEventListenerDispatchEventTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.eventDispatcher = new EventDispatcher();
        this.testEventType = "testEventType";
        this.testEventData = "testEventData";
        this.testEvent = new Event(this.testEventType, this.testEventData);
        this.calledVar = false;
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        this.testListenerFunction = function(event) {
            _this.calledVar = true;
            test.assertEqual(event.getType(), _this.testEventType,
                "Assert event type received was the event type published");
            test.assertEqual(event.getData(), _this.testEventData,
                "Assert event data received was the event data published");
            test.assertEqual(event.getTarget(), _this.eventDispatcher,
                "Assert event target is the dispatcher that dispatched the event");
        };
        this.eventDispatcher.addEventListener(this.testEventType, this.testListenerFunction);
        this.eventDispatcher.dispatchEvent(this.testEvent);
        test.assertTrue(this.calledVar, "Assert listener function was called.");
    }
};
bugmeta.annotate(eventDispatcherAddAnonymousEventListenerDispatchEventTest).with(
    test().name("EventDispatcher add anonymous event listener and dispatch event test")
);


/**
 * This tests
 * 1) That an event does not bubble when bubbles is false on dispatchEvent
 */
var eventDispatcherDispatchEventBubblesFalseTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testChildEventDispatcher = new EventDispatcher();
        this.testParentEventDispatcher = new EventDispatcher();
        this.testEventType = "testEventType";
        this.testEventData = "testEventData";
        this.testEvent = new Event(this.testEventType, this.testEventData);
        this.testBubbles = false;
        this.childCalledVar = false;
        var _this = this;
        this.testChildListenerFunction = function(event) {
            _this.childCalledVar = true;
        };
        this.parentCalledVar = false;
        this.testParentListenerFunction = function(event) {
            _this.parentCalledVar = true;
        };
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testChildEventDispatcher.setParentPropagator(this.testParentEventDispatcher);
        this.testChildEventDispatcher.addEventListener(this.testEventType, this.testChildListenerFunction);
        this.testParentEventDispatcher.addEventListener(this.testEventType, this.testParentListenerFunction);
        this.testChildEventDispatcher.dispatchEvent(this.testEvent, this.testBubbles);
        test.assertTrue(this.childCalledVar,
            "Assert listener function on child dispatcher was called when bubbles is false.");
        test.assertFalse(this.parentCalledVar,
            "Assert listener function on parent dispatcher was not called when bubbles is false.");
    }
};
bugmeta.annotate(eventDispatcherDispatchEventBubblesFalseTest).with(
    test().name("EventDispatcher dispatch event with bubbles false test")
);


/**
 * This tests
 * 1) That an event does bubble when bubbles is true on dispatchEvent
 */
var eventDispatcherDispatchEventBubblesTrueTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testChildEventDispatcher = new EventDispatcher();
        this.testParentEventDispatcher = new EventDispatcher();
        this.testEventType = "testEventType";
        this.testEventData = "testEventData";
        this.testEvent = new Event(this.testEventType, this.testEventData);
        this.testBubbles = true;
        this.childCalledVar = false;
        this.testChildListenerFunction = function(event) {
            _this.childCalledVar = true;
        };
        this.parentCalledVar = false;
        this.testParentListenerFunction = function(event) {
            _this.parentCalledVar = true;
        };
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testChildEventDispatcher.setParentPropagator(this.testParentEventDispatcher);
        this.testChildEventDispatcher.addEventListener(this.testEventType, this.testChildListenerFunction);
        this.testParentEventDispatcher.addEventListener(this.testEventType, this.testParentListenerFunction);
        this.testChildEventDispatcher.dispatchEvent(this.testEvent, this.testBubbles);
        test.assertTrue(this.childCalledVar,
            "Assert listener function on child dispatcher was called when bubbles is true.");
        test.assertTrue(this.parentCalledVar,
            "Assert listener function on parent dispatcher was called when bubbles is true.");
    }
};
bugmeta.annotate(eventDispatcherDispatchEventBubblesTrueTest).with(
    test().name("EventDispatcher dispatch event with bubbles true test")
);


/**
 * This tests
 * 1) That an event does not bubble on dispatchEvent when stopPropagation is called
 */
var eventDispatcherDispatchEventStopPropagationTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testChildEventDispatcher = new EventDispatcher();
        this.testParentEventDispatcher = new EventDispatcher();
        this.testEventType = "testEventType";
        this.testEventData = "testEventData";
        this.testEvent = new Event(this.testEventType, this.testEventData);
        this.testBubbles = true;
        this.childCalledVar = false;
        this.testChildListenerFunction = function(event) {
            _this.childCalledVar = true;
            event.stopPropagation();
        };
        this.parentCalledVar = false;
        this.testParentListenerFunction = function(event) {
            _this.parentCalledVar = true;
        };
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testChildEventDispatcher.setParentPropagator(this.testParentEventDispatcher);
        this.testChildEventDispatcher.addEventListener(this.testEventType, this.testChildListenerFunction);
        this.testParentEventDispatcher.addEventListener(this.testEventType, this.testParentListenerFunction);
        this.testChildEventDispatcher.dispatchEvent(this.testEvent, this.testBubbles);
        test.assertTrue(this.childCalledVar,
            "Assert listener function on child dispatcher was called");
        test.assertFalse(this.parentCalledVar,
            "Assert listener function on parent dispatcher was not called when stopPropagation was called on a child " +
                "EventDispatcher");
    }
};
bugmeta.annotate(eventDispatcherDispatchEventStopPropagationTest).with(
    test().name("EventDispatcher dispatch event stopPropagation test")
);


/**
 * This tests
 * 1) Adding an event listener
 * 2) That hasEventListener returns true after adding an event listener
 * 3) Removing the event listener
 * 4) That hasEventListener returns false after removing the event listener
 */
var eventDispatcherSimpleAddAndRemoveEventListenerTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.eventDispatcher = new EventDispatcher();
        this.testEventType = "testEventType";
        this.testListenerContext = {};
        this.testListenerFunction = function(event) {};
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.eventDispatcher.addEventListener(this.testEventType, this.testListenerFunction, this.testListenerContext);
        var hasListenerAfterAdd = this.eventDispatcher.hasEventListener(this.testEventType, this.testListenerFunction,
            this.testListenerContext);
        test.assertTrue(hasListenerAfterAdd,
            "Assert hasEventListener returns true after adding an event listener.");

        this.eventDispatcher.removeEventListener(this.testEventType, this.testListenerFunction,
            this.testListenerContext);
        var hasListenerAfterRemove = this.eventDispatcher.hasEventListener(this.testEventType,
            this.testListenerFunction, this.testListenerContext);
        test.assertFalse(hasListenerAfterRemove,
            "Assert hasEventListener returns false after removing the event listener.");
    }
};
bugmeta.annotate(eventDispatcherSimpleAddAndRemoveEventListenerTest).with(
    test().name("EventDispatcher simple add and remove event listener test")
);

/**
 * This tests...
 * 1) That a listener add with onceOn is only fired once
 */
var eventDispatcherOnceOnTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.callCount = 0;
        this.eventDispatcher = new EventDispatcher();
        this.testEventType = "testEventType";
        this.testEventData = "testEventData";
        this.testEvent = new Event(this.testEventType, this.testEventData);
        this.testListenerContext = {};
        this.testListenerFunction = function(event) {
            _this.callCount++;
        };
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.eventDispatcher.onceOn(this.testEventType, this.testListenerFunction, this.testListenerContext);
        var hasListenerAfterAdd = this.eventDispatcher.hasEventListener(this.testEventType, this.testListenerFunction,
            this.testListenerContext);
        test.assertTrue(hasListenerAfterAdd,
            "Assert the eventDispatcher has the eventListener after it is added via the onceOn method.");
        test.assertEqual(this.callCount, 0,
            "Assert onceOn listener function has not been called before the event has been dispatched");

        this.eventDispatcher.dispatchEvent(this.testEvent);
        test.assertEqual(this.callCount, 1,
            "Assert onceOn listener function has been called once");

        this.eventDispatcher.dispatchEvent(this.testEvent);
        test.assertEqual(this.callCount, 1,
            "Assert onceOn listener function has only been called once");

        var hasEventListener = this.eventDispatcher.hasEventListener(this.testEventType, this.testListenerFunction, this.testListenerContext);
        test.assertFalse(hasEventListener,
            "Assert that the event dispatcher no longer has the event listener registered");
    }
};
bugmeta.annotate(eventDispatcherOnceOnTest).with(
    test().name("EventDispatcher #onceOn test")
);
