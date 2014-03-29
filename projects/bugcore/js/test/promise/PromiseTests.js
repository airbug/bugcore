//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Promise')
//@Require('TypeUtil')
//@Require('bugdouble.BugDouble')
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
var Promise         = bugpack.require('Promise');
var TypeUtil        = bugpack.require('TypeUtil');
var BugDouble       = bugpack.require('bugdouble.BugDouble');
var BugMeta         = bugpack.require('bugmeta.BugMeta');
var TestAnnotation  = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta         = BugMeta.context();
var spyOnObject     = BugDouble.spyOnObject;
var test            = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/**
 * This tests
 * 1) Instantiation of a basic Promise
 */
var promiseInstantiationTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testPromise = new Promise();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testPromise, Promise),
            "Assert that testPromise is an instance of Promise");
        test.assertTrue(this.testPromise.isPending(),
            "Assert that the promise defaults to 'pending'");
        test.assertEqual(this.testPromise.getHandlerList().getCount(), 0,
            "Assert that the handler list is empty");
    }
};
bugmeta.annotate(promiseInstantiationTest).with(
    test().name("Promise - instantiation test")
);


/**
 * This tests
 * 1) #then method of a Promise using no arguments
 */
var promiseThenNoArgumentsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testPromise = new Promise();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var resultPromise = this.testPromise.then();
        test.assertNotEqual(resultPromise, this.testPromise,
            "Assert that the returned promise is not the same promise as the testPromise");
        test.assertEqual(this.testPromise.getHandlerList().getCount(), 2,
            "Assert that the handlerList has 2 handlers");
    }
};
bugmeta.annotate(promiseThenNoArgumentsTest).with(
    test().name("Promise - #then no arguments test")
);


/**
 * This tests
 * 1) #then method of a Promise providing the fulfilledFunction argument only
 */
var promiseThenFulfilledFunctionArgumentOnlyTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testPromise            = new Promise();
        this.testFulfilledFunction  = function() {};
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var resultPromise = this.testPromise.then(this.testFulfilledFunction);
        test.assertNotEqual(resultPromise, this.testPromise,
            "Assert that the returned promise is not the same promise as the testPromise");
        test.assertEqual(this.testPromise.getHandlerList().getCount(), 2,
            "Assert that the handlerList has 2 handlers");
    }
};
bugmeta.annotate(promiseThenFulfilledFunctionArgumentOnlyTest).with(
    test().name("Promise - #then fulfilledArgument only test")
);


/**
 * This tests
 * 1) #then method of a Promise providing the rejectedFunction argument only
 */
var promiseThenRejectedFunctionArgumentOnlyTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testPromise            = new Promise();
        this.testRejectedFunction   = function() {};
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var resultPromise = this.testPromise.then(null, this.testRejectedFunction);
        test.assertNotEqual(resultPromise, this.testPromise,
            "Assert that the returned promise is not the same promise as the testPromise");
        test.assertEqual(this.testPromise.getHandlerList().getCount(), 2,
            "Assert that the handlerList has 2 handlers");
    }
};
bugmeta.annotate(promiseThenRejectedFunctionArgumentOnlyTest).with(
    test().name("Promise - #then rejectedArgument only test")
);


/**
 * This tests
 * 1) calling #resolvePromise twice throws a Bug
 */
var promiseResolvePromiseTwiceBugTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testPromise            = new Promise();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        this.testPromise.resolvePromise([]);
        test.assertThrows(function() {
            _this.testPromise.resolvePromise([]);
        }, "Assert that calling #resolvePromise again throws a Bug");
    }
};
bugmeta.annotate(promiseResolvePromiseTwiceBugTest).with(
    test().name("Promise - #resolvePromise twice should throw a Bug test")
);


/**
 * This tests
 * 1) calling #rejectProcess twice throws a Bug
 */
var promiseRejectPromiseTwiceBugTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testPromise            = new Promise();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        this.testPromise.rejectPromise([]);
        test.assertThrows(function() {
            _this.testPromise.rejectPromise([]);
        }, "Assert that calling #rejectPromise again throws a Bug");
    }
};
bugmeta.annotate(promiseRejectPromiseTwiceBugTest).with(
    test().name("Promise - #rejectProcess twice should throw a Bug test")
);

/**
 * This tests
 * 1) calling #rejectProcess and then #resolvePromise throws a Bug
 */
var promiseRejectPromiseAndResolvePromiseBugTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testPromise    = new Promise();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        this.testPromise.rejectPromise([]);
        test.assertThrows(function() {
            _this.testPromise.resolvePromise([]);
        }, "Assert that calling #resolvePromise after rejectPromise has already been called throws a Bug");
    }
};
bugmeta.annotate(promiseRejectPromiseAndResolvePromiseBugTest).with(
    test().name("Promise - #rejectProcess and resolvePromise should throw a Bug test")
);

/**
 * This tests
 * 1) calling #resolvePromise and passing the promises self as an arg rejects the promise with a TypeError Bug
 */
var promiseResolvePromiseWithSelfShouldRejectPromiseTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testPromise    = new Promise();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testPromise.resolvePromise([this.testPromise]);
        test.assertTrue(this.testPromise.isRejected(),
            "Assert that the promise has been rejected");
        test.assertEqual(this.testPromise.getReasonList().getCount(), 1,
            "Assert that the testPromise has one reason it's been rejected");
        if (this.testPromise.getReasonList().getCount() === 1) {
            var bug = this.testPromise.getReasonList().getAt(0);
            test.assertEqual(bug.getType(), "TypeError",
                "Assert that the reason list is a Bug with the type 'TypeError'");
        }
    }
};
bugmeta.annotate(promiseResolvePromiseWithSelfShouldRejectPromiseTest).with(
    test().name("Promise - #resolvePromise with self as arg should reject the promise with a TypeError Bug test")
);


/**
 * This tests
 * 1) calling #resolvePromise and passing two references of the promises self as args should reject promise once
 */
var promiseResolvePromiseWithTwoCopiesOfSelfShouldRejectOnceTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testPromise        = new Promise();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testPromise.resolvePromise([this.testPromise, this.testPromise]);
        test.assertTrue(this.testPromise.isRejected(),
            "Assert that the promise has been rejected");
        test.assertEqual(this.testPromise.getReasonList().getCount(), 1,
            "Assert that the testPromise has one reason it's been rejected");
        if (this.testPromise.getReasonList().getCount() === 1) {
            var bug = this.testPromise.getReasonList().getAt(0);
            test.assertEqual(bug.getType(), "TypeError",
                "Assert that the reason list is a Bug with the type 'TypeError'");
        }
    }
};
bugmeta.annotate(promiseResolvePromiseWithTwoCopiesOfSelfShouldRejectOnceTest).with(
    test().name("Promise - #resolvePromise and passing two references of the promises self as args should reject promise once")
);

/**
 * This tests
 * 1) calling #resolvePromise with empty values test
 */
var promiseResolvePromiseWithEmptyValuesTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testPromise        = new Promise();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testPromise.resolvePromise([]);
        test.assertTrue(this.testPromise.isFulfilled(),
            "Assert that the promise has been fulfilled");
        test.assertTrue(this.testPromise.getValueList().isEmpty(),
            "Assert that the testPromise's valueList is empty");
    }
};
bugmeta.annotate(promiseResolvePromiseWithEmptyValuesTest).with(
    test().name("Promise - #resolvePromise with empty values")
);
