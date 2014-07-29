/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Interface')
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

    var Interface   = bugpack.require('Interface');
    var TypeUtil    = bugpack.require('TypeUtil');
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
     *
     */
    var interfaceDeclareTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.NewInterface = Interface.declare({
                someFunction1: function() {

                },
                someFunction2: function() {

                }
            });
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(TypeUtil.isFunction(this.NewInterface.prototype.someFunction1),
                "Assert function added to interface is function and is present in interface prototype");
            test.assertTrue(TypeUtil.isFunction(this.NewInterface.prototype.someFunction2),
                "Assert second function added to interface is function and is present in interface prototype");
        }
    };
    bugmeta.tag(interfaceDeclareTest).with(
        test().name("Interface declare test")
    );


    /**
     *
     */
    var interfaceExtendTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.NewInterface = Interface.declare({
                someFunction1: function() {

                },
                someFunction2: function() {

                }
            });

            this.SubInterface = Interface.extend(this.NewInterface, {
                someFunction3: function() {

                }
            });
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(TypeUtil.isFunction(this.NewInterface.prototype.someFunction1),
                "Assert function added to interface is function and is present in interface prototype");
            test.assertTrue(TypeUtil.isFunction(this.NewInterface.prototype.someFunction2),
                "Assert second function added to interface is function and is present in interface prototype");

            test.assertTrue(TypeUtil.isFunction(this.SubInterface.prototype.someFunction2),
                "Assert first function added to sub interface is function and is present in interface prototype");
            test.assertTrue(TypeUtil.isFunction(this.SubInterface.prototype.someFunction2),
                "Assert second function added to sub interface is function and is present in interface prototype");
            test.assertTrue(TypeUtil.isFunction(this.SubInterface.prototype.someFunction2),
                "Assert third function added to sub interface is function and is present in interface prototype");
        }
    };
    bugmeta.tag(interfaceExtendTest).with(
        test().name("Interface extend test")
    );
});
