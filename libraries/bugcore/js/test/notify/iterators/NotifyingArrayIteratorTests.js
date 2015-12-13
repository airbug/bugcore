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
//@Require('NotifyingArray')
//@Require('NotifyingArrayIterator')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var NotifyingArray          = bugpack.require('NotifyingArray');
    var NotifyingArrayIterator  = bugpack.require('NotifyingArrayIterator');
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
            this.reflectArray          = new NotifyingArray([]);
            this.reflectArrayIterator  = new NotifyingArrayIterator(this.reflectArray);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.reflectArrayIterator, NotifyingArrayIterator),
                'Assert instance of NotifyingArrayIterator');
            test.assertEqual(this.reflectArrayIterator.getNotifyingArray(), this.reflectArray,
                'Assert NotifyingArrayIterator.reflectArray was set correctly during instantiation');
            test.assertEqual(this.reflectArrayIterator.getIndex(), -1,
                'Assert NotifyingArrayIterator.index defaults to -1');
        }
    };

    /**
     * This tests
     * 1) That next properly iterates over a NotifyingArray
     * 2) That calling next() when hasNext is false throws an Exception
     */
    var reflectArrayIteratorNextTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.reflectArray          = new NotifyingArray(['A', 'B', 'C']);
            this.reflectArrayIterator  = new NotifyingArrayIterator(this.reflectArray);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                'Assert ArrayIterator has next');
            var next0 = this.reflectArrayIterator.next();
            test.assertEqual(next0, this.reflectArray.getAt(0),
                'Assert ArrayIterator first item is reflectArray.getAt(0)');
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                'Assert ArrayIterator has next');
            var next1 = this.reflectArrayIterator.next();
            test.assertEqual(next1, this.reflectArray.getAt(1),
                'Assert ArrayIterator second item is reflectArray.getAt(1)');
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                'Assert ArrayIterator has next');
            var next2 = this.reflectArrayIterator.next();
            test.assertEqual(next2, this.reflectArray.getAt(2),
                'Assert ArrayIterator third item is reflectArray.getAt(2)');
            test.assertEqual(this.reflectArrayIterator.hasNext(), false,
                'Assert ArrayIterator no longer has next');
            test.assertThrows(function() {
                _this.reflectArrayIterator.next();
            }, 'Assert exception is thrown by calling next when hasNext is false');
        }
    };

    /**
     * This tests
     * 1) That NotifyingArrayIterator properly iterates over a NotifyingArray when a value is added below the index
     */
    var reflectArrayIteratorNextWithValueAddedBelowIndexTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.reflectArray           = new NotifyingArray(['A', 'B', 'C']);
            this.reflectArrayIterator   = new NotifyingArrayIterator(this.reflectArray);
            this.valueAdded             = 'ValueAdded';
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                'Assert NotifyingArrayIterator has next');
            var next0 = this.reflectArrayIterator.next();
            test.assertEqual(next0, this.reflectArray.getAt(0),
                'Assert NotifyingArrayIterator first item is reflectArray.getAt(0)');
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                'Assert NotifyingArrayIterator has next');
            var next1 = this.reflectArrayIterator.next();
            test.assertEqual(next1, this.reflectArray.getAt(1),
                'Assert NotifyingArrayIterator second item is reflectArray.getAt(1)');

            this.reflectArray.splice(0, 0, this.valueAdded);

            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                'Assert NotifyingArrayIterator has next');
            var next2 = this.reflectArrayIterator.next();
            test.assertEqual(next2, this.reflectArray.getAt(3),
                'Assert NotifyingArrayIterator third item is reflectArray.getAt(3)');
            test.assertEqual(this.reflectArrayIterator.hasNext(), false,
                'Assert NotifyingArrayIterator no longer has next');
            test.assertThrows(function() {
                _this.reflectArrayIterator.next();
            }, 'Assert exception is thrown by calling next when hasNext is false');
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
            this.reflectArray           = new NotifyingArray(['A', 'B', 'C']);
            this.reflectArrayIterator   = new NotifyingArrayIterator(this.reflectArray);
            this.valueAdded             = 'ValueAdded';
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                'Assert NotifyingArrayIterator has next');
            var next0 = this.reflectArrayIterator.next();
            test.assertEqual(next0, this.reflectArray.getAt(0),
                'Assert NotifyingArrayIterator first item is reflectArray.getAt(0)');

            this.reflectArray.splice(0, 0, this.valueAdded);

            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                'Assert NotifyingArrayIterator has next');
            var next1 = this.reflectArrayIterator.next();
            test.assertEqual(next1, this.reflectArray.getAt(2),
                'Assert NotifyingArrayIterator second item is reflectArray.getAt(2)');
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                'Assert NotifyingArrayIterator has next');
            var next2 = this.reflectArrayIterator.next();
            test.assertEqual(next2, this.reflectArray.getAt(3),
                'Assert NotifyingArrayIterator third item is reflectArray.getAt(3)');
            test.assertEqual(this.reflectArrayIterator.hasNext(), false,
                'Assert NotifyingArrayIterator no longer has next');
            test.assertThrows(function() {
                _this.reflectArrayIterator.next();
            }, 'Assert exception is thrown by calling next when hasNext is false');
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
            this.reflectArray           = new NotifyingArray(['A', 'B', 'C']);
            this.reflectArrayIterator   = new NotifyingArrayIterator(this.reflectArray);
            this.valueAdded             = 'ValueAdded';
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                'Assert NotifyingArrayIterator has next');
            var next0 = this.reflectArrayIterator.next();
            test.assertEqual(next0, this.reflectArray.getAt(0),
                'Assert NotifyingArrayIterator first item is reflectArray.getAt(0)');

            this.reflectArray.splice(1, 0, this.valueAdded);

            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                'Assert NotifyingArrayIterator has next');
            var next1 = this.reflectArrayIterator.next();
            test.assertEqual(next1, this.reflectArray.getAt(1),
                'Assert NotifyingArrayIterator second item is reflectArray.getAt(1)');
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                'Assert NotifyingArrayIterator has next');
            var next2 = this.reflectArrayIterator.next();
            test.assertEqual(next2, this.reflectArray.getAt(2),
                'Assert NotifyingArrayIterator third item is reflectArray.getAt(2)');
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                'Assert NotifyingArrayIterator has next');
            var next3 = this.reflectArrayIterator.next();
            test.assertEqual(next3, this.reflectArray.getAt(3),
                'Assert NotifyingArrayIterator fourth item is reflectArray.getAt(3)');
            test.assertEqual(this.reflectArrayIterator.hasNext(), false,
                'Assert NotifyingArrayIterator no longer has next');
            test.assertThrows(function() {
                _this.reflectArrayIterator.next();
            }, 'Assert exception is thrown by calling next when hasNext is false');
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
            this.reflectArray           = new NotifyingArray(['A', 'B', 'C']);
            this.reflectArrayIterator   = new NotifyingArrayIterator(this.reflectArray);
            this.valueAdded             = 'ValueAdded';
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                'Assert NotifyingArrayIterator has next');
            var next0 = this.reflectArrayIterator.next();
            test.assertEqual(next0, this.reflectArray.getAt(0),
                'Assert NotifyingArrayIterator first item is reflectArray.getAt(0)');

            this.reflectArray.splice(2, 0, this.valueAdded);

            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                'Assert NotifyingArrayIterator has next');
            var next1 = this.reflectArrayIterator.next();
            test.assertEqual(next1, this.reflectArray.getAt(1),
                'Assert NotifyingArrayIterator second item is reflectArray.getAt(1)');
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                'Assert NotifyingArrayIterator has next');
            var next2 = this.reflectArrayIterator.next();
            test.assertEqual(next2, this.reflectArray.getAt(2),
                'Assert NotifyingArrayIterator third item is reflectArray.getAt(2)');
            test.assertEqual(this.reflectArrayIterator.hasNext(), true,
                'Assert NotifyingArrayIterator has next');
            var next3 = this.reflectArrayIterator.next();
            test.assertEqual(next3, this.reflectArray.getAt(3),
                'Assert NotifyingArrayIterator third item is reflectArray.getAt(3)');
            test.assertEqual(this.reflectArrayIterator.hasNext(), false,
                'Assert NotifyingArrayIterator no longer has next');
            test.assertThrows(function() {
                _this.reflectArrayIterator.next();
            }, 'Assert exception is thrown by calling next when hasNext is false');
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(reflectArrayIteratorInstantiationTest).with(
        test().name('NotifyingArrayIterator - instantiation test')
    );
    bugmeta.tag(reflectArrayIteratorNextTest).with(
        test().name('NotifyingArrayIterator - next() test')
    );
    bugmeta.tag(reflectArrayIteratorNextWithValueAddedBelowIndexTest).with(
        test().name('NotifyingArrayIterator - next() with value added below the index test')
    );
    bugmeta.tag(reflectArrayIteratorNextWithValueAddedAtIndexTest).with(
        test().name('NotifyingArrayIterator - next() with value added at the index test')
    );
    bugmeta.tag(reflectArrayIteratorNextWithValueAddedOneAboveTheIndexTest).with(
        test().name('NotifyingArrayIterator - next() with value added one above the index test')
    );
    bugmeta.tag(reflectArrayIteratorNextWithValueAddedAboveTheIndexTest).with(
        test().name('NotifyingArrayIterator - next() with value added above the index test')
    );
});
