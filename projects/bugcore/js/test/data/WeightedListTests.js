//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Obj')
//@Require('WeightedList')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var WeightedList    = bugpack.require('WeightedList');
var BugMeta         = bugpack.require('bugmeta.BugMeta');
var TestAnnotation  = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta         = BugMeta.context();
var test            = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/**
 *
 */
var weightedListAddTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.weightedList = new WeightedList();
        this.value1 = "value1";
        this.value2 = "value2";
        this.value3 = "value3";
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.weightedList.add(this.value1);
        test.assertEqual(this.weightedList.getAt(0), this.value1, "Assert first item added to the weightedList is at index 0.");

        this.weightedList.add(this.value2);
        test.assertEqual(this.weightedList.getAt(0), this.value1,
            "Assert first item added to the weightedList is still at index 0 after adding a second item.");
        test.assertEqual(this.weightedList.getAt(1), this.value2,
            "Assert second item added to the weightedList is at index 1.");


        this.weightedList.add(this.value3);
        test.assertEqual(this.weightedList.getAt(0), this.value1,
            "Assert first item added to the weightedList is still at index 0 after adding a third item.");
        test.assertEqual(this.weightedList.getAt(1), this.value2,
            "Assert second item added to the weightedList is still at index 1 after adding a third item.");
        test.assertEqual(this.weightedList.getAt(2), this.value3,
            "Assert third item added to the weightedList is at index 2.");
    }
};
bugmeta.annotate(weightedListAddTest).with(
    test().name("WeightedList add test")
);

/**
 *
 */
var weightedListClearTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.weightedList = new WeightedList();
        this.value1 = "value1";
        this.value2 = "value2";
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {

        //NOTE BRN: This tests a particular case where the valueArray of WeightedList was not being cleared but the hashStore was

        this.weightedList.add(this.value1);
        this.weightedList.add(this.value2);
        this.weightedList.clear();
        test.assertEqual(this.weightedList.getCount(), 0, "Assert count is 0 after clear");

        this.weightedList.add(this.value2);
        test.assertEqual(this.weightedList.getAt(0), this.value2,
            "Assert first item in the weightedList is now value2.");
    }
};
bugmeta.annotate(weightedListClearTest).with(
    test().name("WeightedList clear test")
);

/**
 *
 */
var weightedListContainsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.weightedList = new WeightedList();
        this.value1 = "value1";
        this.weightedList.add(this.value1);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.weightedList.getAt(0), this.value1,
            "Assert first item added to the weightedList is at index 0.");
        test.assertEqual(this.weightedList.contains(this.value1), true,
            "Assert weightedList contains function reports added value is contained.");
    }
};
bugmeta.annotate(weightedListContainsTest).with(
    test().name("WeightedList contains test")
);


/**
 *
 */
var weightedListIndexOfFirstTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.weightedList = new WeightedList();
        this.value1 = "value1";
        this.value2 = "value2";
        this.value3 = "value3";
        this.value4 = "value4";
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.weightedList.add(this.value1);
        this.weightedList.add(this.value2);
        this.weightedList.add(this.value3);

        test.assertEqual(this.weightedList.indexOfFirst(this.value1), 0,
            "Assert indexOfFirst item 1 is 0");
        test.assertEqual(this.weightedList.indexOfFirst(this.value2), 1,
            "Assert indexOfFirst item 2 is 1");
        test.assertEqual(this.weightedList.indexOfFirst(this.value3), 2,
            "Assert indexOfFirst item 3 is 2");

        test.assertEqual(this.weightedList.indexOfFirst(this.value4), -1,
            "Assert index of item that hasn't been added to the weightedList is -1");

        // Add the same values again. Assert that the indexOfFirst values are still the same.
        this.weightedList.add(this.value1);
        this.weightedList.add(this.value2);
        this.weightedList.add(this.value3);

        test.assertEqual(this.weightedList.indexOfFirst(this.value1), 0,
            "Assert indexOfFirst item 1 is 0 after adding a duplicate of item 1");
        test.assertEqual(this.weightedList.indexOfFirst(this.value2), 1,
            "Assert indexOfFirst item 2 is 1 after adding a duplicate of item 2");
        test.assertEqual(this.weightedList.indexOfFirst(this.value3), 2,
            "Assert indexOfFirst item 3 is 2 after adding a duplicate of item 3");
    }
};
bugmeta.annotate(weightedListIndexOfFirstTest).with(
    test().name("WeightedList indexOfFirst test")
);


