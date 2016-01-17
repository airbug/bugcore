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
//@Require('Obj')
//@Require('Stack')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Obj         = bugpack.require('Obj');
    var Stack       = bugpack.require('Stack');
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

    var stackConstructorTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.array = ["how's", "it", "going?"];
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.stackZero     = new Stack();
            this.stackOne      = new Stack(["hello", "Brian"]);
            this.stackTwo      = new Stack(this.array);
            this.stackThree    = new Stack(this.stackOne);

            test.assertEqual(this.stackZero.getCount(), 0,
                "Assert Stack does not add arguments when none are given at construction time");

            test.assertEqual(this.stackTwo.containsAll(this.array), true,
                "Assert Stack accepts an Array as an argument at construction time and adds the array values to the Stack");
            test.assertEqual(this.stackTwo.getCount(), 3,
                "Assert stackTwo contains 3 items");

            test.assertEqual(this.stackOne.contains("hello"), true,
                "Assert Stack added value from array in to Stack");
            test.assertEqual(this.stackOne.contains("Brian"), true,
                "Assert Stack added value from array in to Stack");
            test.assertEqual(this.stackOne.getCount(), 2,
                "Assert stackOne contains 2 items");

            test.assertEqual(this.stackThree.containsAll(this.stackOne), true,
                "Assert collection accepts a Stack as an argument at construction time and adds the Stack values to the new Stack");
            test.assertEqual(this.stackThree.getCount(), 2,
                "Assert stackThree contains 2 items");
        }
    };

    /**
     * This tests
     * 1) Instantiate a simple Stack
     */
    var stackInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testStack = new Stack();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(this.testStack.isEmpty(),
                "Assert that the Stack is empty");
            test.assertTrue(Class.doesExtend(this.testStack, Stack),
                "Assert that the testStack extends Stack");
        }
    };

    /**
     * This tests
     * 1) creates a shallow clone of the Stack
     */
    var stackShallowCloneTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testStack = new Stack();
            this.testObject = {};
            this.testStack.add(this.testObject);
            this.testStackClone = this.testStack.clone();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(this.testStack.contains(this.testObject),
                "Assert that the Stack contains the testObject");
            test.assertTrue(this.testStackClone.contains(this.testObject),
                "Assert that the cloned Stack contains the testObject");
        }
    };

    /**
     * This tests
     * 1) creates a deep clone of the Stack
     */
    var stackDeepCloneTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testStack = new Stack();
            this.testObject = {
                key: "value"
            };
            this.testStack.add(this.testObject);
            this.testStackClone = this.testStack.clone(true);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var testObjectClone = this.testStackClone.toArray()[0];
            test.assertTrue(this.testStack.contains(this.testObject),
                "Assert that the Stack contains the testObject");
            test.assertFalse(this.testStack.contains(testObjectClone),
                "Assert that the Stack does not contain the cloned object");
            test.assertTrue(this.testStackClone.contains(testObjectClone),
                "Assert that the cloned Stack contains the testObjectClone");
            test.assertFalse(this.testStackClone.contains(this.testObject),
                "Assert that the cloned Stack contains the testObjectClone");
            test.assertEqual(testObjectClone.key, "value",
                "Assert that the cloned object has key:'value'");
        }
    };

    /**
     * This tests
     * 1) Adding as simple string to a set
     * 2) Adding a second simple string to a set
     */
    var stackAddTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testValue1     = "value1";
            this.testValue2     = "value2";
            this.stack          = new Stack();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var result1 = this.stack.add(this.testValue1);
            test.assertTrue(this.stack.contains(this.testValue1),
                "Assert first item added to the Stack is contained within the Stack.");
            test.assertEqual(this.stack.getCount(), 1,
                "Assert count is 1 after adding 1 item.");
            test.assertTrue(result1,
                "Assert that true was returned when adding value1");

            var result2 = this.stack.add(this.testValue2);
            test.assertTrue(this.stack.contains(this.testValue1),
                "Assert first item added to the Stack is still contained within the Stack after adding a second item.");
            test.assertTrue(this.stack.contains(this.testValue2),
                "Assert second item added to the Stack is contained within the Stack.");
            test.assertEqual(this.stack.getCount(), 2,
                "Assert count is 2 after adding 2 items.");
            test.assertTrue(result2,
                "Assert that true was returned when adding value2");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(stackConstructorTest).with(
        test().name("Stack - constructor test")
    );
    bugmeta.tag(stackInstantiationTest).with(
        test().name("Stack - instantiation test")
    );
    bugmeta.tag(stackShallowCloneTest).with(
        test().name("Stack - shallow clone test")
    );
    bugmeta.tag(stackDeepCloneTest).with(
        test().name("Stack - deep clone test")
    );
    bugmeta.tag(stackAddTest).with(
        test().name("Stack - add test")
    );
});
