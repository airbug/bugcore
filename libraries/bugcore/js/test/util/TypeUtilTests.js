/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Set')
//@Require('TypeUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('tests.TypeValueSetsHelper')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Set                     = bugpack.require('Set');
    var TypeUtil                = bugpack.require('TypeUtil');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var TestTag                 = bugpack.require('bugunit.TestTag');
    var TypeValueSetsHelper     = bugpack.require('tests.TypeValueSetsHelper');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var test                    = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     *
     */
    var typeComparisonTest = {

        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            TypeUtilTests.runTypeTest("arguments", test);
            TypeUtilTests.runTypeTest("array", test);
            TypeUtilTests.runTypeTest("boolean", test);
            TypeUtilTests.runTypeTest("function", test);
            TypeUtilTests.runTypeTest("null", test);
            TypeUtilTests.runTypeTest("number", test);
            TypeUtilTests.runTypeTest("object", test);
            TypeUtilTests.runTypeTest("regexp", test);
            TypeUtilTests.runTypeTest("string", test);
            TypeUtilTests.runTypeTest("undefined", test);
        }

    };

    var TypeUtilTests = {
        runTypeTest: function(typeToTest, runningTest) {
            var typeValueSets = TypeValueSetsHelper.getTypeValueSets();
            for (var type in typeValueSets) {
                var typeValueSet = typeValueSets[type];
                typeValueSet.forEach(function(typeValue) {
                    if (type === typeToTest) {
                        runningTest.assertTrue(TypeUtilTests.testIsType(typeToTest, typeValue.value), "Assert " + typeValue.name + " is " + typeToTest);
                    } else {
                        runningTest.assertFalse(TypeUtilTests.testIsType(typeToTest, typeValue.value), "Assert " + typeValue.name + " is NOT " + typeToTest)
                    }
                });
            }
        },

        testIsType: function(type, value) {
            if (type === "arguments") {
                return TypeUtil.isArguments(value);
            } else if (type === "array") {
                return TypeUtil.isArray(value);
            } else if (type === "boolean") {
                return TypeUtil.isBoolean(value);
            } else if (type === "function") {
                return TypeUtil.isFunction(value);
            } else if (type === "null") {
                return TypeUtil.isNull(value);
            } else if (type === "number") {
                return TypeUtil.isNumber(value);
            } else if (type === "object") {
                return TypeUtil.isObject(value);
            } else if (type === "regexp") {
                return TypeUtil.isRegExp(value);
            } else if (type === "string") {
                return TypeUtil.isString(value);
            } else if (type === "undefined") {
                return TypeUtil.isUndefined(value);
            }
        }
    };

    /**
     *
     */
    var typeUtilToTypeTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testArguments  = [
                arguments
            ];
            this.testArrays     = [
                [],
                new Array()
            ];
            this.testBooleans   = [
                false,
                true,
                new Boolean(true),
                new Boolean(false)
            ];
            this.testDates = [
                new Date(Date.now()),
                new Date(0)
            ];
            this.testFunctions = [
                new Function(),
                function() {}
            ];
            this.testNumbers     = [
                123,
                0,
                -123,
                123.1,
                -123.1,
                new Number(0),
                new Number(123)
            ];
            this.testObjects    = [
                {},
                new Object(),
                new Error(),
                //NOTE BRN: All class instances should return as 'object' types

                new Set()
            ];
            this.testRegExps    = [
                /./,
                new RegExp(".")
            ];
            this.testStrings    = [
                "test",
                new String("test2"),
                new String(),
                ""
            ];

            this.testNull = null;
            this.testUndefined = undefined;
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testArguments.forEach(function(value) {
                test.assertEqual(TypeUtil.toType(value), "arguments",
                        "Assert toType returns 'arguments' for value - value:" + value);
            });
            this.testArrays.forEach(function(value) {
                test.assertEqual(TypeUtil.toType(value), "array",
                    "Assert toType returns 'array' for value - value:" + value);
            });
            this.testBooleans.forEach(function(value) {
                test.assertEqual(TypeUtil.toType(value), "boolean",
                    "Assert toType returns 'boolean' for value - value:" + value);
            });
            this.testDates.forEach(function(value) {
                test.assertEqual(TypeUtil.toType(value), "date",
                    "Assert toType returns 'date' for value - value:" + value);
            });
            this.testFunctions.forEach(function(value) {
                test.assertEqual(TypeUtil.toType(value), "function",
                    "Assert toType returns 'function' for value - value:" + value);
            });
            this.testNumbers.forEach(function(value) {
                test.assertEqual(TypeUtil.toType(value), "number",
                    "Assert toType returns 'number' for value - value:" + value);
            });
            this.testObjects.forEach(function(value) {
                test.assertEqual(TypeUtil.toType(value), "object",
                        "Assert toType returns 'object' for value:" + value);
            });
            this.testRegExps.forEach(function(value) {
                test.assertEqual(TypeUtil.toType(value), "regexp",
                        "Assert toType returns 'regexp' for value:" + value);
            });
            this.testStrings.forEach(function(value) {
                test.assertEqual(TypeUtil.toType(value), "string",
                    "Assert toType returns 'string' for value - value:" + value);
            });

            test.assertEqual(TypeUtil.toType(this.testNull), "null",
                "Assert null returns type 'null'");
            test.assertEqual(TypeUtil.toType(this.testUndefined), "undefined",
                "Assert null returns type 'undefined'");
        }
    };

    /**
     *
     */
    var typeUtilIsObjectLikeTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {

            this.testNotObjectLike = [
                null,
                undefined,
                "some string",
                123,
                0,
                -123,
                123.1,
                -123.1
            ];
            this.testObjectLike    = [
                new String('abc'),
                new Number(123),
                [],
                {},
                new Object()
            ];
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testNotObjectLike.forEach(function(notObjectLike) {
                test.assertFalse(TypeUtil.isObjectLike(notObjectLike),
                    "Assert non object like value '" + notObjectLike + "' is not object like");
            });
            this.testObjectLike.forEach(function(objectLike) {
                test.assertTrue(TypeUtil.isObjectLike(objectLike),
                    "Assert object like value '" + objectLike + "' is object like");
            });
        }
    };

    /**
     *
     */
    var typeUtilIsNaNTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testNotNaN = [
                null,
                undefined,
                "some string",
                123,
                0,
                -123,
                123.1,
                -123.1,
                new Number(0),
                new Number(123)
            ];
            this.testNaN    = NaN;
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testNotNaN.forEach(function(notNaN) {
                test.assertFalse(TypeUtil.isNaN(notNaN),
                    "Assert non NaN value '" + notNaN + "' is not NaN");
            });
            test.assertTrue(TypeUtil.isNaN(this.testNaN),
                "Assert isNaN returns true for NaN");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(typeComparisonTest).with(
        test().name("TypeUtil - comparison test")
    );
    bugmeta.tag(typeUtilToTypeTest).with(
        test().name("TypeUtil - #toType test")
    );
    bugmeta.tag(typeUtilIsNaNTest).with(
        test().name("TypeUtil - #isNaN test")
    );
    bugmeta.tag(typeUtilIsObjectLikeTest).with(
        test().name("TypeUtil - #isObjectLike test")
    );
});
