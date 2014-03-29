//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('PublisherMessage')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var PublisherMessage    = bugpack.require('PublisherMessage');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta             = BugMeta.context();
var test                = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/**
 * This tests
 * 1) Instantiation of a PublisherMessage
 * 2) That the topic and data values were set correctly during instantiation
 */
var instantiatePublisherMessageTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testTopic = "testTopic";
        this.testData = "testData";
        this.publisherMessage = new PublisherMessage(this.testTopic, this.testData);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.publisherMessage.getTopic(), this.testTopic,
            "Assert message topic was set correctly during instantiation");
        test.assertEqual(this.publisherMessage.getData(), this.testData,
            "Assert message data was set correctly during instantiation");
    }
};
bugmeta.annotate(instantiatePublisherMessageTest).with(
    test().name("PublisherMessage instantiation test")
);
