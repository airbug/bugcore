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
//@Require('ReflectArray')
//@Require('ReflectArrayIterator')
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

    var Class                   = bugpack.require('Class');
    var ReflectArray            = bugpack.require('ReflectArray');
    var ReflectArrayIterator    = bugpack.require('ReflectArrayIterator');
    var TypeUtil                = bugpack.require('TypeUtil');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var TestTag                 = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var test                    = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests
     * 1) Instantiation of a new ArrayIterator
     * 2) That the default values are set correctly
     */
    var reflectArrayIteratorInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.reflectArray          = new ReflectArray([]);
            this.reflectArrayIterator  = new ReflectArrayIterator(this.reflectArray);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.reflectArrayIterator, ReflectArrayIterator),
                "Assert instance of ReflectArrayIterator");
            test.assertEqual(this.reflectArrayIterator.getReflectArray(), this.reflectArray,
                "Assert ReflectArrayIterator.reflectArray was set correctly during instantiation");
            test.assertEqual(this.reflectArrayIterator.getIndex(), -1,
                "Assert ReflectArrayIterator.index defaults to -1");
        }
    };

    /**
     * This tests
     * 1) That next properly iterates over a ReflectArray
     * 2) That calling next() when hasNext is false throws an Exception
     */
    var reflectArrayIteratorNextTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.reflectArray          = new ReflectArray(["A", "B", "C"]);
            this.reflectArrayIterator  = new ReflectArrayIterator(this.reflectArray);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                "Assert ArrayIterator has next");
            var next0 = this.reflectArrayIterator.next();
            test.assertEqual(next0, this.reflectArray.getAt(0),
                "Assert ArrayIterator first item is reflectArray.getAt(0)");
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                "Assert ArrayIterator has next");
            var next1 = this.reflectArrayIterator.next();
            test.assertEqual(next1, this.reflectArray.getAt(1),
                "Assert ArrayIterator second item is reflectArray.getAt(1)");
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                "Assert ArrayIterator has next");
            var next2 = this.reflectArrayIterator.next();
            test.assertEqual(next2, this.reflectArray.getAt(2),
                "Assert ArrayIterator third item is reflectArray.getAt(2)");
            test.assertEqual(this.reflectArrayIterator.hasNext(), false,
                "Assert ArrayIterator no longer has next");
            test.assertThrows(function() {
                _this.reflectArrayIterator.next();
            }, "Assert exception is thrown by calling next when hasNext is false");
        }
    };

    /**
     * This tests
     * 1) That ReflectArrayIterator properly iterates over a ReflectArray when a value is added below the index
     */
    var reflectArrayIteratorNextWithValueAddedBelowIndexTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.reflectArray           = new ReflectArray(["A", "B", "C"]);
            this.reflectArrayIterator   = new ReflectArrayIterator(this.reflectArray);
            this.valueAdded             = "ValueAdded";
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                "Assert ReflectArrayIterator has next");
            var next0 = this.reflectArrayIterator.next();
            test.assertEqual(next0, this.reflectArray.getAt(0),
                "Assert ReflectArrayIterator first item is reflectArray.getAt(0)");
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                "Assert ReflectArrayIterator has next");
            var next1 = this.reflectArrayIterator.next();
            test.assertEqual(next1, this.reflectArray.getAt(1),
                "Assert ReflectArrayIterator second item is reflectArray.getAt(1)");

            this.reflectArray.splice(0, 0, this.valueAdded);

            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                "Assert ReflectArrayIterator has next");
            var next2 = this.reflectArrayIterator.next();
            test.assertEqual(next2, this.reflectArray.getAt(3),
                "Assert ReflectArrayIterator third item is reflectArray.getAt(3)");
            test.assertEqual(this.reflectArrayIterator.hasNext(), false,
                "Assert ReflectArrayIterator no longer has next");
            test.assertThrows(function() {
                _this.reflectArrayIterator.next();
            }, "Assert exception is thrown by calling next when hasNext is false");
        }
    };

    /**
     * This tests
     * 1) That ArrayIterator properly iterates over an Array when a value is added at the index
     */
    var reflectArrayIteratorNextWithValueAddedAtIndexTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.reflectArray           = new ReflectArray(["A", "B", "C"]);
            this.reflectArrayIterator   = new ReflectArrayIterator(this.reflectArray);
            this.valueAdded             = "ValueAdded";
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                "Assert ReflectArrayIterator has next");
            var next0 = this.reflectArrayIterator.next();
            test.assertEqual(next0, this.reflectArray.getAt(0),
                "Assert ReflectArrayIterator first item is reflectArray.getAt(0)");

            this.reflectArray.splice(0, 0, this.valueAdded);

            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                "Assert ReflectArrayIterator has next");
            var next1 = this.reflectArrayIterator.next();
            test.assertEqual(next1, this.reflectArray.getAt(2),
                "Assert ReflectArrayIterator second item is reflectArray.getAt(2)");
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                "Assert ReflectArrayIterator has next");
            var next2 = this.reflectArrayIterator.next();
            test.assertEqual(next2, this.reflectArray.getAt(3),
                "Assert ReflectArrayIterator third item is reflectArray.getAt(3)");
            test.assertEqual(this.reflectArrayIterator.hasNext(), false,
                "Assert ReflectArrayIterator no longer has next");
            test.assertThrows(function() {
                _this.reflectArrayIterator.next();
            }, "Assert exception is thrown by calling next when hasNext is false");
        }
    };

    /**
     * This tests
     * 1) That ArrayIterator properly iterates over an Array when a value is added at the index
     */
    var reflectArrayIteratorNextWithValueAddedOneAboveTheIndexTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.reflectArray           = new ReflectArray(["A", "B", "C"]);
            this.reflectArrayIterator   = new ReflectArrayIterator(this.reflectArray);
            this.valueAdded             = "ValueAdded";
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                "Assert ReflectArrayIterator has next");
            var next0 = this.reflectArrayIterator.next();
            test.assertEqual(next0, this.reflectArray.getAt(0),
                "Assert ReflectArrayIterator first item is reflectArray.getAt(0)");

            this.reflectArray.splice(1, 0, this.valueAdded);

            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                "Assert ReflectArrayIterator has next");
            var next1 = this.reflectArrayIterator.next();
            test.assertEqual(next1, this.reflectArray.getAt(1),
                "Assert ReflectArrayIterator second item is reflectArray.getAt(1)");
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                "Assert ReflectArrayIterator has next");
            var next2 = this.reflectArrayIterator.next();
            test.assertEqual(next2, this.reflectArray.getAt(2),
                "Assert ReflectArrayIterator third item is reflectArray.getAt(2)");
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                "Assert ReflectArrayIterator has next");
            var next3 = this.reflectArrayIterator.next();
            test.assertEqual(next3, this.reflectArray.getAt(3),
                "Assert ReflectArrayIterator fourth item is reflectArray.getAt(3)");
            test.assertEqual(this.reflectArrayIterator.hasNext(), false,
                "Assert ReflectArrayIterator no longer has next");
            test.assertThrows(function() {
                _this.reflectArrayIterator.next();
            }, "Assert exception is thrown by calling next when hasNext is false");
        }
    };

    /**
     * This tests
     * 1) That ArrayIterator properly iterates over an Array when a value is added above the index
     */
    var reflectArrayIteratorNextWithValueAddedAboveTheIndexTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.reflectArray           = new ReflectArray(["A", "B", "C"]);
            this.reflectArrayIterator   = new ReflectArrayIterator(this.reflectArray);
            this.valueAdded             = "ValueAdded";
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                "Assert ReflectArrayIterator has next");
            var next0 = this.reflectArrayIterator.next();
            test.assertEqual(next0, this.reflectArray.getAt(0),
                "Assert ReflectArrayIterator first item is reflectArray.getAt(0)");

            this.reflectArray.splice(2, 0, this.valueAdded);

            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                "Assert ReflectArrayIterator has next");
            var next1 = this.reflectArrayIterator.next();
            test.assertEqual(next1, this.reflectArray.getAt(1),
                "Assert ReflectArrayIterator second item is reflectArray.getAt(1)");
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                "Assert ReflectArrayIterator has next");
            var next2 = this.reflectArrayIterator.next();
            test.assertEqual(next2, this.reflectArray.getAt(2),
                "Assert ReflectArrayIterator third item is reflectArray.getAt(2)");
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                "Assert ReflectArrayIterator has next");
            var next3 = this.reflectArrayIterator.next();
            test.assertEqual(next3, this.reflectArray.getAt(3),
                "Assert ReflectArrayIterator third item is reflectArray.getAt(3)");
            test.assertEqual(this.reflectArrayIterator.hasNext(), false,
                "Assert ReflectArrayIterator no longer has next");
            test.assertThrows(function() {
                _this.reflectArrayIterator.next();
            }, "Assert exception is thrown by calling next when hasNext is false");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(reflectArrayIteratorInstantiationTest).with(
        test().name("ReflectArrayIterator - instantiation test")
    );
    bugmeta.tag(reflectArrayIteratorNextTest).with(
        test().name("ReflectArrayIterator - next() test")
    );
    bugmeta.tag(reflectArrayIteratorNextWithValueAddedBelowIndexTest).with(
        test().name("ReflectArrayIterator - next() with value added below the index test")
    );
    bugmeta.tag(reflectArrayIteratorNextWithValueAddedAtIndexTest).with(
        test().name("ReflectArrayIterator - next() with value added at the index test")
    );
    bugmeta.tag(reflectArrayIteratorNextWithValueAddedOneAboveTheIndexTest).with(
        test().name("ReflectArrayIterator - next() with value added one above the index test")
    );
    bugmeta.tag(reflectArrayIteratorNextWithValueAddedAboveTheIndexTest).with(
        test().name("ReflectArrayIterator - next() with value added above the index test")
    );
});
