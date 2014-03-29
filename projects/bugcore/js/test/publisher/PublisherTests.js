//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Publisher')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Publisher       = bugpack.require('Publisher');
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
 * 1) Subscribing to a topic.
 */
var publisherSubscribePublishTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.publisher = new Publisher();
        this.calledVar = false;
        this.testContextVar = "some value";
        this.testContext = {
            testContextVar: this.testContextVar
        };
        this.testData = "my message";
        this.testTopic = 'test topic';
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        this.testFunction = function(message) {
            _this.calledVar = true;
            test.assertEqual(this.testContextVar, _this.testContextVar,
                "Assert the subscriber function was called in the subscriber context");
            test.assertEqual(message.getTopic(), _this.testTopic,
                "Assert message topic received was the message topic published");
            test.assertEqual(message.getData(), _this.testData,
                "Assert message data received was the message data published");
        };
        this.publisher.subscribe(this.testTopic, this.testFunction, this.testContext);
        this.publisher.publish(this.testTopic, this.testData);
        test.assertTrue(this.calledVar, "Assert subscriber function was called.");
    }
};
bugmeta.annotate(publisherSubscribePublishTest).with(
    test().name("Publisher subscribe and publish test")
);
