/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Config')
//@Require('Properties')
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
    var Config      = bugpack.require('Config');
    var Properties  = bugpack.require('Properties');
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
     * This tests...
     * 1) Instantiating a Config class with no parameters
     */
    var configInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testConfig =   new Config();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var properties = this.testConfig.getProperties();
            test.assertTrue(Class.doesExtend(properties, Properties),
                "Assert Config#getProperties returns a Properties instance when there were no parameters passed to the constructor");
        }
    };
    bugmeta.tag(configInstantiationTest).with(
        test().name("Config - instantiation test")
    );

    /**
     * This tests...
     * 1) Instantiating a Config class with a propertiesObject
     */
    var configInstantiationWithPropertiesObjectTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testValue              = "testValue";
            this.testPropertiesObject   = {
                testProperty: this.testValue
            };
            this.testConfig             =   new Config(this.testPropertiesObject);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testConfig.getProperties().getProperty("testProperty"), this.testValue,
                "Assert 'testProperty' is present in the Config and returns testValue");
            test.assertEqual(this.testConfig.getProperties().getProperty("nonProperty"), undefined,
                "Assert 'nonProperty' does not exist and returns undefined");
        }
    };
    bugmeta.tag(configInstantiationWithPropertiesObjectTest).with(
        test().name("Config - instantiation with propertiesObject test")
    );


    /**
     * This tests...
     * 1) Setting a property
     * 2) Getting a property
     */
    var configSetGetPropertyTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testValue      = "testValue";
            this.testName       = "testName";
            this.testConfig     = new Config();
            this.testConfig.setProperty(this.testName, this.testValue);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testConfig.getProperty(this.testName), this.testValue,
                "Assert 'testName' is present in the Config and returns 'testValue'");
        }
    };
    bugmeta.tag(configSetGetPropertyTest).with(
        test().name("Config - set/get property test")
    );
});
