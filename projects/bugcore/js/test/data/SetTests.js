//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Obj')
//@Require('Set')
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
var Set             = bugpack.require('Set');
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
 * This tests
 * 1) Instantiate a simple Set
 */
var setInstantiationTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testSet = new Set();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(this.testSet.isEmpty(),
            "Assert that the Set is empty");
        test.assertTrue(Class.doesExtend(this.testSet, Set),
            "Assert that the testSet extends Set");
    }
};
bugmeta.annotate(setInstantiationTest).with(
    test().name("Set instantiation test")
);

/**
 * This tests
 * 1) creates a shallow clone of the Set
 */
var setShallowCloneTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testSet = new Set();
        this.testObject = {};
        this.testSet.add(this.testObject);
        this.testSetClone = this.testSet.clone();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(this.testSet.contains(this.testObject),
            "Assert that the Set contains the testObject");
        test.assertTrue(this.testSetClone.contains(this.testObject),
            "Assert that the cloned Set contains the testObject");
    }
};
bugmeta.annotate(setShallowCloneTest).with(
    test().name("Set shallow clone test")
);

/**
 * This tests
 * 1) creates a deep clone of the Set
 */
var setDeepCloneTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testSet = new Set();
        this.testObject = {
            key: "value"
        };
        this.testSet.add(this.testObject);
        this.testSetClone = this.testSet.clone(true);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var testObjectClone = this.testSetClone.toArray()[0];
        test.assertTrue(this.testSet.contains(this.testObject),
            "Assert that the Set contains the testObject");
        test.assertFalse(this.testSet.contains(testObjectClone),
            "Assert that the Set does not contain the cloned object");
        test.assertTrue(this.testSetClone.contains(testObjectClone),
            "Assert that the cloned Set contains the testObjectClone");
        test.assertFalse(this.testSetClone.contains(this.testObject),
            "Assert that the cloned Set contains the testObjectClone");
        test.assertEqual(testObjectClone.key, "value",
            "Assert that the cloned object has key:'value'");
    }
};
bugmeta.annotate(setDeepCloneTest).with(
    test().name("Set deep clone test")
);

/**
 * This tests
 * 1) Adding as simple string to a set
 * 2) Adding a second simple string to a set
 */
var setAddTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testValue1     = "value1";
        this.testValue2     = "value2";
        this.set            = new Set();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var result1 = this.set.add(this.testValue1);
        test.assertTrue(this.set.contains(this.testValue1),
            "Assert first item added to the set is contained within the set.");
        test.assertEqual(this.set.getCount(), 1,
            "Assert count is 1 after adding 1 item.");
        test.assertTrue(result1,
            "Assert that true was returned when adding value1");

        var result2 = this.set.add(this.testValue2);
        test.assertTrue(this.set.contains(this.testValue1),
            "Assert first item added to the list is still contained within the set after adding a second item.");
        test.assertTrue(this.set.contains(this.testValue2),
            "Assert second item added to the set is contained within the set.");
        test.assertEqual(this.set.getCount(), 2,
            "Assert count is 2 after adding 2 items.");
        test.assertTrue(result2,
            "Assert that true was returned when adding value2");
    }
};
bugmeta.annotate(setAddTest).with(
    test().name("Set add test")
);


/**
 *
 */
var setAddRepeatTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.set = new Set();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var result1 = this.set.add("value1");
        test.assertTrue(this.set.contains('value1'),
            "Assert first item added to the set is contained within the set.");
        test.assertEqual(this.set.getCount(), 1,
            "Assert count is 1 after adding 1 item.");
        test.assertTrue(result1,
            "Assert that true was returned when adding value1");

        var result2 = this.set.add("value1");
        test.assertEqual(this.set.getCount(), 1,
            "Assert count is still 1 after adding the same item a second time.");
        test.assertTrue(this.set.contains("value1"),
            "Assert set still contains the item after adding it twice.");
        test.assertFalse(result2,
            "Assert that false was returned when adding value1 again");
    }
};
bugmeta.annotate(setAddRepeatTest).with(
    test().name("Set add repeat test")
);


/**
 * This tests...
 * 1) That two different class instances that are equal will be treated as the same value by Set
 * and thus only one of them will be stored.
 * 2) That adding one of the two instances to the Set will cause the Set's contains function to return true for
 * both instances
 */
var setAddEqualObjectsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _context = this;
        this.set = new Set();
        this.NewClass = Class.extend(Obj, {
            equals: function(value) {
                if (Class.doesExtend(value, _context.NewClass)) {
                    return true;
                }
            },
            hashCode: function() {
                return 12345;
            }
        });
        this.instance1 = new this.NewClass();
        this.instance2 = new this.NewClass();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.set.add(this.instance1);
        test.assertTrue(this.set.contains(this.instance1),
            "Assert instance 1 is contained within the set after adding it to the set.");
        test.assertEqual(this.set.getCount(), 1, "Assert count is 1 after adding instance 1.");
        test.assertTrue(this.set.contains(this.instance2),
            "Assert contains returns true for instance 2 even though instance 2 hasn't been added but is equal to instance1.");

        this.set.add(this.instance2);
        test.assertEqual(this.set.getCount(), 1, 'Assert count is still 1 after adding instance 2.');
    }
};
bugmeta.annotate(setAddEqualObjectsTest).with(
    test().name("Set add equal objects test")
);


/**
 *
 */
var setContainsNonEqualObjectsWithSameHashCodesTest = {

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
        this.set = new Set();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.set.add(this.instance1);
        test.assertEqual(this.set.contains(this.instance1), true,
            "Assert sanity check that set contains instance1");
        test.assertEqual(this.set.contains(this.instance2), false,
            "Assert set does not contain instance2 since instance1 and instance2 are not equal");

        this.set.add(this.instance2);
        test.assertEqual(this.set.getCount(), 2,
            "Set count is 2 after adding instance2");
        test.assertEqual(this.set.contains(this.instance1), true,
            "Assert set contains instance1");
        test.assertEqual(this.set.contains(this.instance2), true,
            "Assert set contains instance2");
    }
};
bugmeta.annotate(setContainsNonEqualObjectsWithSameHashCodesTest).with(
    test().name("Set contains non equal objects that have the same hashCodes test")
);
