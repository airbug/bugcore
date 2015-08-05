/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('HashTableNode')
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

    var HashTableNode   = bugpack.require('HashTableNode');
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
     * 1) Instantiation of a new HashTableNode
     * 2) That the count of a HashTableNode is 0 after instantiation
     */
    var hashTableNodeInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.hashTableNode = new HashTableNode();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.hashTableNode.getCount(), 0,
                "Assert HashTableNode count is 0 after instantiation");
            test.assertTrue(TypeUtil.isArray(this.hashTableNode.getKeyArray()),
                "Assert HashTableNode.keyArray is an array");
            test.assertEqual(this.hashTableNode.getKeyArray().length, 0,
                "Assert HashTableNode.keyArray is empty");
            test.assertTrue(TypeUtil.isArray(this.hashTableNode.getValueArray()),
                "Assert HashTableNode.valueArray is an array");
            test.assertEqual(this.hashTableNode.getValueArray().length, 0,
                "Assert HashTableNode.valueArray is empty");
        }
    };

    /**
     * This tests
     * 1) Simple put() and get() test
     */
    var hashTablePutAndGetTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.hashTableNode = new HashTableNode();
            this.hashTableNode.put('key1', 'value1');
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.hashTableNode.get('key1'), 'value1',
                "Assert get 'key1' returns 'value1'");
        }
    };

    /**
     * This tests
     * 1) That the getKeyArray method returns an array of the HashTableNode's keys
     */
    var hashTableNodeGetKeyArrayTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.hashTableNode = new HashTableNode();
            this.hashTableNode.put('key1', 'value1');
            this.hashTableNode.put('key2', 'value2');
            this.hashTableNode.put('key3', 'value3');
            this.keyArray = this.hashTableNode.getKeyArray();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(TypeUtil.isArray(this.keyArray),
                "Assert value returned from getKeyArray is an array");
            test.assertEqual(this.keyArray.length, 3,
                "Assert key array length is 3");
            test.assertTrue((this.keyArray.indexOf('key1') >= 0),
                "Assert key1 is in the key array");
            test.assertTrue((this.keyArray.indexOf('key2') >= 0),
                "Assert key2 is in the key array");
            test.assertTrue((this.keyArray.indexOf('key3') >= 0),
                "Assert key3 is in the key array");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(hashTableNodeInstantiationTest).with(
        test().name("HashTableNode - instantiation test")
    );
    bugmeta.tag(hashTablePutAndGetTest).with(
        test().name("HashTableNode - put() and get() test")
    );
    bugmeta.tag(hashTableNodeGetKeyArrayTest).with(
        test().name("HashTableNode - getKeyArray test")
    );
});
