//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('RejectedHandler')
//@Require('Promise')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var RejectedHandler     = bugpack.require('RejectedHandler');
var Promise             = bugpack.require('Promise');
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
 * 1) Instantiation of a basic RejectedHandler
 */
var rejectedHandlerInstantiationTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testMethod             = function() {};
        this.testForwardPromise     = new Promise();
        this.testRejectedHandler    = new RejectedHandler(this.testMethod, this.testForwardPromise);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testRejectedHandler, RejectedHandler),
            "Assert that testRejectedHandler is an instance of RejectedHandler");
        test.assertEqual(this.testRejectedHandler.getMethod(), this.testMethod,
            "Assert that #getMethod returns the method passed in during instantiation");
        test.assertEqual(this.testRejectedHandler.getForwardPromise(), this.testForwardPromise,
            "Assert that #getForwardPromise returns the Promise passed in during instantiation");
    }
};
bugmeta.annotate(rejectedHandlerInstantiationTest).with(
    test().name("RejectedHandler - instantiation test")
);


/**
 * This tests
 * 1) calling #handle when no method has been supplied
 */
var rejectedHandlerHandleNoMethodTest = {

    async: true,

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMethod             = null;
        this.testArgs               = ["reason1", "reason2"];
        this.testForwardPromise     = new Promise();
        this.testRejectedHandler    = new RejectedHandler(this.testMethod, this.testForwardPromise);
        test.completeSetup();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        this.testRejectedHandler.handle(this.testArgs);
        setTimeout(function() {
            var reasonList = _this.testForwardPromise.getReasonList();
            test.assertEqual(reasonList.getCount(), _this.testArgs.length,
                "Assert that the reasonList has the same number of reasons as the testArgs");
            if (reasonList.getCount() === _this.testArgs.length) {
                _this.testArgs.forEach(function(reason, index) {
                    test.assertEqual(reason, reasonList.getAt(index),
                        "Assert that the reason from testArgs matches the reason in reasonList at the same index");
                });
            }
            test.completeTest();
        }, 0);
    }
};
bugmeta.annotate(rejectedHandlerHandleNoMethodTest).with(
    test().name("RejectedHandler - #handle no method test")
);
