/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Trace')
//@Require('TypeUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Trace       = bugpack.require('Trace');
    var TypeUtil    = bugpack.require('TypeUtil');
    var BugMeta     = bugpack.require('bugmeta.BugMeta');
    var TestTag     = bugpack.require('bugunit.TestTag');
    var BugYarn     = bugpack.require('bugyarn.BugYarn');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta     = BugMeta.context();
    var bugyarn     = BugYarn.context();
    var test        = TestTag.test;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWeaver("testTrace", function(yarn, args) {
        return new Trace(args[0], args[1]);
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var traceInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testName   = "testName";
            this.testStack  = "testStack";
            this.testTrace  = new Trace(this.testStack, this.testName);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testTrace, Trace),
                "Assert instance of Trace");
            test.assertEqual(this.testTrace.getName(), this.testName,
                "Assert .name was set correctly");
            test.assertEqual(this.testTrace.getStack(), this.testStack,
                "Assert .stack was set correctly");
            test.assertTrue(TypeUtil.isArray(this.testTrace.getChildTraces()),
                "Assert .childTraces is an Array");
            if (TypeUtil.isArray(this.testTrace.getChildTraces())) {
                test.assertEqual(this.testTrace.getChildTraces().length, 0,
                    "Assert .childTraces is an empty Array");
            }
            test.assertEqual(this.testTrace.getParentTrace(), null,
                "Assert .parentTrace is null");
        }
    };


    var traceAddChildTraceTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testParentName     = "testParentName";
            this.testParentTrace    = new Trace("", this.testParentName);
            this.testChildName      = "testChildName";
            this.testChildTrace     = new Trace("", this.testChildName);
            this.testParentTrace.addChildTrace(this.testChildTrace);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testChildTrace.getParentTrace(), this.testParentTrace,
                "Assert .parentTrace was set properly");
            test.assertEqual(this.testParentTrace.getChildTraces()[0], this.testChildTrace,
                "Assert .childTraces[0] is testChildTrace");
        }
    };

    var traceRemoveChildTraceTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testParentName     = "testParentName";
            this.testParentTrace    = new Trace("", this.testParentName);
            this.testChildName      = "testChildName";
            this.testChildTrace     = new Trace("", this.testChildName);
            this.testParentTrace.addChildTrace(this.testChildTrace);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testChildTrace.getParentTrace(), this.testParentTrace,
                "Assert .parentTrace was set properly");
            test.assertEqual(this.testParentTrace.getChildTraces()[0], this.testChildTrace,
                "Assert .childTraces[0] is testChildTrace");
            this.testParentTrace.removeChildTrace(this.testChildTrace);
            test.assertEqual(this.testChildTrace.getParentTrace(), null,
                "Assert .parentTrace is null after child was removed");
            test.assertEqual(this.testParentTrace.getChildTraces().length, 0,
                "Assert .childTraces is empty after child was removed");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(traceInstantiationTest).with(
        test().name("Trace - instantiation test")
    );
    bugmeta.tag(traceAddChildTraceTest).with(
        test().name("Trace - addChildTrace() test")
    );
    bugmeta.tag(traceRemoveChildTraceTest).with(
        test().name("Trace - removeChildTrace() test")
    );
});
