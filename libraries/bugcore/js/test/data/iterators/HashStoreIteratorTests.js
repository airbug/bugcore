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
//@Require('HashStore')
//@Require('HashStoreIterator')
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

    var Class               = bugpack.require('Class');
    var HashStore           = bugpack.require('HashStore');
    var HashStoreIterator   = bugpack.require('HashStoreIterator');
    var ObjectIterator      = bugpack.require('ObjectIterator');
    var TypeUtil            = bugpack.require('TypeUtil');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var TestTag             = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var test                = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests
     * 1) Instantiation of a new HashStoreIterator
     * 2) That the default values are set correctly
     */
    var hashStoreIteratorInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.hashStore          = new HashStore();
            this.hashStoreIterator  = new HashStoreIterator(this.hashStore);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.hashStoreIterator, HashStoreIterator),
                "Assert instance of HashStoreIterator");
            test.assertEqual(this.hashStoreIterator.getHashStore(), this.hashStore,
                "Assert HashStoreIterator.hashStore was set correctly during instantiation");
            test.assertEqual(this.hashStoreIterator.getHashStoreNodeArrayIterator(), null,
                "Assert HashStoreIterator.hashStoreNodeArrayIterator defaults to null");
            test.assertTrue(Class.doesExtend(this.hashStoreIterator.getHashStoreNodeObjectIterator(), ObjectIterator),
                "Assert HashStoreIterator.hashStoreNodeObjectIterator is an ObjectIterator");
        }
    };

    /**
     * This tests
     * 1) That next properly iterates over HashStore
     * 2) That calling next() when hasNext is false throws an Exception
     */
    var hashStoreIteratorNextTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            var _this = this;
            this.array = ["A", "B", "C"];
            this.hashStore          = new HashStore();
            this.array.forEach(function(item) {
                _this.hashStore.add(item);
            });
            this.hashStoreIterator  = new HashStoreIterator(this.hashStore);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertEqual(this.hashStoreIterator.hasNext(), true,
                "Assert HashStoreIterator has next");
            var next0 = this.hashStoreIterator.next();
            testFindAndRemoveItem(test, this.array, next0);
            test.assertEqual(this.hashStoreIterator.hasNext(), true,
                "Assert HashStoreIterator has next");
            var next1 = this.hashStoreIterator.next();
            testFindAndRemoveItem(test, this.array, next1);
            test.assertEqual(this.hashStoreIterator.hasNext(), true,
                "Assert HashStoreIterator has next");
            var next2 = this.hashStoreIterator.next();
            testFindAndRemoveItem(test, this.array, next2);
            test.assertEqual(this.hashStoreIterator.hasNext(), false,
                "Assert HashStoreIterator no longer has next");
            test.assertThrows(function() {
                _this.hashStoreIterator.next();
            }, "Assert exception is thrown by calling next when hasNext is false");
            test.assertEqual(this.array.length, 0,
                "Assert all items in the array were found");
        }
    };

    /**
     * This tests
     * 1) That next properly iterates over HashStore
     * 2) That calling next() when hasNext is false throws an Exception
     */
    var hashStoreIteratorClearHashStoreTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            var _this = this;
            this.array = ["A", "B", "C"];
            this.hashStore          = new HashStore();
            this.array.forEach(function(item) {
                _this.hashStore.add(item);
            });
            this.hashStoreIterator  = new HashStoreIterator(this.hashStore);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            test.assertEqual(this.hashStoreIterator.hasNext(), true,
                "Assert HashStoreIterator has next");
            var next0 = this.hashStoreIterator.next();
            this.array = testFindAndRemoveItem(test, this.array, next0);
            test.assertEqual(this.hashStoreIterator.hasNext(), true,
                "Assert HashStoreIterator has next");

            this.hashStore.clear();

            test.assertEqual(this.hashStoreIterator.hasNext(), false,
                "Assert HashStoreIterator no longer has next after clear() is called on HashStore");
            test.assertThrows(function() {
                _this.hashStoreIterator.next();
            }, "Assert exception is thrown by calling next when hasNext is false");
        }
    };

    var testFindAndRemoveItem = function(test, array, item) {
        var index = array.indexOf(item);
        test.assertTrue(index > -1, "Assert item '" + item + "' was found in array");
        if (index > -1) {
            array.splice(index, 1);
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(hashStoreIteratorInstantiationTest).with(
        test().name("HashStoreIterator - instantiation test")
    );
    bugmeta.tag(hashStoreIteratorNextTest).with(
        test().name("HashStoreIterator - next() test")
    );
    bugmeta.tag(hashStoreIteratorClearHashStoreTest).with(
        test().name("HashStoreIterator - clear() hash store test")
    );
});
