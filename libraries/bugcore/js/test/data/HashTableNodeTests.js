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
//@Require('HashTableNode')
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
    var HashTableNode   = bugpack.require('HashTableNode');
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
            test.assertTrue(Class.doesExtend(this.hashTableNode.getKeyReflectArray(), ReflectArray),
                "Assert HashTableNode.keyReflectArray is an instance of ReflectArray");
            test.assertEqual(this.hashTableNode.getKeyReflectArray().getLength(), 0,
                "Assert HashTableNode.keyReflectArray is empty");
            test.assertTrue(Class.doesExtend(this.hashTableNode.getValueReflectArray(), ReflectArray),
                "Assert HashTableNode.valueArray is an instance of ReflectArray");
            test.assertEqual(this.hashTableNode.getValueReflectArray().getLength(), 0,
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
            this.keyReflectArray = this.hashTableNode.getKeyReflectArray();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.keyReflectArray, ReflectArray),
                "Assert value returned from getKeyReflectArray is an instance of ReflectArray");
            test.assertEqual(this.keyReflectArray.getLength(), 3,
                "Assert key array length is 3");
            test.assertTrue((this.keyReflectArray.indexOf('key1') >= 0),
                "Assert key1 is in the key array");
            test.assertTrue((this.keyReflectArray.indexOf('key2') >= 0),
                "Assert key2 is in the key array");
            test.assertTrue((this.keyReflectArray.indexOf('key3') >= 0),
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
