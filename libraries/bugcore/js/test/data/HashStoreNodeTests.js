/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('HashStoreNode')
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

    var HashStoreNode   = bugpack.require('HashStoreNode');
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
     * 1) Instantiation of a new HashStoreNode
     * 2) That the count of a HashStoreNode is 0 after instantiation
     */
    var hashStoreNodeInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.hashStoreNode = new HashStoreNode();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.hashStoreNode.getCount(), 0,
                "Assert HashStoreNode count is 0 after instantiation");
            test.assertTrue(TypeUtil.isArray(this.hashStoreNode.getItemArray()),
                "Assert HashStoreNode.itemArray is an array");
            test.assertEqual(this.hashStoreNode.getItemArray().length, 0,
                "Assert HashStoreNode.itemArray is empty");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(hashStoreNodeInstantiationTest).with(
        test().name("HashStoreNode - instantiation test")
    );
});


