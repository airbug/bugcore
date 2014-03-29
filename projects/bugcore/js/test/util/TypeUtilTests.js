//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Set')
//@Require('TypeUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('tests.TypeValueSetsHelper')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Set                     = bugpack.require('Set');
var TypeUtil                = bugpack.require('TypeUtil');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var TypeValueSetsHelper     = bugpack.require('tests.TypeValueSetsHelper');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


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
        TypeUtilTests.runTypeTest("array", test);
        TypeUtilTests.runTypeTest("boolean", test);
        TypeUtilTests.runTypeTest("function", test);
        TypeUtilTests.runTypeTest("null", test);
        TypeUtilTests.runTypeTest("number", test);
        TypeUtilTests.runTypeTest("object", test);
        TypeUtilTests.runTypeTest("string", test);
        TypeUtilTests.runTypeTest("undefined", test);
    }

};
bugmeta.annotate(typeComparisonTest).with(
    test().name("TypeUtil Comparison Test")
);

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
        if (type === "array") {
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
        this.testStrings.forEach(function(value) {
            test.assertEqual(TypeUtil.toType(value), "string",
                "Assert toType returns 'string' for value - value:" + value);
        });
        this.testObjects.forEach(function(value) {
            test.assertEqual(TypeUtil.toType(value), "object",
                "Assert toType returns 'object' for value:" + value);
        });
        test.assertEqual(TypeUtil.toType(this.testNull), "null",
            "Assert null returns type 'null'");
        test.assertEqual(TypeUtil.toType(this.testUndefined), "undefined",
            "Assert null returns type 'undefined'");
    }

};
bugmeta.annotate(typeUtilToTypeTest).with(
    test().name("TypeUtil - toType Test")
);
