/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('CollectionIterator')
//@Require('Obj')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var CollectionIterator  = bugpack.require('CollectionIterator');
    var Obj                 = bugpack.require('Obj');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var TestTag             = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var test                = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests...
     * 1) That hasNext returns false on a CollectionIterator for an empty Collection
     */
    var collectionIteratorHasNextEmptyTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            var dummyCollection = {
                valueArray: [],
                getValueArray: function() {
                    return dummyCollection.valueArray;
                },
                getCount: function() {
                    return dummyCollection.valueArray.length;
                }
            };
            this.collectionIterator = new CollectionIterator(dummyCollection);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertFalse(this.collectionIterator.hasNext(),
                "Assert hasNext is false on an empty ")
        }
    };
    bugmeta.tag(collectionIteratorHasNextEmptyTest).with(
        test().name("CollectionIterator - hasNext on empty collection test")
    );


    /**
     * This tests...
     * 1) That hasNext returns false on a CollectionIterator for an empty Collection
     */
    var collectionIteratorIterationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            var dummyCollection = {
                valueArray: [
                    'value1',
                    'value2',
                    'value3'
                ],
                getValueArray: function() {
                    return dummyCollection.valueArray;
                },
                getCount: function() {
                    return dummyCollection.valueArray.length;
                }
            };
            this.collectionIterator = new CollectionIterator(dummyCollection);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertFalse(this.collectionIterator.hasNext(),
                "Assert hasNext() is true before the first iteration");
            test.assertEqual(this.collectionIterator.next(), "value1",
                "Assert next() returns 'value1' for the first iteration");
            test.assertFalse(this.collectionIterator.hasNext(),
                "Assert hasNext() is true AFTER the first iteration");
            test.assertEqual(this.collectionIterator.next(), "value2",
                "Assert next() returns 'value2' for the second iteration");
            test.assertFalse(this.collectionIterator.hasNext(),
                "Assert hasNext() is true AFTER the second iteration");
            test.assertEqual(this.collectionIterator.next(), "value3",
                "Assert next() returns 'value3' for the third iteration");
            test.assertFalse(this.collectionIterator.hasNext(),
                "Assert hasNext() is false AFTER the third iteration");
        }
    };
    bugmeta.tag(collectionIteratorHasNextEmptyTest).with(
        test().name("CollectionIterator - iteration test")
    );
});