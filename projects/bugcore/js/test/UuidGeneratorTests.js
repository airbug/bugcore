//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('TypeUtil')
//@Require('UuidGenerator')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var TypeUtil        = bugpack.require('TypeUtil');
var UuidGenerator   = bugpack.require('UuidGenerator');
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
 * 1) generating two uuids creates two different uuid strings
 */
var generateTwoUuidsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testUuid1 = UuidGenerator.generateUuid();
        this.testUuid2 = UuidGenerator.generateUuid();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(TypeUtil.isString(this.testUuid1),
            "Assert uuid1 is a string");
        test.assertTrue(TypeUtil.isString(this.testUuid2),
            "Assert uuid2 is a string");
        test.assertTrue(this.testUuid1 !== this.testUuid2,
            "Assert uuid1 and uuid2 are not equal");
    }
};
bugmeta.annotate(generateTwoUuidsTest).with(
    test().name("UuidGenerator - generate two uuids test")
);
