/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Properties')
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

    var Properties      = bugpack.require('Properties');
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
     * This tests
     * 1) Instantiation of a basic Properties
     * 2) That the getProperty method can retrieve properties from the instantiated object.
     */
    var propertiesInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testPropertiesObject = {
                someProperty: "someValue"
            };
            this.testProperties = new Properties(this.testPropertiesObject);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testProperties.getPropertiesObject(), this.testPropertiesObject,
                "Assert the properties object is the test properties object");
            test.assertEqual(this.testProperties.getProperty("someProperty"), "someValue",
                "Assert 'someProperty' is 'someValue'");
            test.assertEqual(this.testProperties.getProperty("doesNotExist"), undefined,
                "Assert a property that does not exist will return 'undefined'");
            test.assertEqual(this.testProperties.getProperty("someProperty.doesNotExist"), undefined,
                "Assert a property that does exist but has no sub properties not exist will return 'undefined' if we try to access a sub property");
        }
    };

    /**
     * This tests...
     */
    var propertiesUpdatePropertiesTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testProperties = new Properties({});
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testProperties.updateProperties({
                someProp: {
                    someArray: [
                        "."
                    ]
                }
            });

            var someArray = this.testProperties.getProperty("someProp.someArray");
            test.assertTrue(TypeUtil.isArray(someArray),
                "Assert 'someProp.someArray' is an array");
            test.assertEqual(someArray[0], ".",
                "Assert index 0 of someArray is equal to '.'");
        }
    };

    /**
     * This tests...
     */
    var propertiesUpdatePropertiesDuplicateSubNameTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testProperties = new Properties({});
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testProperties.updateProperties({
                name: "value",
                test: {
                    name: "otherValue"
                }
            });

            var nameValue       = this.testProperties.getProperty("name");
            var testNameValue   = this.testProperties.getProperty("test.name");
            test.assertEqual(nameValue, "value",
                "Assert 'name' is 'value'");
            test.assertEqual(testNameValue, "otherValue",
                "Assert 'test.name' is 'otherValue'");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(propertiesInstantiationTest).with(
        test().name("Properties instantiation test")
    );
    bugmeta.annotate(propertiesUpdatePropertiesTest).with(
        test().name("Properties - #updateProperties test")
    );
    bugmeta.annotate(propertiesUpdatePropertiesDuplicateSubNameTest).with(
        test().name("Properties - #updateProperties duplicate sub name test")
    );
});
