//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Event')
//@Require('EventReceiver')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Event           = bugpack.require('Event');
var EventReceiver   = bugpack.require('EventReceiver');
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
 * 1) Instantiating an EventReceiver
 * 2) That the receiver target is set to itself if no target is passed in during instantiation
 * 3) That the receiver target is set to the value passed in during instantiation
 */
var eventReceiverInstantiationTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.eventReceiverrWithoutTarget   = new EventReceiver();
        this.testTarget = {};
        this.eventReceiverWithTarget       = new EventReceiver(this.testTarget);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.eventReceiverrWithoutTarget.getParentPropagator(), undefined,
            "Assert parentPropagator defaults to undefined");
        test.assertEqual(this.eventReceiverrWithoutTarget.getTarget(), this.eventReceiverrWithoutTarget,
            "Assert eventReceiver target is set to itself if no target is passed in during instantiation");
        test.assertEqual(this.eventReceiverWithTarget.getTarget(), this.testTarget,
            "Assert eventReceiver target is set to the target passed in during instantiation");
    }
};
bugmeta.annotate(eventReceiverInstantiationTest).with(
    test().name("EventReceiver - instantiation test")
);


/**
 * This tests
 * 1) the #on method of EventReceiver
 * 2) the #off method of EventReceiver
 */
var eventReceiverOnOffTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testEventType = "testEventType";
        this.eventReceiver = new EventReceiver();
        this.testListenerFunction = function() {};
        this.testListenerContext = {};
        this.eventReceiver.on(this.testEventType, this.testListenerFunction, this.testListenerContext);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(this.eventReceiver.hasEventListener(this.testEventType, this.testListenerFunction, this.testListenerContext),
            "Assert eventReceiver has the correct event listener after using the #on function");

        this.eventReceiver.off(this.testEventType, this.testListenerFunction, this.testListenerContext);
        test.assertFalse(this.eventReceiver.hasEventListener(this.testEventType, this.testListenerFunction, this.testListenerContext),
            "Assert eventReceiver no longer has the event listener after using the #off function");
    }
};
bugmeta.annotate(eventReceiverOnOffTest).with(
    test().name("EventReceiver - #on #off test")
);
