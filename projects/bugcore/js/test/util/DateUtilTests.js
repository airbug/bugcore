//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('DateUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var DateUtil        = bugpack.require('DateUtil');
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
 * 1) Getting an AM from a Date
 * 2) Getting a PM from a Date
 */
var dateUtilGetAmPmTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testAmDate = new Date("October 13, 1975 11:13:00");
        this.testPmDate = new Date("Octoner 13, 1975 23:13:00");
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(DateUtil.getAMPM(this.testAmDate), "AM",
            "Assert an AM Date returned AM");
        test.assertEqual(DateUtil.getAMPM(this.testPmDate), "PM",
            "Assert a PM Date returned PM");
    }
};
bugmeta.annotate(dateUtilGetAmPmTest).with(
    test().name("DateUtil - #getAMPM test")
);
