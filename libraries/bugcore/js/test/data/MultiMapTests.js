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
//@Require('Collection')
//@Require('MultiMap')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Collection  = bugpack.require('Collection');
    var MultiMap    = bugpack.require('MultiMap');
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
     *
     */
    var multiMapSimplePutContainsValueTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.map = new MultiMap();
            this.value1 = 'value1';
            this.value2 = 'value2';
            this.value3 = 'value3';
            this.map.put('key1', this.value1);
            this.map.put('key2', this.value2);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.map.containsValue(this.value1), true,
                'Assert containsValue returns true for value1.');
            test.assertEqual(this.map.containsValue(this.value2), true,
                'Assert containsValue returns true for value2.');
            test.assertEqual(this.map.containsValue(this.value3), false,
                'Assert containsValue returns false for value that hasn\'t been added to the map.');
        }
    };

    /**
     *
     */
    var multiMapSimplePutGetTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.map = new MultiMap();
            this.key1 = 'key1';
            this.value1 = 'value1';
            this.map.put(this.key1, this.value1);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var collection = this.map.get(this.key1);
            test.assertTrue(Class.doesExtend(collection, Collection),
                'Assert a Collection was returned by get()');
            test.assertTrue(collection.contains(this.value1),
                'Assert collection at key1 contains value1.');
        }
    };

    /**
     *
     */
    var multiMapPutSameKeyDifferentValueTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.map = new MultiMap();
            this.key1 = 'key1';
            this.value1 = 'value1';
            this.value2 = 'value2';
            this.map.put(this.key1, this.value1);
            this.map.put(this.key1, this.value2);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.map.containsValue(this.value1), true,
                'Assert containsValue returns true for value1');
            test.assertEqual(this.map.containsValue(this.value2), true,
                'Assert containsValue returns true for value2');
            var collection = this.map.get(this.key1);
            test.assertTrue(Class.doesExtend(collection, Collection),
                'Assert Collection is returned from get()');
            test.assertEqual(collection.getCount(), 2,
                'Assert Collection contains 2 values');
            test.assertTrue(collection.contains(this.value1),
                'Assert Collection contains value1');
            test.assertTrue(collection.contains(this.value2),
                'Assert Collection contains value2');
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(multiMapSimplePutContainsValueTest).with(
        test().name('MultiMap - simple put/containsValue test')
    );
    bugmeta.tag(multiMapSimplePutGetTest).with(
        test().name('MultiMap - simple put/get test')
    );
    bugmeta.tag(multiMapPutSameKeyDifferentValueTest).with(
        test().name('MultiMap - put same key with different values test')
    );
});
