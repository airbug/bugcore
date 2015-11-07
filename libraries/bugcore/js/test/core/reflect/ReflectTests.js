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
//@Require('Object')
//@Require('Reflect')
//@Require('TypeUtil')
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
    var Object      = bugpack.require('Object');
    var Reflect     = bugpack.require('Reflect');
    var TypeUtil    = bugpack.require('TypeUtil');
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
     * 1) The Reflect.has method
     */
    var reflectHasTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.object = {
                A: "ValueA"
            };
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(Reflect.has(this.object, "A"), true,
                "Assert Reflect.has returns true for a property that exists");
            test.assertEqual(Reflect.has(this.object, "B"), false,
                "Assert Reflect.has returns false for a property that does NOT exist");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(reflectHasTest).with(
        test().name("Reflect - has() test")
    );
});


//TODO BRN: Add a test that ensures that Reflect.apply method still works if the target.apply method has been overridden

//TODO BRN: Add a test that ensures that Reflect.construct method still works if the target.apply method has been overridden
