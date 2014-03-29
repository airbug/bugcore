//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Collection')
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
var Collection          = bugpack.require('Collection');
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

var collectionConstructorTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.array = ["how's", "it", "going?"];
    },
    

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.collectionZero     = new Collection();
        this.collectionOne      = new Collection(["hello", "Brian"]);
        this.collectionTwo      = new Collection(this.array);
        this.collectionThree    = new Collection(this.collectionOne);

        test.assertEqual(this.collectionZero.getCount(), 0,
            "Assert collection does not add arguments when none are given at construction time");

        test.assertEqual(this.collectionTwo.containsAll(this.array), true,
            "Assert collection accepts an Array as an argument at construction time and adds the array values to the collection");

        test.assertEqual(this.collectionOne.contains("hello"), true,
            "Assert collection added value from array in to collection");
        test.assertEqual(this.collectionOne.contains("Brian"), true,
            "Assert collection added value from array in to collection");

        test.assertEqual(this.collectionThree.containsAll(this.collectionOne), true,
            "Assert collection accepts a Collection as an argument at construction time and adds the collction values to the new collection");
    }
};
bugmeta.annotate(collectionConstructorTest).with(
    test().name("Collection constructor test")
);

/**
 *
 */
var collectionAddTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.collection = new Collection();
    },
    

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var result1 = this.collection.add('value1');
        test.assertEqual(this.collection.getCount(), 1, "Assert count value is incremented after adding an item to the " +
            "collection");
        test.assertEqual(this.collection.contains('value1'), true, "Assert contains function indicates that the collection " +
            "contains the added value.");
        test.assertTrue(result1,
            "Assert Collection#add returned true");
    
        var result2 = this.collection.add('value2');
        test.assertEqual(this.collection.getCount(), 2, "Assert count value is incremented after adding second item to the " +
            "collection");
        test.assertEqual(this.collection.contains('value1'), true, "Assert contains function indicates that the collection " +
            "contains the first added value.");
        test.assertEqual(this.collection.contains('value2'), true, "Assert contains function indicates that the collection " +
            "contains the second added value.");
        test.assertTrue(result2,
            "Assert Collection#add returned true");


        var result3 = this.collection.add('value3');
        test.assertEqual(this.collection.getCount(), 3, "Assert count value is incremented after adding third item to the " +
            "collection");
        test.assertEqual(this.collection.contains('value1'), true, "Assert contains function indicates that the collection " +
            "contains the first added value.");
        test.assertEqual(this.collection.contains('value2'), true, "Assert contains function indicates that the collection " +
            "contains the second added value.");
        test.assertEqual(this.collection.contains('value3'), true, "Assert contains function indicates that the collection " +
            "contains the third added value.");
        test.assertTrue(result3,
            "Assert Collection#add returned true");
    }
};
bugmeta.annotate(collectionAddTest).with(
    test().name("Collection add test")
);

/**
 *
 */
var collectionAddAllTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.collectionOne = new Collection(["Luke", "Leia", "Han"]);
        this.collectionTwo = new Collection(["Chewbacca", "R2D2", "C-3PO"]);
    },
    

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.collectionOne.addAll(this.collectionTwo);
        test.assertEqual(this.collectionOne.getCount(), 6,
            "Assert count value is incremented correctly after merging another item to the ");
        test.assertEqual(this.collectionOne.contains('Chewbacca'), true,
            "Assert contains function indicates that the collection contains the added value.");
        test.assertEqual(this.collectionOne.contains('R2D2'), true,
            "Assert contains function indicates that the collection contains the added value.");
        test.assertEqual(this.collectionOne.contains('C-3PO'), true,
            "Assert contains function indicates that the collection contains the added value.");
    }
};
bugmeta.annotate(collectionAddAllTest).with(
    test().name("Collection - #addAll test")
);

/**
 *
 */
var collectionGetValueArrayTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.collection = new Collection();
    },
    

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.collection.add('value1');
        this.collection.add('value2');
        this.collection.add('value3');
    
        var valuesArray = this.collection.getValueArray();
    
        test.assertEqual(valuesArray[0], 'value1', "Assert array[0] from getValueArray call is value1");
        test.assertEqual(valuesArray[1], 'value2', "Assert value[1] from getValueArray call is value2");
        test.assertEqual(valuesArray[2], 'value3', "Assert value[2] from getValueArray call is value3");
    }
};
bugmeta.annotate(collectionGetValueArrayTest).with(
    test().name("Collection getValueArray test")
);


/**
 *
 */
var collectionAddEqualObjectsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _context    = this;
        this.NewClass   = Class.extend(Obj, {
            equals: function(value) {
                if (Class.doesExtend(value, _context.NewClass)) {
    
                    //NOTE BRN: This should always return true for instances of this class
    
                    return (this.getValue() === value.getValue());
                }
                return false;
            },
            getValue: function() {
                return 123;
            },
    
            // NOTE BRN: The rules of equality require that equal objects return equal hash codes
    
            hashCode: function() {
                return 123;
            }
        });
        this.instance1  = new this.NewClass();
        this.instance2  = new this.NewClass();
        this.collection = new Collection();
    },
    

    // Run Test
    //-------------------------------------------------------------------------------
    
    test: function(test) {
        this.collection.add(this.instance1);
        test.assertEqual(this.collection.contains(this.instance1), true,
            "Assert that collection contains instance1");
        test.assertEqual(this.collection.contains(this.instance2), true,
            "Assert collection contains instance2 since instance1 and instance2 are equal");
        test.assertEqual(this.collection.getCount(), 1,
            "Assert collection count is 1 after adding instance1");
    
        this.collection.add(this.instance2);
        test.assertEqual(this.collection.contains(this.instance1), true,
            "Assert that collection contains instance1 after adding instance2");
        test.assertEqual(this.collection.contains(this.instance2), true,
            "Assert that collection contains instance2 after adding instance2");
        test.assertEqual(this.collection.getCount(), 2,
            "Assert collection count is 2 after adding instance2");
    }
};
bugmeta.annotate(collectionAddEqualObjectsTest).with(
    test().name("Collection add equal objects test")
);


/**
 *
 */
var collectionAddNonEqualObjectsWithSameHashCodesTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _context    = this;
        this.valueCount = 123;
        this.NewClass   = Class.extend(Obj, {
            _constructor: function() {
                this.valueCount = _context.valueCount++;
            },
            equals: function(value) {
                if (Class.doesExtend(value, _context.NewClass)) {
    
                    //NOTE BRN: This should always return false for instances of this class
    
                    return (this.getValue() === value.getValue());
                }
            },
            getValue: function() {
                return this.valueCount;
            },
            hashCode: function() {
                return 123;
            }
        });
        this.instance1  = new this.NewClass();
        this.instance2  = new this.NewClass();
        this.collection = new Collection();
    },
    

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.collection.add(this.instance1);
        test.assertEqual(this.collection.contains(this.instance1), true,
            "Assert sanity check that collection contains instance1");
        test.assertEqual(this.collection.contains(this.instance2), false,
            "Assert collection does not contain instance2 since instance1 and instance2 are not equal");
    }
};
bugmeta.annotate(collectionAddNonEqualObjectsWithSameHashCodesTest).with(
    test().name("Collection add non equal objects that have the same hashCodes test")
);

/**
 *
 */
var collectionAddAndRemoveDifferentValuesTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.collection = new Collection();
    },
    

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.collection.add("value1");
        this.collection.add("value2");
        this.collection.add("value3");
        test.assertEqual(this.collection.contains("value1"), true,
            "Assert collection contains value1");
        test.assertEqual(this.collection.contains("value2"), true,
            "Assert collection contains value2");
        test.assertEqual(this.collection.contains("value3"), true,
            "Assert collection contains value3");
        test.assertEqual(this.collection.getCount(), 3,
            "Assert collection count is 3 after adding 3 values");
    
        var removeValue2Result1 = this.collection.remove("value2");
        test.assertEqual(this.collection.contains("value2"), false,
            "Assert collection no longer contains value2 after removing value2");
        test.assertEqual(this.collection.getCount(), 2,
            "Assert collection count is 2 after removing value2");
        test.assertEqual(removeValue2Result1, true,
            "Assert return value from remove() call was true");
    
        var removeValue2Result2 = this.collection.remove("value2");
        test.assertEqual(this.collection.getCount(), 2,
            "Assert collection count is still 2 after removing value2 twice");
        test.assertEqual(removeValue2Result2, false,
            "Assert return value from second remove() call was false");
    
    
        var removeValue1Result1 = this.collection.remove("value1");
        test.assertEqual(this.collection.contains("value1"), false,
            "Assert collection no longer contains value1 after removing value1");
        test.assertEqual(this.collection.getCount(), 1,
            "Assert collection count is 1 after removing value1");
        test.assertEqual(removeValue1Result1, true,
            "Assert return value from remove() call was true");
    
        var removeValue1Result2 = this.collection.remove("value1");
        test.assertEqual(this.collection.getCount(), 1,
            "Assert collection count is still 1 after removing value1 twice");
        test.assertEqual(removeValue1Result2, false,
            "Assert return value from second remove() call was false");
    
        var removeValue3Result1 = this.collection.remove("value3");
        test.assertEqual(this.collection.contains("value3"), false,
            "Assert collection no longer contains value3 after removing value3");
        test.assertEqual(this.collection.getCount(), 0,
            "Assert collection count is 0 after removing value3");
        test.assertEqual(removeValue3Result1, true,
            "Assert return value from remove() call was true");
    
        var removeValue3Result2 = this.collection.remove("value1");
        test.assertEqual(this.collection.getCount(), 0,
            "Assert collection count is still 0 after removing value1 twice");
        test.assertEqual(removeValue3Result2, false,
            "Assert return value from second remove() call was false");
    }
};
bugmeta.annotate(collectionAddAndRemoveDifferentValuesTest).with(
    test().name("Collection add and remove different values test")
);


/**
 *
 */
var collectionAddAndRemoveSameValuesTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.collection = new Collection();
    },


    // Run Test
    //-------------------------------------------------------------------------------
    
    test: function(test) {
        this.collection.add("value1");
        this.collection.add("value1");
        this.collection.add("value1");
        test.assertEqual(this.collection.contains("value1"), true,
            "Assert collection contains value1");
        test.assertEqual(this.collection.getCount(), 3,
            "Assert collection count is 3 after adding three value1s");
    
        var removeResult1 = this.collection.remove("value1");
        test.assertEqual(this.collection.contains("value1"), true,
            "Assert collection still contains value1 after removing one of the value1s");
        test.assertEqual(this.collection.getCount(), 2,
            "Assert collection count is 2 after removing one value1");
        test.assertEqual(removeResult1, true,
            "Assert return value from remove() call was true");
    
        var removeResult2 = this.collection.remove("value1");
        test.assertEqual(this.collection.contains("value1"), true,
            "Assert collection still contains value1 after removing two of the value1s");
        test.assertEqual(this.collection.getCount(), 1,
            "Assert collection count is 1 after removing two value1s");
        test.assertEqual(removeResult2, true,
            "Assert return value from remove() call was true");
    
        var removeResult3 = this.collection.remove("value1");
        test.assertEqual(this.collection.contains("value1"), false,
            "Assert collection no longer contains value1 after removing all of the value1s");
        test.assertEqual(this.collection.getCount(), 0,
            "Assert collection count is 0 after removing all of the value1");
        test.assertEqual(removeResult3, true,
            "Assert return value from remove() call was true");
    
        var removeResult4 = this.collection.remove("value1");
        test.assertEqual(this.collection.getCount(), 0,
            "Assert collection count is still 0 after calling remove(value1) after all value1s have been removed");
        test.assertEqual(removeResult4, false,
            "Assert return value from second remove() call was false");
    }
};
bugmeta.annotate(collectionAddAndRemoveSameValuesTest).with(
    test().name("Collection add and remove same values test")
);


/**
 *
 */
var collectionContainsAllTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.collection1 = new Collection();
        this.collection2 = new Collection();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.collection1.containsAll(this.collection2), true,
            "Assert an empty collection contains all elements of another an empty collection");

        this.collection1.add("value1");
        this.collection1.add("value1");
        this.collection1.add("value2");
        this.collection1.add(3);

        test.assertEqual(this.collection1.containsAll(this.collection2), true,
            "Assert a collection with elements in it contains all elements of an empty collection");
        test.assertEqual(this.collection2.containsAll(this.collection1), false,
            "Assert an empty collection does not contain all the elements of a collection with elements in it");

        this.collection2.add("value1");
        this.collection2.add("value2");
        this.collection2.add(3);

        test.assertEqual(this.collection1.containsAll(this.collection2), true,
            "Assert a collection with duplicate values contains all the elements in another collection with one of each of the same values");
        test.assertEqual(this.collection2.containsAll(this.collection1), true,
            "Assert a collection with one of each value contains all the elements in another collection with the same values but contains some duplicates");

        this.collection1.add("anotherValue");

        test.assertEqual(this.collection1.containsAll(this.collection2), true,
            "Assert a collection with all of the values of another collection plus a few additional values is considered to contain all the values of the second collection");
        test.assertEqual(this.collection2.containsAll(this.collection1), false,
            "Assert a collection that only contains some of the values of another collection is not considered to contain all the values of the other collection");
    }
};
bugmeta.annotate(collectionContainsAllTest).with(
    test().name("Collection contains all test")
);


/**
 *
 */
var collectionContainsEqualTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.collection1 = new Collection();
        this.collection2 = new Collection();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.collection1.containsEqual(this.collection2), true,
            "Assert an empty collection contains equal elements of another an empty collection");

        this.collection1.add("value1");
        this.collection1.add("value1");
        this.collection1.add("value2");
        this.collection1.add(3);

        test.assertEqual(this.collection1.containsEqual(this.collection2), false,
            "Assert a collection with elements is not containsEqual to an empty collection");
        test.assertEqual(this.collection2.containsEqual(this.collection1), false,
            "Assert an empty collection is not containsEqual to a collection with elements in it");

        this.collection2.add("value1");
        this.collection2.add("value2");
        this.collection2.add(3);

        test.assertEqual(this.collection1.containsEqual(this.collection2), false,
            "Assert a collection with duplicate values is not containsEqual with one of each of the same values");
        test.assertEqual(this.collection2.containsEqual(this.collection1), false,
            "Assert a collection with one of each value is not containsEqual to another collection with the same values but contains some duplicates");

        this.collection2.add("value1");

        test.assertEqual(this.collection1.containsEqual(this.collection2), true,
            "Assert a collection with all of the values of another collection is containsEqual with that collection");
        test.assertEqual(this.collection2.containsEqual(this.collection1), true,
            "Inverse assertion: Assert a collection with all of the values of another collection is containsEqual with that collection");
    }
};
bugmeta.annotate(collectionContainsEqualTest).with(
    test().name("Collection contains equal test")
);
