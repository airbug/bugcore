/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('RateLimiter')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var RateLimiter     = bugpack.require('RateLimiter');
    var BugDouble       = bugpack.require('bugdouble.BugDouble');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestTag         = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var test            = TestTag.test;
    var spyOnFunction   = BugDouble.spyOnFunction;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests
     * 1) Instantiate a simple RateLimiter
     */
    var rateLimiterInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testPermitsPerSecond   = 3;
            this.testRateLimiter        = new RateLimiter(this.testPermitsPerSecond);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testRateLimiter, RateLimiter),
                "Assert instances of RateLimiter");
            test.assertTrue(this.testRateLimiter.getAcquisitionQueue().isEmpty(),
                "Assert that the RateLimiter acquisition queue is empty");
            test.assertEqual(this.testRateLimiter.getPermitsPerSecond(), this.testPermitsPerSecond,
                "Assert RateLimiter.permitsPerSecond was set correctly");
        }
    };

    /**
     * This tests
     * 1) Acquire the first permit
     * 2) Assert queue is empty
     * 3) Assert method has been executed
     * 3) Assert last
     */
    var rateLimiterAcquireFirstPermitTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testRateLimiter = new RateLimiter(1);
            this.testMethod = function() {};
            this.testMethodSpy = spyOnFunction(this.testMethod);
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testRateLimiter.acquire(this.testMethodSpy);
            test.assertTrue(this.testRateLimiter.getAcquisitionQueue().isEmpty(),
                "Assert acquisition queue is empty");
            test.assertTrue(this.testMethodSpy.wasCalled(),
                "Assert test method was called");
            test.assertTrue(this.testRateLimiter.getLastAcquisitionTime() > Date.now() - 1000,
                "Assert last acquisition time was within the last second");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(rateLimiterInstantiationTest).with(
        test().name("RateLimiter - instantiation test")
    );
    bugmeta.tag(rateLimiterAcquireFirstPermitTest).with(
        test().name("RateLimiter - #acquire first permit test")
    );
});
