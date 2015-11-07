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
//@Require('ReflectObject')
//@Require('ReflectObjectIterator')
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
    var ReflectObject           = bugpack.require('ReflectObject');
    var ReflectObjectIterator   = bugpack.require('ReflectObjectIterator');
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
     * 1) Instantiation of a new ReflectObjectIterator
     * 2) That the default values are set correctly
     */
    var reflectObjectIteratorInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.reflectObject              = new ReflectObject({});
            this.reflectObjectIterator      = new ReflectObjectIterator(this.reflectObject);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.reflectObjectIterator, ReflectObjectIterator),
                "Assert instance of ReflectObjectIterator");
            test.assertEqual(this.reflectObjectIterator.getReflectObject(), this.reflectObject,
                "Assert ReflectObjectIterator.reflectObject was set correctly during instantiation");
            test.assertEqual(this.reflectObjectIterator.getIndex(), -1,
                "Assert ReflectObjectIterator.index defaults to -1");
            test.assertTrue(TypeUtil.isArray(this.reflectObjectIterator.getProperties()),
                "Assert ReflectObjectIterator.properties is an array");
            if (TypeUtil.isArray(this.reflectObjectIterator.getProperties())) {
                test.assertEqual(this.reflectObjectIterator.getProperties().length, 0,
                    "Assert ReflectObjectIterator.properties is empty");
            }
            test.assertEqual(this.reflectObjectIterator.getPropertyCount(), 0,
                "Assert ReflectObjectIterator.propertyCount is 0");
            test.assertTrue(TypeUtil.isObject(this.reflectObjectIterator.getPropertySkipCountMap()),
                "Assert ReflectObjectIterator.propertySkipCountMap is an reflectObject");
        }
    };

    /**
     * This tests
     * 1) That next properly iterates over Object
     * 2) That calling next() when hasNext is false throws an Exception
     */
    var reflectObjectIteratorNextTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.reflectObject          = new ReflectObject({
                A: "A",
                B: "B",
                C: "C"
            });
            this.reflectObjectIterator  = new ReflectObjectIterator(this.reflectObject);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertEqual(this.reflectObjectIterator.hasNext(), true,
                "Assert ReflectObjectIterator has next");
            var iteration0 = this.reflectObjectIterator.next();
            test.assertEqual(iteration0, this.reflectObject.getProperty("A"),
                "Assert ReflectObjectIterator first iteration is reflectObject.A");
            test.assertEqual(this.reflectObjectIterator.hasNext(), true,
                "Assert ReflectObjectIterator has next");
            var iteration1 = this.reflectObjectIterator.next();
            test.assertEqual(iteration1, this.reflectObject.getProperty("B"),
                "Assert ReflectObjectIterator second iteration is reflectObject.B");
            test.assertEqual(this.reflectObjectIterator.hasNext(), true,
                "Assert ReflectObjectIterator has next");
            var iteration2 = this.reflectObjectIterator.next();
            test.assertEqual(iteration2, this.reflectObject.getProperty("C"),
                "Assert ReflectObjectIterator third item is reflectObject.C");
            test.assertEqual(this.reflectObjectIterator.hasNext(), false,
                "Assert ReflectObjectIterator no longer has next");
            test.assertThrows(function() {
                _this.reflectObjectIterator.next();
            }, "Assert exception is thrown by calling next when hasNext is false");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(reflectObjectIteratorInstantiationTest).with(
        test().name("ReflectObjectIterator - instantiation test")
    );
    bugmeta.tag(reflectObjectIteratorNextTest).with(
        test().name("ReflectObjectIterator - next() test")
    );
});
