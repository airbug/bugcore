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
//@Require('MathUtil')
//@Require('Obj')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var MathUtil    = bugpack.require('MathUtil');
    var Obj         = bugpack.require('Obj');
    var BugMeta     = bugpack.require('bugmeta.BugMeta');
    var TestTag     = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta     = BugMeta.context();
    var test        = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests
     * 1) Converting degrees to radians
     */
    var degreesToRadiansTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.degreesValue = 180;
            this.expectedValue = Math.PI;
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(MathUtil.degreesToRadians(this.degreesValue), this.expectedValue,
                "Assert degrees to radians was correct");
        }
    };

    /**
     * This tests
     * 1) Converting radians to degrees
     */
    var radiansToDegreesTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.radiansValue = Math.PI;
            this.expectedValue = 180;
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(MathUtil.radiansToDegrees(this.radiansValue), this.expectedValue,
                "Assert radians to degrees was correct");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(degreesToRadiansTest).with(
        test().name("MathUtil - degreesToRadians test")
    );
    bugmeta.tag(radiansToDegreesTest).with(
        test().name("MathUtil - radiansToDegrees test")
    );
});
