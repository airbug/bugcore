//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Handler')
//@Require('Promise')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Handler         = bugpack.require('Handler');
var Promise         = bugpack.require('Promise');
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
 * 1) Instantiation of a basic Handler
 */
var handlerInstantiationTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testMethod             = function() {};
        this.testForwardPromise     = new Promise();
        this.testHandler            = new Handler(this.testMethod, this.testForwardPromise);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testHandler, Handler),
            "Assert that testHandler is an instance of Handler");
        test.assertEqual(this.testHandler.getMethod(), this.testMethod,
            "Assert that #getMethod returns the method passed in during instantiation");
        test.assertEqual(this.testHandler.getForwardPromise(), this.testForwardPromise,
            "Assert that #getForwardPromise returns the Promise passed in during instantiation");
    }
};
bugmeta.annotate(handlerInstantiationTest).with(
    test().name("Handler - instantiation test")
);

/**
 * This tests
 * 1) #doHandleMethod test with method that throws exception
 */
var handlerDoHandleMethodWithThrowTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testError              = new Error();
        this.testMethod             = function() {
            throw _this.testError;
        };
        this.testForwardPromise     = new Promise();
        this.testHandler            = new Handler(this.testMethod, this.testForwardPromise);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testHandler.doHandleMethod([]);
        test.assertTrue(this.testForwardPromise.isRejected(),
            "Assert that the forward promise has been rejected");
        test.assertEqual(this.testForwardPromise.getReasonList().getCount(), 1,
            "Assert that the reasonList contains 1 reason")
        if (this.testForwardPromise.getReasonList().getCount() === 1) {
            test.assertEqual(this.testForwardPromise.getReasonList().getAt(0), this.testError,
                "Assert that the reason at index 0 is the testError");
        }
    }
};
bugmeta.annotate(handlerDoHandleMethodWithThrowTest).with(
    test().name("Handler - #doHandleMethod with throw test")
);


/**
 * This tests
 * 1) #doHandleMethod test with method that returns value
 */
var handlerDoHandleMethodWithReturnTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testValue              = "testValue";
        this.testMethod             = function() {
            return _this.testValue;
        };
        this.testForwardPromise     = new Promise();
        this.testHandler            = new Handler(this.testMethod, this.testForwardPromise);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testHandler.doHandleMethod([]);
        test.assertTrue(this.testForwardPromise.isFulfilled(),
            "Assert that the forward promise has been fulfilled");
        test.assertEqual(this.testForwardPromise.getValueList().getCount(), 1,
            "Assert that the valueList contains 1 reason");
        if (this.testForwardPromise.getValueList().getCount() === 1) {
            test.assertEqual(this.testForwardPromise.getValueList().getAt(0), this.testValue,
                "Assert that the value at index 0 is the testValue");
        }
    }
};
bugmeta.annotate(handlerDoHandleMethodWithReturnTest).with(
    test().name("Handler - #doHandleMethod with method that returns value test")
);
