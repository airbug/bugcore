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
     * 1) The static hasProperty method of the Obj class
     * 2) Basic hasProperty check
     */
    var objectUtilHasPropertyBasicTest = {

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
            test.assertEqual(ObjectUtil.hasProperty(this.testObject, "prop1"), true,
                "Assert .hasProperty() check returns true for 'prop1'");
            test.assertEqual(ObjectUtil.hasProperty(this.testObject, "prop2"), false,
                "Assert .hasProperty() check returns false for 'prop2'");
        }
    };

    /**
     * This tests
     * 1) hasProperty returns true when a property has been set to undefined
     */
    var objectUtilHasPropertyUndefinedValueTest = {

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
            test.assertEqual(ObjectUtil.hasProperty(this.testObject, "prop1"), true,
                "Assert .hasProperty() check returns true for 'prop1' with undefined value");
        }
    };

    /**
     * This tests
     * 1) The static hasNestedProperty method of the Obj class
     * 2) Basic hasNestedProperty check
     */
    var objectUtilHasNestedPropertyBasicTest = {

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
            test.assertEqual(ObjectUtil.hasNestedProperty(this.testObject, "prop1"), true,
                "Assert .hasNestedProperty() check returns true for 'prop1'");
            test.assertEqual(ObjectUtil.hasNestedProperty(this.testObject, "prop2"), false,
                "Assert .hasNestedProperty() check returns false for 'prop2'");
        }
    };

    /**
     * This tests...
     * 1) That ObjectUtil.hasNestedProperty check returns true when the property has been defined as an undefined value
     */
    var objectUtilHasNestedPropertyUndefinedValueTest = {

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
            test.assertEqual(ObjectUtil.hasNestedProperty(this.testObject, "prop1"), true,
                "Assert .hasNestedProperty() check returns true for 'prop1'");
            test.assertEqual(ObjectUtil.hasNestedProperty(this.testObject, "prop2"), false,
                "Assert .hasNestedProperty() check returns false for 'prop2'");
        }
    };

    /**
     * This tests...
     * 1) That ObjectUtil.hasNestedProperty check returns true when the property is an inherited property
     */
    var objectUtilHasNestedPropertyInheritedPropertyTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testConstructor = function() {};
            this.testConstructor.prototype = {
                inheritedProperty: "inheritedProperty"
            };
            this.testObject = new this.testConstructor();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(ObjectUtil.hasNestedProperty(this.testObject, "inheritedProperty"), true,
                "Assert .hasNestedProperty() check returns true for inherited property");
        }
    };

    /**
     * This tests...
     * 1) That ObjectUtil.hasNestedProperty({own:true}) check returns FALSE when the property is an inherited property
     */
    var objectUtilHasOwnNestedPropertyInheritedPropertyTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testConstructor = function() {};
            this.testConstructor.prototype = {
                inheritedProperty: "inheritedProperty"
            };
            this.testObject = new this.testConstructor();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(ObjectUtil.hasNestedProperty(this.testObject, "inheritedProperty", {own: true}), false,
                "Assert .hasNestedProperty({own: true})) check returns false for inherited property");
        }
    };

    /**
     * This tests...
     * 1) That ObjectUtil.getNestedProperty returns expected values when they're found
     * 2) that ObjectUtil.getNestedProperty() returns undefined when nothing was found
     */
    var objectUtilGetNestedPropertyBasicTest = {

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
            test.assertEqual(ObjectUtil.getNestedProperty(this.testObject, "prop1"), "value1",
                "Assert first level property is found");
            test.assertEqual(ObjectUtil.getNestedProperty(this.testObject, "prop2"), this.testObject.prop2,
                "Assert object was returned");
            test.assertEqual(ObjectUtil.getNestedProperty(this.testObject, "prop2.subProp1"), "value2",
                "Assert sub properties are correctly returned");
        }
    };

    /**
     * This tests...
     * 1) That ObjectUtil.getNestedProperty returns undefined when given a built in property
     */
    var objectUtilGetOwnNestedPropertyBuiltInPropertyIgnoredTest = {

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
                test.assertEqual(ObjectUtil.getNestedProperty(_this.testObject, builtInProperty, {own: true}), undefined,
                        "Assert .getNestedProperty({own: true}) returns undefined for built in property '" + builtInProperty + "'");
            });
        }
    };

    /**
     * This tests...
     * 1) That ObjectUtil.getNestedProperty returns native code when given a built in property
     */
    var objectUtilGetNestedPropertyBuiltInPropertyObservedTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.builtInProperties = [
                "hasOwnProperty",
                "isPrototypeOf",
                "propertyIsEnumerable",
                "toLocaleString",
                "toString",
                "valueOf"
            ];
            this.testObject = {};
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            this.builtInProperties.forEach(function(builtInProperty) {
                test.assertNotEqual(ObjectUtil.getNestedProperty(_this.testObject, builtInProperty), undefined,
                        "Assert .getNestedProperty() does not return undefined for built in property '" + builtInProperty + "'");
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
            var _this = this;
            this.testObject = {
                prop1: "value1",
                prop2: "value2",
                prop3: "value3"
            };
            this.originalHasProperty = ObjectUtil.hasProperty;
            ObjectUtil.hasProperty = function(prop) {
                if (prop === 'toString') {
                    return true;
                } else {
                    return _this.originalHasProperty(prop);
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
            ObjectUtil.hasProperty = this.originalHasProperty;
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

    /**
     * This tests..
     * 1) That the ObjectUtil.anyIn function correctly iterates over an object and sets the context correctly
     * 2) That anyIn ends when a truthy value is found
     * 3) That true is returned when anyIn finds a true value
     */
    var objectUtilAnyInIterationTest = {

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
            var _this = this;
            var iteratedProps = [];
            var iteratedValues = [];
            var result = ObjectUtil.anyIn(this.testObject, function(prop, value) {
                iteratedProps.push(prop);
                iteratedValues.push(value);
                test.assertTrue(this.contextTrue,
                    "Assert that we are executing within the correct context");
                return value === _this.testObject.prop2;
            }, this.testContext);

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

    var objectUtilAssignTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.from = {
                propertyA: "newA",
                propertyB: "b",
                propertyC: "c",
                subObject: {
                    subA: 'subA'
                },
                subArray: ['b']
            };
            this.into = {
                propertyA: 'a',
                propertyX: "x",
                propertyY: "y",
                propertyZ: "z",
                subObject: {
                    subB: 'subB'
                },
                subArray: ['a']
            };
        },

        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var returnedObj = ObjectUtil.assign(this.into, this.from);
            test.assertEqual(returnedObj, this.into,
                "Assert the object returned by ObjectUtil.assign is the object given as the first parameter");
            test.assertEqual(this.from.propertyA, "newA",
                "Assert that from.propertyA has not been modified");
            test.assertEqual(this.from.propertyX, undefined,
                "Assert that properties from into have not been moved to from object");
            test.assertEqual(this.into.propertyA, this.from.propertyA,
                "Assert that propertyA has been merged into object and has replaced original propertyA");
            test.assertEqual(this.into.propertyB, this.from.propertyB,
                "Assert that propertyB has been merged into object");
            test.assertEqual(this.into.propertyC, this.from.propertyC,
                "Assert that propertyC has been merged into object");
            test.assertEqual(this.into.propertyX, "x",
                "Assert that propertyX still exists on into object");
            test.assertEqual(this.into.propertyY, "y",
                "Assert that propertyY still exists on into object");
            test.assertEqual(this.into.propertyZ, "z",
                "Assert that propertyZ still exists on into object");
            test.assertEqual(this.into.subObject, this.from.subObject,
                "Assert that from.subObject has been assigned to into.subObject");
            test.assertEqual(this.into.subObject.subB, undefined,
                "Assert that into.subObject.subB no longer exists");
            test.assertEqual(this.into.subObject.subA, "subA",
                "Assert that into.subObject.subA now exists on into object");
            test.assertEqual(this.into.subArray, this.from.subArray,
                "Assert that from.subArray has been assigned to into.subArray");
            test.assertEqual(this.into.subArray[0], "b",
                "Assert that subArray[0] has been replaced with value on from object");
        }
    };

    var objectUtilMergeTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.from = {
                propertyA: "newA",
                propertyB: "b",
                propertyC: "c",
                subObject: {
                    subA: 'subA'
                },
                subArray: ['b']
            };
            this.into = {
                propertyA: 'a',
                propertyX: "x",
                propertyY: "y",
                propertyZ: "z",
                subObject: {
                    subB: 'subB'
                },
                subArray: ['a']
            };
        },

        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var returnedObj = ObjectUtil.merge(this.into, this.from);
            test.assertEqual(returnedObj, this.into,
                "Assert the object returned by ObjectUtil.merge is the object given as the first parameter");
            test.assertEqual(this.from.propertyA, "newA",
                "Assert that from.propertyA has not been modified");
            test.assertEqual(this.from.propertyX, undefined,
                "Assert that properties from into have not been moved to from object");
            test.assertEqual(this.into.propertyA, this.from.propertyA,
                "Assert that propertyA has been merged into object and has replaced original propertyA");
            test.assertEqual(this.into.propertyB, this.from.propertyB,
                "Assert that propertyB has been merged into object");
            test.assertEqual(this.into.propertyC, this.from.propertyC,
                "Assert that propertyC has been merged into object");
            test.assertEqual(this.into.propertyX, "x",
                "Assert that propertyX still exists on into object");
            test.assertEqual(this.into.propertyY, "y",
                "Assert that propertyY still exists on into object");
            test.assertEqual(this.into.propertyZ, "z",
                "Assert that propertyZ still exists on into object");
            test.assertEqual(this.into.subObject.subA, "subA",
                "Assert that subObject.subA has been merged into object");
            test.assertEqual(this.into.subObject.subB, "subB",
                "Assert that subObject.subB still exists on into object");
            test.assertEqual(this.into.subArray[0], "b",
                "Assert that subArray[0] has been replaced with value on from object");
        }
    };

    var objectUtilOmitTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.object = {
                propertyA: "a",
                propertyB: "b",
                propertyC: "c"
            };
            this.properties = ['propertyA'];
        },

        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var returnedObj = ObjectUtil.omit(this.object, this.properties);
            test.assertNotEqual(returnedObj, this.object,
                "Assert the object returned by ObjectUtil.pick is not the object given as the first parameter");
            test.assertEqual(returnedObj.propertyA, undefined,
                "Assert propertyA was NOT passed to returnedObj");
            test.assertEqual(returnedObj.propertyB, this.object.propertyB,
                "Assert propertyB was passed to returnedObj");
            test.assertEqual(returnedObj.propertyC, this.object.propertyC,
                "Assert propertyC was passed to returnedObj");
        }
    };

    var objectUtilPickTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.object = {
                propertyA: "a",
                propertyB: "b",
                propertyC: "c"
            };
            this.properties = ['propertyA'];
        },

        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var returnedObj = ObjectUtil.pick(this.object, this.properties);
            test.assertNotEqual(returnedObj, this.object,
                "Assert the object returned by ObjectUtil.pick is not the object given as the first parameter");
            test.assertEqual(returnedObj.propertyA, this.object.propertyA,
                "Assert propertyA was passed to returnedObj");
            test.assertEqual(returnedObj.propertyB, undefined,
                "Assert propertyB was NOT passed to returnedObj");
            test.assertEqual(returnedObj.propertyC, undefined,
                "Assert propertyC was NOT passed to returnedObj");
        }
    };

    var objectUtilSetNestedPropertyTest = {

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
            ObjectUtil.setNestedProperty(this.testObject, this.propertyQuery, this.testValue);
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

    bugmeta.tag(objectUtilHasPropertyBasicTest).with(
        test().name("ObjectUtil - .hasProperty() basic test")
    );
    bugmeta.tag(objectUtilHasPropertyUndefinedValueTest).with(
        test().name("ObjectUtil - .hasProperty() undefined value test")
    );
    bugmeta.tag(objectUtilHasNestedPropertyBasicTest).with(
        test().name("ObjectUtil - .hasNestedProperty() basic test")
    );
    bugmeta.tag(objectUtilHasNestedPropertyUndefinedValueTest).with(
        test().name("ObjectUtil - .hasNestedProperty() undefined value test")
    );
    bugmeta.tag(objectUtilHasNestedPropertyInheritedPropertyTest).with(
        test().name("ObjectUtil - .hasNestedProperty() inherited property test")
    );
    bugmeta.tag(objectUtilHasOwnNestedPropertyInheritedPropertyTest).with(
        test().name("ObjectUtil - .hasNestedProperty({own: true}) inherited property test")
    );
    bugmeta.tag(objectUtilGetNestedPropertyBasicTest).with(
        test().name("ObjectUtil - .getNestedProperty() basic test")
    );
    bugmeta.tag(objectUtilGetNestedPropertyBuiltInPropertyObservedTest).with(
        test().name("ObjectUtil - .getNestedProperty() built in property observed test")
    );
    bugmeta.tag(objectUtilGetOwnNestedPropertyBuiltInPropertyIgnoredTest).with(
        test().name("ObjectUtil - .getNestedProperty({own: true}) built in property ignored test")
    );
    bugmeta.tag(objectUtilForInIterationTest).with(
        test().name("ObjectUtil - .forIn() iteration test")
    );
    /*bugmeta.tag(objectUtilForInIterationDontEnumPropertiesTest).with(
        test().name("ObjectUtil - .forIn() iteration of don't enum properties test")
    );*/
    bugmeta.tag(objectUtilIsEmptyTest).with(
        test().name("ObjectUtil - .isEmpty Test")
    );
    bugmeta.tag(objectUtilIsEqualTest).with(
        test().name("ObjectUtil - .isEqual Test")
    );
    bugmeta.tag(objectUtilAnyInIterationTest).with(
        test().name("ObjectUtil - .anyIn() iteration test")
    );
    bugmeta.tag(objectUtilAssignTest).with(
        test().name("ObjectUtil - .assign Test")
    );
    bugmeta.tag(objectUtilMergeTest).with(
        test().name("ObjectUtil - .merge Test")
    );
    bugmeta.tag(objectUtilOmitTest).with(
        test().name("ObjectUtil - .omit Test")
    );
    bugmeta.tag(objectUtilPickTest).with(
        test().name("ObjectUtil - .pick Test")
    );
    bugmeta.tag(objectUtilSetNestedPropertyTest).with(
        test().name("ObjectUtil - .setNestedProperty() Test")
    );
    bugmeta.tag(objectUtilPropertyIterationTest).with(
        test().name("ObjectUtil - property iteration Test")
    );
});
