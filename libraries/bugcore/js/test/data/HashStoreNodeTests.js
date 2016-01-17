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
//@Require('HashStoreNode')
//@Require('ReflectArray')
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
    var HashStoreNode   = bugpack.require('HashStoreNode');
    var ReflectArray    = bugpack.require('ReflectArray');
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
            test.assertTrue(Class.doesExtend(this.hashStoreNode, HashStoreNode),
                "Assert instance of HashStoreNode");
            test.assertEqual(this.hashStoreNode.getCount(), 0,
                "Assert HashStoreNode count is 0 after instantiation");
            test.assertTrue(Class.doesExtend(this.hashStoreNode.getItemReflectArray(), ReflectArray),
                "Assert HashStoreNode.itemReflectArray is an instance of ReflectArray");
            test.assertEqual(this.hashStoreNode.getItemReflectArray().getLength(), 0,
                "Assert HashStoreNode.itemReflectArray is empty");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(hashStoreNodeInstantiationTest).with(
        test().name("HashStoreNode - instantiation test")
    );
});