/**
 *
 */
var weightedListIndexOfLastTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.weightedList = new WeightedList();
        this.value1 = "value1";
        this.value2 = "value2";
        this.value3 = "value3";
        this.value4 = "value4";
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.weightedList.add(this.value1);
        this.weightedList.add(this.value2);
        this.weightedList.add(this.value3);

        test.assertEqual(this.weightedList.indexOfLast(this.value1), 0,
            "Assert indexOfLast item 1 is 0");
        test.assertEqual(this.weightedList.indexOfLast(this.value2), 1,
            "Assert indexOfLast item 2 is 1");
        test.assertEqual(this.weightedList.indexOfLast(this.value3), 2,
            "Assert indexOfLast item 3 is 2");

        test.assertEqual(this.weightedList.indexOfLast(this.value4), -1,
            "Assert index of item that hasn't been added to the weightedList is -1");

        // Add the same values again. Assert that the indexOfLast values have been changed.
        this.weightedList.add('value1');
        this.weightedList.add('value2');
        this.weightedList.add('value3');

        test.assertEqual(this.weightedList.indexOfLast(this.value1), 3,
            "Assert indexOfLast item 1 is 3 after adding a duplicate of item 1");
        test.assertEqual(this.weightedList.indexOfLast(this.value2), 4,
            "Assert indexOfLast item 2 is 4 after adding a duplicate of item 2");
        test.assertEqual(this.weightedList.indexOfLast(this.value3), 5,
            "Assert indexOfLast item 3 is 5 after adding a duplicate of item 3");
    }
};
bugmeta.annotate(weightedListIndexOfLastTest).with(
    test().name("WeightedList indexOfLast test")
);


/**
 *
 */
var weightedListRemoveTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.weightedList = new WeightedList();
        this.value1 = "value1";
        this.value2 = "value2";
        this.value3 = "value3";
        this.value4 = "value4";
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.weightedList.add(this.value1);
        test.assertEqual(this.weightedList.getAt(0), this.value1,
            "Assert item 1 added to the weightedList is at index 0.");

        this.weightedList.add(this.value2);
        test.assertEqual(this.weightedList.getAt(1), this.value2,
            "Assert item 2 added to the weightedList is at index 1");

        this.weightedList.add(this.value3);
        test.assertEqual(this.weightedList.getAt(2), this.value3, "Assert item 3 added to the weightedList is at index 2");


        this.weightedList.remove(this.value4);
        test.assertEqual(this.weightedList.getCount(), 3,
            "WeightedList count has not changed when it tried to remove an item that didn't exist in the weightedList.");
        test.assertEqual(this.weightedList.getAt(0), this.value1,
            "WeightedList still contains item after trying to remove an item that didn't exist.");
        test.assertEqual(this.weightedList.getAt(1), this.value2,
            "WeightedList still contains item after trying to remove an item that didn't exist.");
        test.assertEqual(this.weightedList.getAt(2), this.value3,
            "WeightedList still contains item after trying to remove an item that didn't exist.");

        this.weightedList.remove(this.value2);
        test.assertEqual(this.weightedList.getCount(), 2,
            "WeightedList count reports 2 after removing item 2 from weightedList.");
        test.assertEqual(this.weightedList.getAt(0), this.value1,
            "Assert item 1is at index 0 after removing item 2");
        test.assertEqual(this.weightedList.getAt(1), this.value3,
            "Assert item 3 is at index 1 after removing item 2");

        this.weightedList.remove(this.value1);
        test.assertEqual(this.weightedList.getCount(), 1,
            "WeightedList count reports 1 after removing item 1 from weightedList.");
        test.assertEqual(this.weightedList.getAt(0), this.value3,
            "Assert item 3 added to the weightedList is at index 0 after removing item 1");

        this.weightedList.remove(this.value3);
        test.assertEqual(this.weightedList.getCount(), 0,
            "WeightedList count reports 0 after removing item 3 from weightedList.");
    }
};
bugmeta.annotate(weightedListRemoveTest).with(
    test().name("WeightedList remove test")
);


