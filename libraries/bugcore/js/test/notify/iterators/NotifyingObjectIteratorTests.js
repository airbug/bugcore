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
//@Require('NotifyingObject')
//@Require('NotifyingObjectIterator')
//@Require('TypeUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var NotifyingObject             = bugpack.require('NotifyingObject');
    var NotifyingObjectIterator     = bugpack.require('NotifyingObjectIterator');
    var TypeUtil                    = bugpack.require('TypeUtil');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');
    var TestTag                     = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                     = BugMeta.context();
    var test                        = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests
     * 1) Instantiation of a new NotifyingObjectIterator
     * 2) That the default values are set correctly
     */
    var reflectObjectIteratorInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.reflectObject              = new NotifyingObject({});
            this.reflectObjectIterator      = new NotifyingObjectIterator(this.reflectObject);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.reflectObjectIterator, NotifyingObjectIterator),
                'Assert instance of NotifyingObjectIterator');
            test.assertEqual(this.reflectObjectIterator.getNotifyingObject(), this.reflectObject,
                'Assert NotifyingObjectIterator.reflectObject was set correctly during instantiation');
            test.assertEqual(this.reflectObjectIterator.getIndex(), -1,
                'Assert NotifyingObjectIterator.index defaults to -1');
            test.assertTrue(TypeUtil.isArray(this.reflectObjectIterator.getProperties()),
                'Assert NotifyingObjectIterator.properties is an array');
            if (TypeUtil.isArray(this.reflectObjectIterator.getProperties())) {
                test.assertEqual(this.reflectObjectIterator.getProperties().length, 0,
                    'Assert NotifyingObjectIterator.properties is empty');
            }
            test.assertEqual(this.reflectObjectIterator.getPropertyCount(), 0,
                'Assert NotifyingObjectIterator.propertyCount is 0');
            test.assertTrue(TypeUtil.isObject(this.reflectObjectIterator.getPropertySkipCountMap()),
                'Assert NotifyingObjectIterator.propertySkipCountMap is an reflectObject');
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
            this.reflectObject          = new NotifyingObject({
                A: 'A',
                B: 'B',
                C: 'C'
            });
            this.reflectObjectIterator  = new NotifyingObjectIterator(this.reflectObject);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertEqual(this.reflectObjectIterator.hasNext(), true,
                'Assert NotifyingObjectIterator has next');
            var iteration0 = this.reflectObjectIterator.next();
            test.assertEqual(iteration0, this.reflectObject.getProperty('A'),
                'Assert NotifyingObjectIterator first iteration is reflectObject.A');
            test.assertEqual(this.reflectObjectIterator.hasNext(), true,
                'Assert NotifyingObjectIterator has next');
            var iteration1 = this.reflectObjectIterator.next();
            test.assertEqual(iteration1, this.reflectObject.getProperty('B'),
                'Assert NotifyingObjectIterator second iteration is reflectObject.B');
            test.assertEqual(this.reflectObjectIterator.hasNext(), true,
                'Assert NotifyingObjectIterator has next');
            var iteration2 = this.reflectObjectIterator.next();
            test.assertEqual(iteration2, this.reflectObject.getProperty('C'),
                'Assert NotifyingObjectIterator third item is reflectObject.C');
            test.assertEqual(this.reflectObjectIterator.hasNext(), false,
                'Assert NotifyingObjectIterator no longer has next');
            test.assertThrows(function() {
                _this.reflectObjectIterator.next();
            }, 'Assert exception is thrown by calling next when hasNext is false');
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(reflectObjectIteratorInstantiationTest).with(
        test().name('NotifyingObjectIterator - instantiation test')
    );
    bugmeta.tag(reflectObjectIteratorNextTest).with(
        test().name('NotifyingObjectIterator - next() test')
    );
});
