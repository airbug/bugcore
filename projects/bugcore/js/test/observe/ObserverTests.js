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
//@Require('ObjectPathMatcher')
//@Require('Observer')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var ObjectPathMatcher   = bugpack.require('ObjectPathMatcher');
    var Observer            = bugpack.require('Observer');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var TestTag             = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var test                = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests...
     * 1) Instantiating a Observer class with no parameters
     * 2) That instantiating without an objectPathPattern throws an error;
     * 3) That instantiating without an observerFunction throws an error;
     */
    var observerInstantiationBadParametersTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {

        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertThrows(function() {
                var testObserver = new Observer(undefined, function() {}, {});
            }, "Assert that passing undefined for objectPathPattern throws an error");
            test.assertThrows(function() {
                var testObserver = new Observer("test", undefined, {});
            }, "Assert that passing undefined for observerFunction throws an error");
            test.assertNotThrows(function() {
                var testObserver = new Observer("test", function() {});
            }, "Assert that passing undefined for observerContext does NOT throw an error");
        }
    };
    bugmeta.tag(observerInstantiationBadParametersTest).with(
        test().name("Observer - instantiation with bad parameters test")
    );



    /**
     * This tests...
     * 1) Instantiating a Observer class with parameters
     */
    var observerInstantiationWithParametersTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testObjectPathPattern  = "test";
            this.testObserverFunction   = function() {};
            this.testObserverContext    = {};
            this.testObserver           = new Observer(this.testObjectPathPattern, this.testObserverFunction, this.testObserverContext);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testObserver, Observer),
                "Assert that testObserver is an instance of Observable");
            test.assertEqual(this.testObserver.getObservationPathPattern(), this.testObjectPathPattern,
                "Assert that Observer.objectPathPattern is undefined");
            test.assertEqual(this.testObserver.getObserverContext(), this.testObserverContext,
                "Assert that Observer.observerContext is undefined");
            test.assertEqual(this.testObserver.getObserverFunction(), this.testObserverFunction,
                "Assert that Observer.observerFunction is undefined");
            var objectPathMatcher = this.testObserver.getObjectPathMatcher();
            test.assertTrue(Class.doesExtend(objectPathMatcher, ObjectPathMatcher),
                "Assert that objectPathMatcher is an instance of ObjectPathMatcher");
        }
    };
    bugmeta.tag(observerInstantiationWithParametersTest).with(
        test().name("Observer - instantiation with parameters test")
    );
});
