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
//@Require('Resolver')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Resolver    = bugpack.require('Resolver');
    var BugMeta     = bugpack.require('bugmeta.BugMeta');
    var TestTag     = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta     = BugMeta.context();
    var test        = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests
     * 1) Instantiation of a basic Resolver
     */
    var resolverInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testIllegalValues      = ["illegalValue0"];
            this.testValues             = ["testValue"];
            this.testResolver           = new Resolver(this.testIllegalValues, this.testValues);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testResolver, Resolver),
                "Assert that testResolver is an instance of Resolver");
            test.assertEqual(this.testResolver.getIllegalValues().getCount(), 1,
                "Assert that #getIllegalValues has 1 value");
            test.assertEqual(this.testResolver.getValues().getCount(), 1,
                "Assert that #getValues has 1 value");
            test.assertEqual(this.testResolver.getResolved(), false,
                "Assert that #getResolved defaults to false");
            test.assertEqual(this.testResolver.getResolving(), false,
                "Assert that #getResolving defaults to false");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(resolverInstantiationTest).with(
        test().name("Resolver - instantiation test")
    );
});
