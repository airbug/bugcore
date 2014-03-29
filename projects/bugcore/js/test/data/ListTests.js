//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('List')
//@Require('Obj')
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
var List            = bugpack.require('List');
var Obj             = bugpack.require('Obj');
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

var listConstructorTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.array = ["how's", "it", "going?"];
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.listZero     = new List();
        this.listOne      = new List(["hello", "Brian"]);
        this.listTwo      = new List(this.array);
        this.listThree    = new List(this.listOne);

        test.assertEqual(this.listZero.getCount(), 0,
            "Assert List does not add arguments when none are given at construction time");

        test.assertEqual(this.listTwo.containsAll(this.array), true,
            "Assert List accepts an Array as an argument at construction time and adds the array values to the List");

        test.assertEqual(this.listOne.contains("hello"), true,
            "Assert List added value from array in to List");
        test.assertEqual(this.listOne.contains("Brian"), true,
            "Assert List added value from array in to List");

        test.assertEqual(this.listThree.containsAll(this.listOne), true,
            "Assert collection accepts a List as an argument at construction time and adds the List values to the new List");
    }
};
bugmeta.annotate(listConstructorTest).with(
    test().name("List constructor test")
);

/**
 *
 */
var listAddTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.list = new List();
        this.value1 = "value1";
        this.value2 = "value2";
        this.value3 = "value3";
    },
    

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.list.add(this.value1);
        test.assertEqual(this.list.getAt(0), this.value1, "Assert first item added to the list is at index 0.");

        this.list.add(this.value2);
        test.assertEqual(this.list.getAt(0), this.value1,
            "Assert first item added to the list is still at index 0 after adding a second item.");
        test.assertEqual(this.list.getAt(1), this.value2,
            "Assert second item added to the list is at index 1.");


        this.list.add(this.value3);
        test.assertEqual(this.list.getAt(0), this.value1,
            "Assert first item added to the list is still at index 0 after adding a third item.");
        test.assertEqual(this.list.getAt(1), this.value2,
            "Assert second item added to the list is still at index 1 after adding a third item.");
        test.assertEqual(this.list.getAt(2), this.value3,
            "Assert third item added to the list is at index 2.");
    }
};
bugmeta.annotate(listAddTest).with(
    test().name("List add test")
);

/**
 *
 */
var listAddAtTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.list = new List();
        this.value1 = "value1";
        this.value2 = "value2";
        this.value3 = "value3";
        this.value4 = "value4";
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.list.addAt(0, this.value1);
        test.assertEqual(this.list.getAt(0), this.value1,
            "Assert first item added to the list is at index 0.");

        this.list.addAt(1, this.value2);
        test.assertEqual(this.list.getAt(0), this.value1,
            "Assert first item added to the list is still at index 0 after adding a second item.");
        test.assertEqual(this.list.getAt(1), this.value2,
            "Assert second item added to the list is at index 1.");


        this.list.addAt(0, this.value3);
        test.assertEqual(this.list.getAt(0), this.value3,
            "Assert item added to the list at index 0 is value3.");
        test.assertEqual(this.list.getAt(1), this.value1,
            "Assert item at index 1 is value1");
        test.assertEqual(this.list.getAt(2), this.value2,
            "Assert item at index 2 is value2");

        this.list.addAt(1, this.value4);
        test.assertEqual(this.list.getAt(0), this.value3,
            "Assert item at index 0 is value3");
        test.assertEqual(this.list.getAt(1), this.value4,
            "Assert item at index 1 is value4");
        test.assertEqual(this.list.getAt(2), this.value1,
            "Assert item at index 2 is value1");
        test.assertEqual(this.list.getAt(3), this.value2,
            "Assert item at index 3 is value2");
    }
};
bugmeta.annotate(listAddAtTest).with(
    test().name("List - #addAt test")
);

/**
 *
 */
var listClearTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.list = new List();
        this.value1 = "value1";
        this.value2 = "value2";
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {

        //NOTE BRN: This tests a particular case where the valueArray of List was not being cleared but the hashStore was

        this.list.add(this.value1);
        this.list.add(this.value2);
        this.list.clear();
        test.assertEqual(this.list.getCount(), 0, "Assert count is 0 after clear");

        this.list.add(this.value2);
        test.assertEqual(this.list.getAt(0), this.value2,
            "Assert first item in the list is now value2.");
    }
};
bugmeta.annotate(listClearTest).with(
    test().name("List clear test")
);

/**
 *
 */
var listContainsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.list = new List();
        this.value1 = "value1";
        this.list.add(this.value1);
    },
    

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.list.getAt(0), this.value1, 
            "Assert first item added to the list is at index 0.");
        test.assertEqual(this.list.contains(this.value1), true, 
            "Assert list contains function reports added value is contained.");
    }
};
bugmeta.annotate(listContainsTest).with(
    test().name("List contains test")
);


/**
 *
 */
var listIndexOfFirstTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.list = new List();
        this.value1 = "value1";
        this.value2 = "value2";
        this.value3 = "value3";
        this.value4 = "value4";
    },
    

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.list.add(this.value1);
        this.list.add(this.value2);
        this.list.add(this.value3);
    
        test.assertEqual(this.list.indexOfFirst(this.value1), 0,
            "Assert indexOfFirst item 1 is 0");
        test.assertEqual(this.list.indexOfFirst(this.value2), 1,
            "Assert indexOfFirst item 2 is 1");
        test.assertEqual(this.list.indexOfFirst(this.value3), 2,
            "Assert indexOfFirst item 3 is 2");
    
        test.assertEqual(this.list.indexOfFirst(this.value4), -1,
            "Assert index of item that hasn't been added to the list is -1");
    
        // Add the same values again. Assert that the indexOfFirst values are still the same.
        this.list.add(this.value1);
        this.list.add(this.value2);
        this.list.add(this.value3);
    
        test.assertEqual(this.list.indexOfFirst(this.value1), 0,
            "Assert indexOfFirst item 1 is 0 after adding a duplicate of item 1");
        test.assertEqual(this.list.indexOfFirst(this.value2), 1,
            "Assert indexOfFirst item 2 is 1 after adding a duplicate of item 2");
        test.assertEqual(this.list.indexOfFirst(this.value3), 2,
            "Assert indexOfFirst item 3 is 2 after adding a duplicate of item 3");
    }
};
bugmeta.annotate(listIndexOfFirstTest).with(
    test().name("List indexOfFirst test")
);


/**
 *
 */
var listIndexOfLastTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.list = new List();
        this.value1 = "value1";
        this.value2 = "value2";
        this.value3 = "value3";
        this.value4 = "value4";
    },
    

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.list.add(this.value1);
        this.list.add(this.value2);
        this.list.add(this.value3);
    
        test.assertEqual(this.list.indexOfLast(this.value1), 0,
            "Assert indexOfLast item 1 is 0");
        test.assertEqual(this.list.indexOfLast(this.value2), 1,
            "Assert indexOfLast item 2 is 1");
        test.assertEqual(this.list.indexOfLast(this.value3), 2,
            "Assert indexOfLast item 3 is 2");
    
        test.assertEqual(this.list.indexOfLast(this.value4), -1,
            "Assert index of item that hasn't been added to the list is -1");
    
        // Add the same values again. Assert that the indexOfLast values have been changed.
        this.list.add('value1');
        this.list.add('value2');
        this.list.add('value3');
    
        test.assertEqual(this.list.indexOfLast(this.value1), 3,
            "Assert indexOfLast item 1 is 3 after adding a duplicate of item 1");
        test.assertEqual(this.list.indexOfLast(this.value2), 4,
            "Assert indexOfLast item 2 is 4 after adding a duplicate of item 2");
        test.assertEqual(this.list.indexOfLast(this.value3), 5,
            "Assert indexOfLast item 3 is 5 after adding a duplicate of item 3");
    }
};
bugmeta.annotate(listIndexOfLastTest).with(
    test().name("List indexOfLast test")
);


/**
 *
 */
var listRemoveTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.list = new List();
        this.value1 = "value1";
        this.value2 = "value2";
        this.value3 = "value3";
        this.value4 = "value4";
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.list.add(this.value1);
        test.assertEqual(this.list.getAt(0), this.value1,
            "Assert item 1 added to the list is at index 0.");

        this.list.add(this.value2);
        test.assertEqual(this.list.getAt(1), this.value2,
            "Assert item 2 added to the list is at index 1");

        this.list.add(this.value3);
        test.assertEqual(this.list.getAt(2), this.value3, "Assert item 3 added to the list is at index 2");


        this.list.remove(this.value4);
        test.assertEqual(this.list.getCount(), 3,
            "List count has not changed when it tried to remove an item that didn't exist in the list.");
        test.assertEqual(this.list.getAt(0), this.value1,
            "List still contains item after trying to remove an item that didn't exist.");
        test.assertEqual(this.list.getAt(1), this.value2,
            "List still contains item after trying to remove an item that didn't exist.");
        test.assertEqual(this.list.getAt(2), this.value3,
            "List still contains item after trying to remove an item that didn't exist.");

        this.list.remove(this.value2);
        test.assertEqual(this.list.getCount(), 2,
            "List count reports 2 after removing item 2 from list.");
        test.assertEqual(this.list.getAt(0), this.value1,
            "Assert item 1is at index 0 after removing item 2");
        test.assertEqual(this.list.getAt(1), this.value3,
            "Assert item 3 is at index 1 after removing item 2");

        this.list.remove(this.value1);
        test.assertEqual(this.list.getCount(), 1,
            "List count reports 1 after removing item 1 from list.");
        test.assertEqual(this.list.getAt(0), this.value3,
            "Assert item 3 added to the list is at index 0 after removing item 1");

        this.list.remove(this.value3);
        test.assertEqual(this.list.getCount(), 0,
            "List count reports 0 after removing item 3 from list.");
    }
};
bugmeta.annotate(listRemoveTest).with(
    test().name("List remove test")
);


