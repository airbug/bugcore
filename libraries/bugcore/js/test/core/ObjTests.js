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
     * 1) Instantiation of a basic Obj
     * 2) That the getClass() value is Obj when an Obj is instantiated
     */
    var objInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testObject1 = new Obj();
            this.testObject2 = new Obj();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testObject1.getClass().getConstructor(), Obj,
                "Assert object1's class's Constructor is Obj");
            test.assertEqual(this.testObject2.getClass().getConstructor(), Obj,
                "Assert object2's class's constructor is Obj");
            test.assertTrue(this.testObject1.getInternalId(),
                "Assert object1's internalId is defined");
            test.assertTrue(this.testObject2.getInternalId(),
                "Assert object2's internalId is defined");
            test.assertNotEqual(this.testObject1.getInternalId(), this.testObject2.getInternalId(),
                "Assert id of both objects are different");
        }
    };

    /**
     * This tests
     * 1) The hashCode method of an instantiated Obj
     * 2) The static hashCode method of the Obj class
     * 3) That the hashCode is the same when run multiple times
     * 4) That the Obj.hashCode and the instantiated object hashCode match
     */
    var objHashCodeTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testObject = new Obj();
            this.testObjectHashCode = this.testObject.hashCode();
            this.testStaticObjectHashCode = Obj.hashCode(this.testObject);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {

            // NOTE BRN: There is no guarantee that the hash codes of two different objects are different. But we can
            // verify that they are numeric at least.

            test.assertTrue(TypeUtil.isNumber(this.testObjectHashCode),
                "Assert object's hash code is numeric");
            test.assertTrue(TypeUtil.isNumber(this.testObjectHashCode),
                "Assert value returned from Obj.hashCode is numeric");
            test.assertEqual(this.testObject.hashCode(), this.testObjectHashCode,
                "Assert object's hash code is the same when run multiple times");
            test.assertEqual(this.testObjectHashCode, this.testStaticObjectHashCode,
                "Assert Obj.hashCode and the instantiated object hashCode match");
        }
    };

    /**
     * This tests
     * 1) The static equals method of the Obj class
     */
    var objEqualsTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testObject1 = new Obj();
            this.testObject2 = new Obj();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var time = (new Date()).getTime();
            test.assertTrue(Obj.equals("value1", "value1"),
                "Assert equals returns true for two matching strings");
            test.assertTrue(Obj.equals(123, 123),
                "Assert equals returns true for two matching numbers");
            test.assertTrue(Obj.equals(0, 0),
                "Assert equals returns true for two 0 numbers");
            test.assertTrue(Obj.equals(null, null),
                "Assert equals returns true for two null values");
            test.assertTrue(Obj.equals(undefined, undefined),
                "Assert equals returns true for two undefined values");
            test.assertTrue(Obj.equals(this.testObject1, this.testObject1),
                "Assert two of the same Obj instance are equal");
            test.assertTrue(Obj.equals(new String("abc123"), "abc123"),
                "Assert equals returns true for a string object and string literal that are the same string");
            test.assertTrue(Obj.equals(new Number(123), 123),
                "Assert equals returns true for number object and number literal that are the same number");
            test.assertTrue(Obj.equals(new Number(123), new Number(123)),
                "Assert equals returns true for two number objects that are the same number");
            test.assertTrue(Obj.equals(new Boolean(true), new Boolean(true)),
                "Assert equals returns true for two Boolean objects that are the same value");
            test.assertTrue(Obj.equals(new Date(time), new Date(time)),
                "Assert equals returns true for two Dates that are the same time");
            test.assertFalse(Obj.equals(this.testObject1, this.testObject2),
                "Assert two different Obj instances are not equal");
        }
    };

    /**
     * This tests
     * 1) The static clone method of the Obj class
     * 2) Cloning an Obj (shallow)
     */
    var objCloneObjShallowTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testObj        = new Obj();
            this.testSubObject  = {};
            this.testObj.someValue =  "testValue";
            this.testObj.subObject = this.testSubObject;
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var cloneObj = Obj.clone(this.testObj);
            test.assertNotEqual(cloneObj, this.testObj,
                "Assert that the clone Obj does not equal the original Obj");
            test.assertEqual(cloneObj.testValue, this.testObj.testValue,
                "Assert that testValue was copied to the Obj clone");
            test.assertTrue(Class.doesExtend(cloneObj, Obj),
                "Assert that cloneObj is an instance of Obj");
            test.assertEqual(cloneObj.subObject, this.testSubObject,
                "Assert that the subObject has not been cloned");
        }
    };

    /**
     * This tests
     * 1) The static clone method of the Obj class
     * 2) Cloning an object literal (shallow)
     */
    var objCloneObjectLiteralShallowTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testValue      = "testValue";
            this.testSubArray   = [];
            this.genericObject  = {
                testValue: this.testValue,
                subArray: this.testSubArray
            };
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var cloneGenericObject = Obj.clone(this.genericObject);
            test.assertNotEqual(cloneGenericObject, this.genericObject,
                "Assert the cloned generic object and the original generic object are not equal.");
            test.assertEqual(cloneGenericObject.testValue, this.testValue,
                "Assert the values were copied from the original generic object to the cloned generic object");
            test.assertEqual(cloneGenericObject.subArray, this.testSubArray,
                "Assert the subArray has not been cloned");
        }
    };

    /**
     * This tests
     * 1) The static clone method of the Obj class
     * 2) Cloning a Date
     */
    var objCloneDateTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testDate = new Date(1);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var cloneDateObject = Obj.clone(this.testDate);
            test.assertTrue(Class.doesExtend(cloneDateObject, Date),
                "Assert that the clone is an instance of Date");
            test.assertTrue(cloneDateObject !== this.testDate,
                "Assert that the Date instances are not equal");
            test.assertEqual(cloneDateObject, this.testDate,
                "Assert that the Date values are equal");
        }
    };

    /**
     * This tests
     * 1) The static clone method of the Obj class
     * 2) Values that should be passed through
     */
    var objClonePassThroughTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.valuesThatPassThrough = [
                "",
                "string",
                0,
                0.123,
                123,
                true,
                false,
                new String("another string"),
                new Date(0)
            ]
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.valuesThatPassThrough.forEach(function(passThroughValue) {
                var valueClone = Obj.clone(passThroughValue);
                test.assertEqual(valueClone, passThroughValue,
                    "Assert value " + passThroughValue + " passed through the clone function and simply returned the " +
                        "original value");
            })
        }
    };

    var objEnsureInternalIdTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;

            this.NewClass = Class.extend(Obj, {
                _constructor: function() {

                    IdGenerator.ensureId(this);
                    this._super();
                }
            });

            this.testFunction = function() {
                new _this.NewClass();
            }
        },

        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertNotThrows(this.testFunction,
                "Assert no error is thrown when the _internalId has already been set");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(objInstantiationTest).with(
        test().name("Obj - instantiation test")
    );
    bugmeta.tag(objHashCodeTest).with(
        test().name("Obj - hashCode test")
    );
    bugmeta.tag(objEqualsTest).with(
        test().name("Obj - #equals test")
    );
    bugmeta.tag(objCloneObjShallowTest).with(
        test().name("Obj - #clone() Obj shallow test")
    );
    bugmeta.tag(objCloneDateTest).with(
        test().name("Obj - #clone() Date test")
    );
    bugmeta.tag(objCloneObjectLiteralShallowTest).with(
        test().name("Obj - #clone object literal shallow test")
    );
    bugmeta.tag(objClonePassThroughTest).with(
        test().name("Obj - #clone pass through test")
    );
    bugmeta.tag(objEnsureInternalIdTest).with(
        test().name("Obj - internalId already defined test")
    );
});
