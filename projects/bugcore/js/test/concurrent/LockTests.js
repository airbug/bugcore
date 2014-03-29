//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Lock')
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
var Lock            = bugpack.require('Lock');
var BugDouble       = bugpack.require('bugdouble.BugDouble');
var BugMeta         = bugpack.require('bugmeta.BugMeta');
var TestAnnotation  = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta         = BugMeta.context();
var test            = TestAnnotation.test;
var spyOnFunction   = BugDouble.spyOnFunction;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/**
 * This tests
 * 1) Instantiation of a Lock
 * 2) acquiring the lock
 * 3) Ensuring that the lock does not execute other acquiring methods when it is locked
 */
var lockWaitLockTest = {

    async: true,

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.testLock = new Lock();
        this.testMethod1 = function() {
            setTimeout(function() {
                test.assertTrue(_this.testMethod2Spy.wasNotCalled(),
                    "Assert method 2 has not been called");
                test.assertTrue(_this.testMethod3Spy.wasNotCalled(),
                    "Assert method 3 has not been called");
                _this.testLock.unlock();
            }, 0);
        };
        this.testMethod1Spy = spyOnFunction(this.testMethod1);
        this.testMethod2 = function() {
            setTimeout(function() {
                test.assertTrue(_this.testMethod1Spy.wasCalled(),
                    "Assert method 1 has been called");
                test.assertTrue(_this.testMethod3Spy.wasNotCalled(),
                    "Assert method 3 has not been called");
                _this.testLock.unlock();
            }, 0);
        };
        this.testMethod2Spy = spyOnFunction(this.testMethod2);
        this.testMethod3 = function() {
            setTimeout(function() {
                test.assertTrue(_this.testMethod1Spy.wasCalled(),
                    "Assert method 1 has not been called");
                test.assertTrue(_this.testMethod2Spy.wasCalled(),
                    "Assert method 2 has not been called");
                _this.testLock.unlock();
                test.completeTest();
            }, 0);
        };
        this.testMethod3Spy = spyOnFunction(this.testMethod3);
        test.completeSetup();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testLock.waitLock(this.testMethod1Spy);
        test.assertTrue(this.testMethod2Spy.wasNotCalled(),
            "Assert testMethod2 was not called");

        this.testLock.waitLock(this.testMethod2Spy);
        this.testLock.waitLock(this.testMethod3Spy);
    }
};
bugmeta.annotate(lockWaitLockTest).with(
    test().name("Lock - #waitLock test")
);

//TODO BRN: Write a stack overflow test
