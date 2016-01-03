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
//@Require('List')
//@Require('Properties')
//@Require('PropertiesChain')
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
    var List                = bugpack.require('List');
    var Properties          = bugpack.require('Properties');
    var PropertiesChain     = bugpack.require('PropertiesChain');
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
     * 1) Instantiation of a basic PropertiesChain
     */
    var propertiesChainInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testPropertiesChain = new PropertiesChain();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testPropertiesChain, PropertiesChain),
                "Assert instance of PropertiesChain");
            test.assertTrue(Class.doesExtend(this.testPropertiesChain.getPropertiesList(), List),
                "Assert getPropertiesList returns a List");
            test.assertEqual(this.testPropertiesChain.getPropertiesList().getCount(), 0,
                "Assert properties list defaults to empty");
        }
    };

    /**
     * This tests...
     */
    var propertiesChainGetPropertyTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testProperties = new Properties({
                property1: "abc"
            });
            this.testPropertiesChain = new PropertiesChain([this.testProperties]);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testPropertiesChain.getProperty('property1'), 'abc',
                'Assert getProperty returned "abc"');
            test.assertEqual(this.testPropertiesChain.getProperty('doesNotExist'), undefined,
                'Assert getProperty returned undefined for property that does not exist');
        }
    };

    /**
     * This tests...
     */
    var propertiesChainHasPropertyTest = {

            // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testProperties = new Properties({
                property1: "abc"
            });
            this.testPropertiesChain = new PropertiesChain([this.testProperties]);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testPropertiesChain.hasProperty('property1'), true,
                'Assert hasProperty returned true for a property that exists');
            test.assertEqual(this.testPropertiesChain.hasProperty('doesNotExist'), false,
                'Assert hasProperty returned false for property that does not exist');
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(propertiesChainInstantiationTest).with(
        test().name("PropertiesChain - instantiation test")
    );
    bugmeta.tag(propertiesChainGetPropertyTest).with(
        test().name("PropertiesChain - #getProperty test")
    );
    bugmeta.tag(propertiesChainHasPropertyTest).with(
        test().name("PropertiesChain - #hasProperty test")
    );
});