//TODO BRN: Add a removal test that ensures that the FIRST match is removed from the weightedList when removing equal items
/**
 *
 */
var weightedListRemoveAtTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.weightedList = new WeightedList();
        this.value1 = "value1";
        this.value2 = "value2";
        this.value3 = "value3";
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.weightedList.add(this.value1);
        test.assertEqual(this.weightedList.getAt(0), this.value1,
            "Assert item 1 added to the weightedList is at index 0.");

        this.weightedList.add(this.value2);
        test.assertEqual(this.weightedList.getAt(1), this.value2,
            "Assert item 2 added to the weightedList is at index 1");

        this.weightedList.add(this.value3);
        test.assertEqual(this.weightedList.getAt(2), this.value3,
            "Assert item 3 added to the weightedList is at index 2");


        this.weightedList.removeAt(1);
        test.assertEqual(this.weightedList.getAt(0), this.value1,
            "Assert item 1 is at index 0 after removeAt(1)");
        test.assertEqual(this.weightedList.getAt(1), this.value3,
            "Assert item 3 is at index 1 after removeAt(1)");
        test.assertEqual(this.weightedList.getCount(), 2,
            "Assert count is 2");
    }
};
bugmeta.annotate(weightedListRemoveAtTest).with(
    test().name("WeightedList removeAt test")
);


/**
 *
 */
var weightedListAddEqualObjectsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _context = this;
        this.hashCodeCount = 123;
        this.NewClass = Class.extend(Obj, {
            equals: function(value) {
                if (Class.doesExtend(value, _context.NewClass)) {

                    //NOTE BRN: This should always return true for instances of this class

                    return this.getValue() === value.getValue();
                }
            },
            getValue: function() {
                return 123;
            },

            // NOTE BRN: The rules of equality require that equal objects return equal hashcodes

            hashCode: function() {
                return 123;
            }
        });
        this.instance1 = new this.NewClass();
        this.instance2  = new this.NewClass();
        this.weightedList = new WeightedList();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.weightedList.add(this.instance1);
        test.assertEqual(this.weightedList.contains(this.instance1), true,
            "Assert sanity check that weightedList contains instance1");
        test.assertEqual(this.weightedList.contains(this.instance2), true,
            "Assert weightedList contains instance2 since instance1 and instance2 are equal");
        test.assertEqual(this.weightedList.getCount(), 1,
            "Assert weightedList count is 1 after adding instance1");

        this.weightedList.add(this.instance2);
        test.assertEqual(this.weightedList.contains(this.instance1), true,
            "Assert that weightedList contains instance1 after adding instance2");
        test.assertEqual(this.weightedList.contains(this.instance2), true,
            "Assert that weightedList contains instance2 after adding instance2");
        test.assertEqual(this.weightedList.getCount(), 2,
            "Assert weightedList count is 2 after adding instance2");
    }
};
bugmeta.annotate(weightedListAddEqualObjectsTest).with(
    test().name("WeightedList add equal objects test")
);


/**
 *
 */