//TODO BRN: Add a removal test that ensures that the FIRST match is removed from the list when removing equal items
/**
 *
 */
var listRemoveAtTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.list = new List();
        this.value1 = "value1";
        this.value2 = "value2";
        this.value3 = "value3";
    },
    

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.list.add(this.value1);
        test.assertEqual(this.list.getAt(0), this.value1,
            "Assert item 1 added to the list is at index 0.");

        this.list.add(this.value2);
        test.assertEqual(this.list.getAt(1), this.value2,
            "Assert item 2 added to the list is at index 1");

        this.list.add(this.value3);
        test.assertEqual(this.list.getAt(2), this.value3,
            "Assert item 3 added to the list is at index 2");


        this.list.removeAt(1);
        test.assertEqual(this.list.getAt(0), this.value1, 
            "Assert item 1 is at index 0 after removeAt(1)");
        test.assertEqual(this.list.getAt(1), this.value3, 
            "Assert item 3 is at index 1 after removeAt(1)");
        test.assertEqual(this.list.getCount(), 2, 
            "Assert count is 2");
    }
};
bugmeta.annotate(listRemoveAtTest).with(
    test().name("List removeAt test")
);


/**
 *
 */
var listSetTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.list = new List();
        this.value1 = "value1";
        this.value2 = "value2";
        this.value3 = "value3";
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.list.add(this.value1);
        this.list.add(this.value2);
        var result = this.list.set(0, this.value3);
        test.assertEqual(result, this.value1,
            "Assert set returned value1");
        test.assertEqual(this.list.getAt(0), this.value3,
            "Assert value3 is at index 0");
        test.assertEqual(this.list.getAt(1), this.value2,
            "Assert value2 is at index 1");
    }
};
bugmeta.annotate(listSetTest).with(
    test().name("List - #set test")
);

/**
 *
 */
var listAddEqualObjectsTest = {

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
        this.list = new List();
    },
    

    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.list.add(this.instance1);
        test.assertEqual(this.list.contains(this.instance1), true,
            "Assert sanity check that list contains instance1");
        test.assertEqual(this.list.contains(this.instance2), true,
            "Assert list contains instance2 since instance1 and instance2 are equal");
        test.assertEqual(this.list.getCount(), 1,
            "Assert list count is 1 after adding instance1");

        this.list.add(this.instance2);
        test.assertEqual(this.list.contains(this.instance1), true,
            "Assert that list contains instance1 after adding instance2");
        test.assertEqual(this.list.contains(this.instance2), true,
            "Assert that list contains instance2 after adding instance2");
        test.assertEqual(this.list.getCount(), 2,
            "Assert list count is 2 after adding instance2");
    }
};
bugmeta.annotate(listAddEqualObjectsTest).with(
    test().name("List add equal objects test")
);



/**
 *
 */
var listAddNonEqualObjectsWithSameHashCodesTest = {

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
        this.list = new List();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.list.add(this.instance1);
        test.assertEqual(this.list.contains(this.instance1), true,
            "Assert sanity check that list contains instance1");
        test.assertEqual(this.list.contains(this.instance2), false,
            "Assert list does not contain instance2 since instance1 and instance2 are not equal");
    }
};
bugmeta.annotate(listAddNonEqualObjectsWithSameHashCodesTest).with(
    test().name("List add non equal objects that have the same hashCodes test")
);


/**
 *
 */
var listRemoveEqualObjectsTest = {

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
        this.list = new List();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertFalse(this.instance1 === this.instance2,
            "Assert instance1 does not exactly equal instance2 according to js");
        this.list.add(this.instance1);
        test.assertEqual(this.list.contains(this.instance1), true,
            "Assert that list contains instance1 after adding instance1");
        test.assertEqual(this.list.indexOfFirst(this.instance1), 0,
            "Assert that first index of instance1 is 0");
        test.assertEqual(this.list.contains(this.instance2), true,
            "Assert that list contains instance2 after adding instance1 (since instance 1 and instance 2 are equal)");
        test.assertEqual(this.list.indexOfFirst(this.instance2), 0,
            "Assert that index of instance2 is 0");
        test.assertEqual(this.list.getCount(), 1,
            "Assert list count is 1 after adding instance1");

        this.list.remove(this.instance2);
        test.assertEqual(this.list.contains(this.instance1), false,
            "Assert that list does not contain instance1 after removing instance2");
        test.assertEqual(this.list.indexOfFirst(this.instance1), -1,
            "Assert that index of instance1 is -1");
        test.assertEqual(this.list.contains(this.instance2), false,
            "Assert that list does not contain instance2 after removing instance2");
        test.assertEqual(this.list.indexOfFirst(this.instance2), -1,
            "Assert that index of instance2 is -1");
        test.assertEqual(this.list.getCount(), 0,
            "Assert list count is 0 after removing instance2");
    }
};
bugmeta.annotate(listRemoveEqualObjectsTest).with(
    test().name("List add equal objects test")
);
