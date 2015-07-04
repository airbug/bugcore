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
//@Require('Constructor')
//@Require('Obj')
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
    var Constructor     = bugpack.require('Constructor');
    var Obj             = bugpack.require('Obj');
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

    var constructorInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function (test) {
            this.testConstructor = new Constructor();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function (test) {
            test.assertTrue(Class.doesExtend(this.testConstructor, Constructor),
                "Assert instance of Constructor");
        }
    };

    var constructorAllocTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.instance = Constructor.alloc();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.instance, Constructor),
                "Assert instance of Constructor extends Constructor");
        }
    };

    var constructorAllocWithArrayTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.instance = Constructor.allocWithArray([]);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.instance, Constructor),
                "Assert instance of Constructor extends Constructor");
        }
    };

    var constructorNewInstanceTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.instance = Constructor.newInstance();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.instance, Constructor),
                "Assert instance of Constructor extends Constructor");
        }
    };

    var constructorNewInstanceWithArrayTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.instance = Constructor.newInstanceWithArray([]);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.instance, Constructor),
                "Assert instance of Constructor extends Constructor");
        }
    };

    //TODO BRN: Add a test that ensures that newInstance and alloc methods still work if the Constructor.apply method has been overridden

    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(constructorInstantiationTest).with(
        test().name("Constructor - instantiation test")
    );
    bugmeta.tag(constructorAllocTest).with(
        test().name("Constructor - #alloc test")
    );
    bugmeta.tag(constructorAllocWithArrayTest).with(
        test().name("Constructor - #allocWithArray test")
    );
    bugmeta.tag(constructorNewInstanceTest).with(
        test().name("Constructor - #newInstance test")
    );
    bugmeta.tag(constructorNewInstanceWithArrayTest).with(
        test().name("Constructor - #newInstanceWithArray test")
    );
});
