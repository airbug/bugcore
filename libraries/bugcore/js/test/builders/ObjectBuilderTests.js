/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('ObjectBuilder')
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

    var Class           = bugpack.require('Class');
    var ObjectBuilder   = bugpack.require('ObjectBuilder');
    var TypeUtil        = bugpack.require('TypeUtil');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestTag         = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var test            = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests
     * 1) That the static method .build works as expected
     */
    var objectBuilderBuildBasicTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testObject = ObjectBuilder.build();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(TypeUtil.isObject(this.testObject), true,
                "Assert ObjectBuilder.build() returned an object");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(objectBuilderBuildBasicTest).with(
        test().name("ObjectBuilder - ObjectBuilder.build() basic test")
    );
});
