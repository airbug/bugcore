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
//@Require('DataUtil')
//@Require('IdGenerator')
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
    var DataUtil        = bugpack.require('DataUtil');
    var IdGenerator     = bugpack.require('IdGenerator');
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

    /**
     * This tests..
     * 1) That the DataUtil.forIn function correctly iterates over an object and sets the context correctly
     */
    var dataUtilForInObjectIterationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testObject = {
                prop1: "value1",
                prop2: "value2",
                prop3: "value3"
            };
            this.testOptions = {
                context: {
                    contextTrue: true
                }
            };
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var iteratedProps = [];
            var iteratedValues = [];
            DataUtil.forIn(this.testObject, function(prop, value) {
                iteratedProps.push(prop);
                iteratedValues.push(value);
                test.assertTrue(this.contextTrue,
                    "Assert that we are executing within the correct context");
            }, this.testOptions);

            test.assertTrue((iteratedProps.length === 3),
                "Assert we iterated over 3 properties");
            test.assertTrue((iteratedValues.length === 3),
                "Assert we iterated over 3 values");

            var expectedProps = [
                "prop1",
                "prop2",
                "prop3"
            ];
            for (var i = 0, size = iteratedProps.length; i < size; i++) {
                var iteratedProp = iteratedProps[i];
                var expectedPropIndex = expectedProps.indexOf(iteratedProp);
                test.assertTrue((expectedPropIndex > -1),
                    "Assert prop was in the expectedProps");
                expectedProps.splice(expectedPropIndex, 1);
                test.assertEqual(iteratedValues[i], this.testObject[iteratedProp],
                    "Assert the value that was iterated is the one that corresponds to the property");
            }
        }
    };

    /**
     * This tests..
     * 1) That the DataUtil.anyIn function correctly iterates over an object and sets the context correctly
     * 2) That anyIn ends when a truthy value is found
     * 3) That true is returned when anyIn finds a true value
     */
    var dataUtilAnyInObjectIterationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testObject = {
                prop1: "value1",
                prop2: "value2",
                prop3: "value3"
            };
            this.testOptions = {
                context: {
                    contextTrue: true
                }
            };
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            var iteratedProps = [];
            var iteratedValues = [];
            var result = DataUtil.anyIn(this.testObject, function(prop, value) {
                iteratedProps.push(prop);
                iteratedValues.push(value);
                test.assertTrue(this.contextTrue,
                    "Assert that we are executing within the correct context");
                return value === _this.testObject.prop2;
            }, this.testOptions);

            test.assertEqual(result, true,
                "Assert anyIn returned true");
            test.assertTrue((iteratedProps.length === 2),
                "Assert we iterated over 2 properties");
            test.assertTrue((iteratedValues.length === 2),
                "Assert we iterated over 2 values");

            var expectedProps = [
                "prop1",
                "prop2"
            ];
            for (var i = 0, size = iteratedProps.length; i < size; i++) {
                var iteratedProp = iteratedProps[i];
                var expectedPropIndex = expectedProps.indexOf(iteratedProp);
                test.assertTrue((expectedPropIndex > -1),
                    "Assert prop was in the expectedProps");
                expectedProps.splice(expectedPropIndex, 1);
                test.assertEqual(iteratedValues[i], this.testObject[iteratedProp],
                    "Assert the value that was iterated is the one that corresponds to the property");
            }
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(dataUtilForInObjectIterationTest).with(
        test().name("DataUtil - .forIn() object iteration test")
    );
    bugmeta.tag(dataUtilAnyInObjectIterationTest).with(
        test().name("DataUtil - .anyIn() object iteration test")
    );
});
