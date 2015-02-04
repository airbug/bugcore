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
//@Require('IdGenerator')
//@Require('Obj')
//@Require('ObjectUtil')
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
    var IdGenerator     = bugpack.require('IdGenerator');
    var Obj             = bugpack.require('Obj');
    var ObjectUtil      = bugpack.require('ObjectUtil');
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
     * This tests
     * 1) The static doesPropertyExist method of the Obj class
     * 2) Basic doesPropertyExist check
     */
    var objectUtilDoesPropertyExistBasicTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testObject = {
                prop1: "value1"
            }
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(ObjectUtil.doesPropertyExist(this.testObject, "prop1"), true,
                "Assert .doesPropertyExist() check returns true for 'prop1'");
            test.assertEqual(ObjectUtil.doesPropertyExist(this.testObject, "prop2"), false,
                "Assert .doesPropertyExist() check returns false for 'prop2'");
        }
    };

    /**
     * This tests...
     * 1) That ObjectUtil.doesPropertyExist check returns true when the property has been defined as an undefined value
     */
    var objectUtilDoesPropertyExistUndefinedValueTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testObject = {
                prop1: undefined
            }
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(ObjectUtil.doesPropertyExist(this.testObject, "prop1"), true,
                "Assert .doesPropertyExist() check returns true for 'prop1'");
            test.assertEqual(ObjectUtil.doesPropertyExist(this.testObject, "prop2"), false,
                "Assert .doesPropertyExist() check returns false for 'prop2'");
        }
    };

    /**
     * This tests...
     * 1) That ObjectUtil.findProperty returns expected values when they're found
     * 2) that ObjectUtil.findProperty() returns undefined when nothing was found
     */
    var objectUtilFindPropertyBasicTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testObject = {
                prop1: "value1",
                prop2: {
                    subProp1: "value2"
                }
            };
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(ObjectUtil.findProperty(this.testObject, "prop1"), "value1",
                "Assert first level property is found");
            test.assertEqual(ObjectUtil.findProperty(this.testObject, "prop2"), this.testObject.prop2,
                "Assert object was returned");
            test.assertEqual(ObjectUtil.findProperty(this.testObject, "prop2.subProp1"), "value2",
                "Assert sub properties are correctly returned");
        }
    };

    /**
     * This tests...
     * 1) That ObjectUtil.findProperty returns undefined when given a built in property
     */
    var objectUtilFindPropertyBuiltInPropertyIgnoredTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.builtInProperties = [
                "eval",
                "hasOwnProperty",
                "isPrototypeOf",
                "propertyIsEnumerable",
                "toLocaleString",
                "toSource",
                "toString",
                "unwatch",
                "valueOf",
                "watch"
            ];
            this.testObject = {};
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            this.builtInProperties.forEach(function(builtInProperty) {
                test.assertEqual(ObjectUtil.findProperty(_this.testObject, builtInProperty), undefined,
                        "Assert .findProperty() returns undefined for built in property '" + builtInProperty + "'");
            });
        }
    };

    /**
     * This tests..
     * 1) That the ObjectUtil.forIn function correctly iterates over an object and sets the context correctly
     */
    var objectUtilForInIterationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testObject = {
                prop1: "value1",
                prop2: "value2",
                prop3: "value3"
            };
            this.testContext = {
                contextTrue: true
            };
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var iteratedProps = [];
            var iteratedValues = [];
            ObjectUtil.forIn(this.testObject, function(prop, value) {
                iteratedProps.push(prop);
                iteratedValues.push(value);
                test.assertTrue(this.contextTrue,
                    "Assert that we are executing within the correct context");
            }, this.testContext);

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
     * 1) That the forIn function correctly iterates over an object in IE8
     * 2) Don't enum properties are not correctly iterated when they are overridden in IE8
     */
    var objectUtilForInIterationDontEnumPropertiesTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testObject = {
                prop1: "value1",
                prop2: "value2",
                prop3: "value3"
            };
            ObjectUtil.hasOwnProperty = function(prop) {
                if (prop === 'toString') {
                    return true;
                } else {
                    return this.hasOwnProperty(prop);
                }
            };
            this.originalIsDontEnumSkipped = ObjectUtil.isDontEnumSkipped;
            ObjectUtil.isDontEnumSkipped = true;
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var iteratedProps = [];
            var iteratedValues = [];
            ObjectUtil.forIn(this.testObject, function(prop, value) {
                iteratedProps.push(prop);
                iteratedValues.push(value);
            });

            test.assertTrue((iteratedProps.length === 4),
                "Assert we iterated over 4 properties");
            test.assertTrue((iteratedValues.length === 4),
                "Assert we iterated over 4 values");

            var expectedProps = [
                "prop1",
                "prop2",
                "prop3",
                "toString"
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
        },


        // Tear Down Test
        //-------------------------------------------------------------------------------

        tearDown: function() {
            ObjectUtil.hasOwnProperty = Object.prototype.hasOwnProperty;
            ObjectUtil.isDontEnumSkipped = this.originalIsDontEnumSkipped;
        }
    };

    var objectUtilIsEmptyTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.emptyObject = {};
            this.notEmptyObject = {
                propertyx: "x"
            };
            this.notEmptyObjectNull = {
                null: ""
            };
            this.notEmptyObjectString = {
                "": null
            };
        },

        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(ObjectUtil.isEmpty(this.emptyObject), true,
                "Assert isEmpty returns true for an empty object");
            test.assertEqual(ObjectUtil.isEmpty(this.notEmptyObject), false,
                "Assert isEmpty returns false for a non empty object");
            test.assertEqual(ObjectUtil.isEmpty(this.notEmptyObjectNull), false,
                "Assert isEmpty returns false for a non empty object with a null only key");
            test.assertEqual(ObjectUtil.isEmpty(this.notEmptyObjectString), false,
                "Assert isEmpty returns false for a non empty object with an empty string only key");
        }
    };

    var objectUtilIsEqualTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.baseObject = {
                a: "value1",
                null: "value2",
                "": "value3"
            };
            this.equalObject = {
                a: "value1",
                null: "value2",
                "": "value3"
            };
            this.notEqualObjectMissingKey = {
                a: "value1",
                null: "value2"
            };
            this.notEqualObjectExtraKey = {
                a: "value1",
                b: "value1",
                null: "value2",
                "": "value3"
            };
            this.notEqualObjectDifferentValue = {
                a: "value4",
                null: "value2",
                "": "value3"
            };
        },

        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(ObjectUtil.isEqual(this.baseObject, this.equalObject), true,
                "Assert isEqual returns true for an equal object");
            test.assertEqual(ObjectUtil.isEqual(this.baseObject, this.baseObject), true,
                "Assert isEqual returns true for the same object object");
            test.assertEqual(ObjectUtil.isEqual(this.baseObject, this.notEqualObjectMissingKey), false,
                "Assert isEqual returns false for an object that is missing a key");
            test.assertEqual(ObjectUtil.isEqual(this.baseObject, this.notEqualObjectExtraKey), false,
                "Assert isEqual returns false for an object that has an extra key");
            test.assertEqual(ObjectUtil.isEqual(this.baseObject, this.notEqualObjectDifferentValue), false,
                "Assert isEqual returns false for an object with a different value");
        }
    };

    var objectUtilMergeTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.from = {
                propertya: "a",
                propertyb: "b",
                propertyc: "c"
            };
            this.into = {
                propertyx: "x",
                propertyy: "y",
                propertyz: "z"
            };
        },

        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var returnedObj = ObjectUtil.merge(this.from, this.into);
            test.assertEqual(returnedObj, this.into,
                "Assert the object returned by ObjectUtil.merge is the object given as the second parameter");
            test.assertTrue( this.into.propertya === "a" && this.into.propertyb === "b" && this.into.propertyc === "c" &&
                    this.into.propertyx === "x" && this.into.propertyy === "y" && this.into.propertyz === "z",
                "Assert that the into object has all properties from itself and from the from object");
        }
    };

    var objectUtilSetPropertyTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.propertyQuery  = "a.b";
            this.testObject     = {};
            this.testValue      = "testValue";
        },

        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            ObjectUtil.setProperty(this.testObject, this.propertyQuery, this.testValue);
            test.assertTrue(TypeUtil.isObject(this.testObject),
                "Assert testObject is still an object");
            test.assertTrue(TypeUtil.isObject(this.testObject.a),
                "Assert testObject.a was created and is an object");
            test.assertEqual(this.testObject.a.b, this.testValue,
                "Assert testObject.a.b was set to the testValue");
        }
    };

    var objectUtilPropertyIterationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function (test) {
            this.testObj = new Obj();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function (test) {
            ObjectUtil.forIn(this.testObj, function(propertyName, propertyValue) {
                test.assertTrue(propertyName !== "_internalId",
                    "Assert ._internalId is not iterable");
                test.assertTrue(propertyName !== "_hashCode",
                    "Assert ._hashCode is not iterable");
                test.assertTrue(propertyName !== "_hashCode",
                    "Assert ._class is not iterable");
            })
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(objectUtilDoesPropertyExistBasicTest).with(
        test().name("ObjectUtil - .doesPropertyExist() basic test")
    );
    bugmeta.tag(objectUtilDoesPropertyExistUndefinedValueTest).with(
        test().name("ObjectUtil - .doesPropertyExist() undefined value test")
    );
    bugmeta.tag(objectUtilFindPropertyBasicTest).with(
        test().name("ObjectUtil - .findProperty() basic test")
    );
    bugmeta.tag(objectUtilFindPropertyBuiltInPropertyIgnoredTest).with(
        test().name("ObjectUtil - .findProperty() built in property ignored test")
    );
    bugmeta.tag(objectUtilForInIterationTest).with(
        test().name("ObjectUtil - .forIn() iteration test")
    );
    bugmeta.tag(objectUtilForInIterationDontEnumPropertiesTest).with(
        test().name("ObjectUtil - .forIn() iteration of don't enum properties test")
    );
    bugmeta.tag(objectUtilIsEmptyTest).with(
        test().name("ObjectUtil - .isEmpty Test")
    );
    bugmeta.tag(objectUtilIsEqualTest).with(
        test().name("ObjectUtil - .isEqual Test")
    );
    bugmeta.tag(objectUtilMergeTest).with(
        test().name("ObjectUtil - .merge Test")
    );
    bugmeta.tag(objectUtilSetPropertyTest).with(
        test().name("ObjectUtil - .setProperty() Test")
    );
    bugmeta.tag(objectUtilPropertyIterationTest).with(
        test().name("ObjectUtil - property iteration Test")
    );
});
