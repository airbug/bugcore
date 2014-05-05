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
//@Require('Throwable')
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
    var Throwable       = bugpack.require('Throwable');
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

    var throwableInstantiationWithoutOptionalArgsTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testType       = "testType";
            this.testThrowable  = new Throwable(this.testType);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testThrowable, Throwable),
                "Assert instance of Throwable");
            test.assertEqual(this.testThrowable.getType(), this.testType,
                "Assert .type was set correctly");
            var isArray = TypeUtil.isArray(this.testThrowable.getCauses());
            test.assertTrue(isArray,
                "Assert .causes defaulted to an Array");
            if (isArray) {
                test.assertEqual(this.testThrowable.getCauses().length, 0,
                    "Assert causes array is empty");
            }
            test.assertEqual(this.testThrowable.getMessage(), "",
                "Assert .message was set to an empty string");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(throwableInstantiationWithoutOptionalArgsTest).with(
        test().name("Throwable - instantiation without optional args test")
    );
});
