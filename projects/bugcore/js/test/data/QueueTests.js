//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Obj')
//@Require('Queue')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var Queue           = bugpack.require('Queue');
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


var queueConstructorTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.array = ["how's", "it", "going?"];
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.queueZero     = new Queue();
        this.queueOne      = new Queue(["hello", "Brian"]);
        this.queueTwo      = new Queue(this.array);
        this.queueThree    = new Queue(this.queueOne);

        test.assertEqual(this.queueZero.getCount(), 0,
            "Assert Queue does not add arguments when none are given at construction time");

        test.assertEqual(this.queueTwo.containsAll(this.array), true,
            "Assert Queue accepts an Array as an argument at construction time and adds the array values to the List");

        test.assertEqual(this.queueOne.contains("hello"), true,
            "Assert Queue added value from array in to Queue");
        test.assertEqual(this.queueOne.contains("Brian"), true,
            "Assert Queue added value from array in to Queue");

        test.assertEqual(this.queueThree.containsAll(this.queueOne), true,
            "Assert collection accepts a Queue as an argument at construction time and adds the Queue values to the new Queue");
    }
};
bugmeta.annotate(queueConstructorTest).with(
    test().name("Queue constructor test")
);

/**
 * This tests
 * 1) queueing a few items and then making sure that they dequeue in the correct order
 */
var enqueueDequeueTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.queue = new Queue();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.queue.enqueue("value1");
        this.queue.enqueue("value2");
        this.queue.enqueue("value3");

        var dequeue1 = this.queue.dequeue();
        var dequeue2 = this.queue.dequeue();
        var dequeue3 = this.queue.dequeue();

        test.assertEqual(dequeue1, "value1",
            "Assert the first value dequeued from the queue is 'value1'");
        test.assertEqual(dequeue2, "value2",
            "Assert the second value dequeued from the queue is 'value2'");
        test.assertEqual(dequeue3, "value3",
            "Assert the third value dequeued from the queue is 'value3'");
    }
};
bugmeta.annotate(enqueueDequeueTest).with(
    test().name("Queue enqueue and dequeue test")
);
