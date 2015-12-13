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
//@Require('NotifyingObject')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var HashStore           = bugpack.require('HashStore');
    var NotifyingObject     = bugpack.require('NotifyingObject');
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
     *
     */
    var hashStoreInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.hashStore = new HashStore();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.hashStore, HashStore),
                'Assert instance of hashStore');
            test.assertEqual(this.hashStore.getCount(), 0,
                'Assert .count defaults to 0');
            test.assertTrue(Class.doesExtend(this.hashStore.getHashStoreNodeNotifyingObject(), NotifyingObject),
                'Assert .hashStoreNodeNotifyingObject is an instance of NotifyingObject');
        }
    };

    /**
     *
     */
    var hashStoreAddTwoFunctionValuesTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.hashStore = new HashStore();
            this.testValue1 = function() {};
            this.testValue2 = function() {};
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.hashStore.add(this.testValue1);
            this.hashStore.add(this.testValue2);
            test.assertEqual(this.hashStore.getHashStoreNodeNotifyingObject().keys().length, 2,
                'Assert that there are two different node objects');
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(hashStoreInstantiationTest).with(
        test().name('HashStore - instantiation test')
    );
    bugmeta.tag(hashStoreAddTwoFunctionValuesTest).with(
        test().name('HashStore - #addValue with two functions test')
    );
});
