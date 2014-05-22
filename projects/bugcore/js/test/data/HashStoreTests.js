/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('HashStore')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var HashStore       = bugpack.require('HashStore');
    var Obj             = bugpack.require('Obj');
    var TypeUtil        = bugpack.require('TypeUtil');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestAnnotation  = bugpack.require('bugunit.TestAnnotation');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var test            = TestAnnotation.test;


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
                "Assert instance of hashStore");
            test.assertEqual(this.hashStore.getCount(), 0,
                "Assert .count defaults to 0");
            test.assertTrue(TypeUtil.isObject(this.hashStore.getHashStoreNodeObject()),
                "Assert .hashStoreNodeObject is an object");
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
            this.hashStore.addValue(this.testValue1);
            this.hashStore.addValue(this.testValue2);
            test.assertEqual(Obj.getProperties(this.hashStore.getHashStoreNodeObject()).length, 2,
                "Assert that there are two different node objects");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(hashStoreInstantiationTest).with(
        test().name("HashStore - instantiation test")
    );
    bugmeta.annotate(hashStoreAddTwoFunctionValuesTest).with(
        test().name("HashStore - #addValue with two functions test")
    );
});