//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('StringUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var StringUtil      = bugpack.require('StringUtil');
var BugMeta         = bugpack.require('bugmeta.BugMeta');
var TestAnnotation  = bugpack.require('bugunit.TestAnnotation');


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
 * 1) padding a string
 */
var stringPadTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testString = "ABC";
        this.testPadChar = "+";
        this.testLength = 10;
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var result = StringUtil.pad(this.testString, this.testPadChar, this.testLength);
        test.assertEqual(result, "+++++++ABC",
            "Assert the string has been padded correctly");
    }
};
bugmeta.annotate(stringPadTest).with(
    test().name("String - #pad test")
);


/**
 * This tests
 * 1) Escape a string
 */
var stringEscapeStringTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testString = "\'ABC\"123";
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var result = StringUtil.escapeString(this.testString);
        test.assertEqual(result, "\\\'ABC\\\"123",
            "Assert the string has been escaped correctly");
    }
};
bugmeta.annotate(stringEscapeStringTest).with(
    test().name("String - #escapeString test")
);

/**
 * This tests
 * 1) Trimming a string
 */
var stringTrimTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testString = "  ABC  ";
        this.testString.trim = null;
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var result = StringUtil.trim(this.testString);
        test.assertEqual(result, "ABC",
            "Assert the string has been trimmed correctly");
    }
};
bugmeta.annotate(stringTrimTest).with(
    test().name("String - #trim test")
);

/**
 * This tests
 * 1) Trimming a string with new lines at the end/beginning
 */
var stringTrimNewLineTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testString = "\nABC\n";
        this.testString.trim = null;
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var result = StringUtil.trim(this.testString);
        test.assertEqual(result, "ABC",
            "Assert the string has been trimmed correctly");
    }
};
bugmeta.annotate(stringTrimNewLineTest).with(
    test().name("String - #trim new line test")
);
