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
//@Require('Object')
//@Require('ObjectIterator')
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

    var Class           = bugpack.require('Class');
    var Object          = bugpack.require('Object');
    var ObjectIterator  = bugpack.require('ObjectIterator');
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
     * 1) Instantiation of a new ObjectIterator
     * 2) That the default values are set correctly
     */
    var objectIteratorInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.object         = {};
            this.objectIterator = new ObjectIterator(this.object);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.objectIterator, ObjectIterator),
                "Assert instance of ObjectIterator");
            test.assertEqual(this.objectIterator.getObject(), this.object,
                "Assert ObjectIterator.object was set correctly during instantiation");
            test.assertEqual(this.objectIterator.getIndex(), -1,
                "Assert ObjectIterator.index defaults to -1");
            test.assertTrue(TypeUtil.isArray(this.objectIterator.getProperties()),
                "Assert ObjectIterator.properties is an array");
            if (TypeUtil.isArray(this.objectIterator.getProperties())) {
                test.assertEqual(this.objectIterator.getProperties().length, 0,
                    "Assert ObjectIterator.properties is empty");
            }
            test.assertEqual(this.objectIterator.getPropertyCount(), 0,
                "Assert ObjectIterator.propertyCount is 0");
            test.assertTrue(TypeUtil.isObject(this.objectIterator.getPropertySkipCountMap()),
                "Assert ObjectIterator.propertySkipCountMap is an object");
        }
    };

    /**
     * This tests
     * 1) That next properly iterates over Object
     * 2) That calling next() when hasNext is false throws an Exception
     */
    var objectIteratorNextTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.object          = {
                A: "A",
                B: "B",
                C: "C"
            };
            this.objectIterator  = new ObjectIterator(this.object);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertEqual(this.objectIterator.hasNext(), true,
                "Assert ObjectIterator has next");
            var iteration0 = this.objectIterator.next();
            test.assertEqual(iteration0, this.object.A,
                "Assert ObjectIterator first iteration is object.A");
            test.assertEqual(this.objectIterator.hasNext(), true,
                "Assert ObjectIterator has next");
            var iteration1 = this.objectIterator.next();
            test.assertEqual(iteration1, this.object.B,
                "Assert ObjectIterator second iteration is object.B");
            test.assertEqual(this.objectIterator.hasNext(), true,
                "Assert ObjectIterator has next");
            var iteration2 = this.objectIterator.next();
            test.assertEqual(iteration2, this.object.C,
                "Assert ObjectIterator third item is object.C");
            test.assertEqual(this.objectIterator.hasNext(), false,
                "Assert ObjectIterator no longer has next");
            test.assertThrows(function() {
                _this.objectIterator.next();
            }, "Assert exception is thrown by calling next when hasNext is false");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(objectIteratorInstantiationTest).with(
        test().name("ObjectIterator - instantiation test")
    );
    bugmeta.tag(objectIteratorNextTest).with(
        test().name("ObjectIterator - next() test")
    );
});
