/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('IdGenerator')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var IdGenerator     = bugpack.require('IdGenerator');
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
     * This tests...
     * 1) Generating a new id is always a different id.
     */
    var generateIdTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.id1 = IdGenerator.generateId();
            this.id2 = IdGenerator.generateId();
            this.id3 = IdGenerator.generateId();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertNotEqual(this.id1, this.id2,
                "Assert the first id generated and the second id generated are not equal");
            test.assertNotEqual(this.id2, this.id3,
                "Assert the second id generated and the third id generated are not equal");
            test.assertNotEqual(this.id1, this.id3,
                "Assert the third id generated and the first id generated are not equal");
        }
    };
    bugmeta.tag(generateIdTest).with(
        test().name("IdGenerator generate id test")
    );
});
