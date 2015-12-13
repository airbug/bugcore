/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('HashTable')
//@Require('TypeUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var HashTable   = bugpack.require('HashTable');
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
     * 1) Instantiation of a new HashTable
     * 2) That the count of a HashTable is 0 after instantiation
     */
    var hashTableInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.hashTable = new HashTable();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.hashTable.getCount(), 0,
                'Assert HashTable count is 0 after instantiation');
        }
    };

    /**
     * This tests
     * 1) That the toKeyArray method returns an array of the HashTable's keys
     */
    var hashTableToKeyArrayTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.hashTable = new HashTable();
            this.hashTable.put('key1', 'value1');
            this.hashTable.put('key2', 'value2');
            this.hashTable.put('key3', 'value3');
            this.keyArray = this.hashTable.toKeyArray();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(TypeUtil.isArray(this.keyArray),
                'Assert value returned from toKeyArray is an array');
            test.assertEqual(this.keyArray.length, 3,
                'Assert key array length is 3');
            test.assertTrue((this.keyArray.indexOf('key1') >= 0),
                'Assert key1 is in the key array');
            test.assertTrue((this.keyArray.indexOf('key2') >= 0),
                'Assert key2 is in the key array');
            test.assertTrue((this.keyArray.indexOf('key3') >= 0),
                'Assert key3 is in the key array');
        }
    };

    /**
     * This tests
     * 1) That the toValueArray method returns an array of the HashTable's values
     */
    var hashTableToValueArrayTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.hashTable = new HashTable();
            this.hashTable.put('key1', 'value1');
            this.hashTable.put('key2', 'value2');
            this.hashTable.put('key3', 'value3');
            this.valueArray = this.hashTable.toValueArray();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(TypeUtil.isArray(this.valueArray),
                'Assert value returned from toValueArray is an array');
            test.assertEqual(this.valueArray.length, 3,
                'Assert value array length is 3');
            test.assertTrue((this.valueArray.indexOf('value1') >= 0),
                'Assert value1 is in the value array');
            test.assertTrue((this.valueArray.indexOf('value2') >= 0),
                'Assert value2 is in the value array');
            test.assertTrue((this.valueArray.indexOf('value3') >= 0),
                'Assert value3 is in the value array');
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(hashTableInstantiationTest).with(
        test().name('HashTable - instantiation test')
    );
    bugmeta.tag(hashTableToKeyArrayTest).with(
        test().name('HashTable - #toKeyArray test')
    );
    bugmeta.tag(hashTableToValueArrayTest).with(
        test().name('HashTable - #toValueArray test')
    );
});
