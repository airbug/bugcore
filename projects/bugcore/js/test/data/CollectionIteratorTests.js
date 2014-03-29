//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('CollectionIterator')
//@Require('Obj')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var CollectionIterator  = bugpack.require('CollectionIterator');
var Obj                 = bugpack.require('Obj');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta             = BugMeta.context();
var test                = TestAnnotation.test;


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
bugmeta.annotate(collectionIteratorHasNextEmptyTest).with(
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
bugmeta.annotate(collectionIteratorHasNextEmptyTest).with(
    test().name("CollectionIterator - iteration test")
);