var weightedListAddNonEqualObjectsWithSameHashCodesTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _context = this;
        this.valueCount = 123;
        this.NewClass = Class.extend(Obj, {
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
        this.instance1 = new this.NewClass();
        this.instance2  = new this.NewClass();
        this.weightedList = new WeightedList();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.weightedList.add(this.instance1);
        test.assertEqual(this.weightedList.contains(this.instance1), true,
            "Assert sanity check that weightedList contains instance1");
        test.assertEqual(this.weightedList.contains(this.instance2), false,
            "Assert weightedList does not contain instance2 since instance1 and instance2 are not equal");
    }
};
bugmeta.annotate(weightedListAddNonEqualObjectsWithSameHashCodesTest).with(
    test().name("WeightedList add non equal objects that have the same hashCodes test")
);


/**
 *
 */
var weightedListRemoveEqualObjectsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var someOffset = 0;
        var _context = this;
        this.hashCodeCount = 123;
        this.NewClass = Class.extend(Obj, {
            _constructor: function() {
                this._super();
                this.someOffset = someOffset++;
            },

            equals: function(value) {
                if (Class.doesExtend(value, _context.NewClass)) {

                    //NOTE BRN: This should always return true for instances of this class

                    return this.getValue() === value.getValue();
                }
            },
            getValue: function() {
                return 123;
            },

            // NOTE BRN: The rules of equality require that equal objects return equal hashcodes

            hashCode: function() {
                return 123;
            }
        });
        this.instance1 = new this.NewClass();
        this.instance2  = new this.NewClass();
        this.weightedList = new WeightedList();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertFalse(this.instance1 === this.instance2,
            "Assert instance1 does not exactly equal instance2 according to js");
        this.weightedList.add(this.instance1);
        test.assertEqual(this.weightedList.contains(this.instance1), true,
            "Assert that weightedList contains instance1 after adding instance1");
        test.assertEqual(this.weightedList.indexOfFirst(this.instance1), 0,
            "Assert that first index of instance1 is 0");
        test.assertEqual(this.weightedList.contains(this.instance2), true,
            "Assert that weightedList contains instance2 after adding instance1 (since instance 1 and instance 2 are equal)");
        test.assertEqual(this.weightedList.indexOfFirst(this.instance2), 0,
            "Assert that index of instance2 is 0");
        test.assertEqual(this.weightedList.getCount(), 1,
            "Assert weightedList count is 1 after adding instance1");

        this.weightedList.remove(this.instance2);
        test.assertEqual(this.weightedList.contains(this.instance1), false,
            "Assert that weightedList does not contain instance1 after removing instance2");
        test.assertEqual(this.weightedList.indexOfFirst(this.instance1), -1,
            "Assert that index of instance1 is -1");
        test.assertEqual(this.weightedList.contains(this.instance2), false,
            "Assert that weightedList does not contain instance2 after removing instance2");
        test.assertEqual(this.weightedList.indexOfFirst(this.instance2), -1,
            "Assert that index of instance2 is -1");
        test.assertEqual(this.weightedList.getCount(), 0,
            "Assert weightedList count is 0 after removing instance2");
    }
};
bugmeta.annotate(weightedListRemoveEqualObjectsTest).with(
    test().name("WeightedList add equal objects test")
);


/**
 *
 */
var weightedListGetAtWeightTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.weightedList = new WeightedList();
        this.value1 = "value1";
        this.weight1 = 1;
        this.value2 = "value2";
        this.weight2 = 4;
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.weightedList.add(this.value1, this.weight1);
        this.weightedList.add(this.value2, this.weight2);
        test.assertEqual(this.weightedList.getAtWeight(1), this.value1, "Assert value at weight 1 is value1.");
        test.assertEqual(this.weightedList.getAtWeight(2), this.value2, "Assert value at weight 2 is value2.");
        test.assertEqual(this.weightedList.getAtWeight(3), this.value2, "Assert value at weight 3 is value2.");
        test.assertEqual(this.weightedList.getAtWeight(4), this.value2, "Assert value at weight 4 is value2.");
        test.assertEqual(this.weightedList.getAtWeight(5), this.value2, "Assert value at weight 5 is value2.");
    }
};
bugmeta.annotate(weightedListGetAtWeightTest).with(
    test().name("WeightedList get at weight test")
);