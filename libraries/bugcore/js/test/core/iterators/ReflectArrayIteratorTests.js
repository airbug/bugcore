/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Array')
//@Require('ArrayIterator')
//@Require('Class')
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

    var Array           = bugpack.require('Array');
    var ArrayIterator   = bugpack.require('ArrayIterator');
    var Class           = bugpack.require('Class');
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
     * 1) Instantiation of a new ArrayIterator
     * 2) That the default values are set correctly
     */
    var arrayIteratorInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.array          = [];
            this.arrayIterator  = new ArrayIterator(this.array);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.arrayIterator, ArrayIterator),
                "Assert instance of ArrayIterator");
            test.assertEqual(this.arrayIterator.getArray(), this.array,
                "Assert ArrayIterator.array was set correctly during instantiation");
            test.assertEqual(this.arrayIterator.getIndex(), -1,
                "Assert ArrayIterator.index defaults to -1");
        }
    };

    /**
     * This tests
     * 1) That next properly iterates over Array
     * 2) That calling next() when hasNext is false throws an Exception
     */
    var arrayIteratorNextTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.array          = ["A", "B", "C"];
            this.arrayIterator  = new ArrayIterator(this.array);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertEqual(this.arrayIterator.hasNext(), true,
                "Assert ArrayIterator has next");
            var next0 = this.arrayIterator.next();
            test.assertEqual(next0, this.array[0],
                "Assert ArrayIterator first item is array[0]");
            test.assertEqual(this.arrayIterator.hasNext(), true,
                "Assert ArrayIterator has next");
            var next1 = this.arrayIterator.next();
            test.assertEqual(next1, this.array[1],
                "Assert ArrayIterator second item is array[1]");
            test.assertEqual(this.arrayIterator.hasNext(), true,
                "Assert ArrayIterator has next");
            var next2 = this.arrayIterator.next();
            test.assertEqual(next2, this.array[2],
                "Assert ArrayIterator third item is array[2]");
            test.assertEqual(this.arrayIterator.hasNext(), false,
                "Assert ArrayIterator no longer has next");
            test.assertThrows(function() {
                _this.arrayIterator.next();
            }, "Assert exception is thrown by calling next when hasNext is false");
        }
    };

    /**
     * This tests
     * 1) That ArrayIterator properly iterates over an Array when a value is added below the index
     */
    var arrayIteratorNextWithValueAddedBelowIndexTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.array          = ["A", "B", "C"];
            this.arrayIterator  = new ArrayIterator(this.array);
            this.valueAdded     = "ValueAdded";
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertEqual(this.arrayIterator.hasNext(), true,
                "Assert ArrayIterator has next");
            var next0 = this.arrayIterator.next();
            test.assertEqual(next0, this.array[0],
                "Assert ArrayIterator first item is array[0]");
            test.assertEqual(this.arrayIterator.hasNext(), true,
                "Assert ArrayIterator has next");
            var next1 = this.arrayIterator.next();
            test.assertEqual(next1, this.array[1],
                "Assert ArrayIterator second item is array[1]");

            this.array.splice(0, 0, this.valueAdded);

            test.assertEqual(this.arrayIterator.hasNext(), true,
                "Assert ArrayIterator has next");
            var next2 = this.arrayIterator.next();
            test.assertEqual(next2, this.array[3],
                "Assert ArrayIterator third item is array[3]");
            test.assertEqual(this.arrayIterator.hasNext(), false,
                "Assert ArrayIterator no longer has next");
            test.assertThrows(function() {
                _this.arrayIterator.next();
            }, "Assert exception is thrown by calling next when hasNext is false");
        }
    };

    /**
     * This tests
     * 1) That ArrayIterator properly iterates over an Array when a value is added at the index
     */
    var arrayIteratorNextWithValueAddedAtIndexTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.array          = ["A", "B", "C"];
            this.arrayIterator  = new ArrayIterator(this.array);
            this.valueAdded     = "ValueAdded";
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertEqual(this.arrayIterator.hasNext(), true,
                "Assert ArrayIterator has next");
            var next0 = this.arrayIterator.next();
            test.assertEqual(next0, this.array[0],
                "Assert ArrayIterator first item is array[0]");

            this.array.splice(0, 0, this.valueAdded);

            test.assertEqual(this.arrayIterator.hasNext(), true,
                "Assert ArrayIterator has next");
            var next1 = this.arrayIterator.next();
            test.assertEqual(next1, this.array[2],
                "Assert ArrayIterator second item is array[2]");
            test.assertEqual(this.arrayIterator.hasNext(), true,
                "Assert ArrayIterator has next");
            var next2 = this.arrayIterator.next();
            test.assertEqual(next2, this.array[3],
                "Assert ArrayIterator third item is array[3]");
            test.assertEqual(this.arrayIterator.hasNext(), false,
                "Assert ArrayIterator no longer has next");
            test.assertThrows(function() {
                _this.arrayIterator.next();
            }, "Assert exception is thrown by calling next when hasNext is false");
        }
    };

    /**
     * This tests
     * 1) That ArrayIterator properly iterates over an Array when a value is added at the index
     */
    var arrayIteratorNextWithValueAddedOneAboveTheIndexTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.array          = ["A", "B", "C"];
            this.arrayIterator  = new ArrayIterator(this.array);
            this.valueAdded     = "ValueAdded";
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertEqual(this.arrayIterator.hasNext(), true,
                "Assert ArrayIterator has next");
            var next0 = this.arrayIterator.next();
            test.assertEqual(next0, this.array[0],
                "Assert ArrayIterator first item is array[0]");

            this.array.splice(1, 0, this.valueAdded);

            test.assertEqual(this.arrayIterator.hasNext(), true,
                "Assert ArrayIterator has next");
            var next1 = this.arrayIterator.next();
            test.assertEqual(next1, this.array[1],
                "Assert ArrayIterator second item is array[1]");
            test.assertEqual(this.arrayIterator.hasNext(), true,
                "Assert ArrayIterator has next");
            var next2 = this.arrayIterator.next();
            test.assertEqual(next2, this.array[2],
                "Assert ArrayIterator third item is array[2]");
            test.assertEqual(this.arrayIterator.hasNext(), true,
                "Assert ArrayIterator has next");
            var next3 = this.arrayIterator.next();
            test.assertEqual(next3, this.array[3],
                "Assert ArrayIterator fourth item is array[3]");
            test.assertEqual(this.arrayIterator.hasNext(), false,
                "Assert ArrayIterator no longer has next");
            test.assertThrows(function() {
                _this.arrayIterator.next();
            }, "Assert exception is thrown by calling next when hasNext is false");
        }
    };

    /**
     * This tests
     * 1) That ArrayIterator properly iterates over an Array when a value is added above the index
     */
    var arrayIteratorNextWithValueAddedAboveTheIndexTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.array          = ["A", "B", "C"];
            this.arrayIterator  = new ArrayIterator(this.array);
            this.valueAdded     = "ValueAdded";
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertEqual(this.arrayIterator.hasNext(), true,
                "Assert ArrayIterator has next");
            var next0 = this.arrayIterator.next();
            test.assertEqual(next0, this.array[0],
                "Assert ArrayIterator first item is array[0]");

            this.array.splice(2, 0, this.valueAdded);

            test.assertEqual(this.arrayIterator.hasNext(), true,
                "Assert ArrayIterator has next");
            var next1 = this.arrayIterator.next();
            test.assertEqual(next1, this.array[1],
                "Assert ArrayIterator second item is array[1]");
            test.assertEqual(this.arrayIterator.hasNext(), true,
                "Assert ArrayIterator has next");
            var next2 = this.arrayIterator.next();
            test.assertEqual(next2, this.array[2],
                "Assert ArrayIterator third item is array[2]");
            test.assertEqual(this.arrayIterator.hasNext(), true,
                "Assert ArrayIterator has next");
            var next3 = this.arrayIterator.next();
            test.assertEqual(next3, this.array[3],
                "Assert ArrayIterator third item is array[3]");
            test.assertEqual(this.arrayIterator.hasNext(), false,
                "Assert ArrayIterator no longer has next");
            test.assertThrows(function() {
                _this.arrayIterator.next();
            }, "Assert exception is thrown by calling next when hasNext is false");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(arrayIteratorInstantiationTest).with(
        test().name("ArrayIterator - instantiation test")
    );
    bugmeta.tag(arrayIteratorNextTest).with(
        test().name("ArrayIterator - next() test")
    );
    bugmeta.tag(arrayIteratorNextWithValueAddedBelowIndexTest).with(
        test().name("ArrayIterator - next() with value added below the index test")
    );
    bugmeta.tag(arrayIteratorNextWithValueAddedAtIndexTest).with(
        test().name("ArrayIterator - next() with value added at the index test")
    );
    bugmeta.tag(arrayIteratorNextWithValueAddedOneAboveTheIndexTest).with(
        test().name("ArrayIterator - next() with value added one above the index test")
    );
    bugmeta.tag(arrayIteratorNextWithValueAddedAboveTheIndexTest).with(
        test().name("ArrayIterator - next() with value added above the index test")
    );
});
