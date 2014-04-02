//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('IdGenerator')
//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var IdGenerator     = bugpack.require('IdGenerator');
var Obj             = bugpack.require('Obj');
var TypeUtil        = bugpack.require('TypeUtil');
var BugMeta         = bugpack.require('bugmeta.BugMeta');
var TestAnnotation  = bugpack.require('bugunit-annotate.TestAnnotation');


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
        test.assertEqual(this.testObject1.getClass(), Obj,
            "Assert object1's class is Obj");
        test.assertEqual(this.testObject2.getClass(), Obj,
            "Assert object2's class is Obj");
        test.assertTrue(this.testObject1.getInternalId(),
            "Assert object1's internalId is defined");
        test.assertTrue(this.testObject2.getInternalId(),
            "Assert object2's internalId is defined");
        test.assertNotEqual(this.testObject1.getInternalId(), this.testObject2.getInternalId(),
            "Assert id of both objects are different");
    }
};
bugmeta.annotate(objInstantiationTest).with(
    test().name("Obj instantiation test")
);


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
bugmeta.annotate(objHashCodeTest).with(
    test().name("Obj hashCode test")
);


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
bugmeta.annotate(objEqualsTest).with(
    test().name("Obj - #equals test")
);


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
bugmeta.annotate(objCloneObjShallowTest).with(
    test().name("Obj - clone Obj shallow test")
);

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
bugmeta.annotate(objCloneObjectLiteralShallowTest).with(
    test().name("Obj - #clone object literal shallow test")
);

/**
 * This tests
 * 1) The static clone method of the Obj class
 * 2) Cloning a Date
 */
var objCloneDateTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testDate = new Date();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var cloneDateObject = Obj.clone(this.testDate);
        test.assertTrue(Class.doesExtend(cloneDateObject, Date),
            "Assert that the clone is an instance of Date");
        test.assertEqual(cloneDateObject, this.testDate,
            "Assert that the Dates are equal");
    }
};
bugmeta.annotate(objCloneDateTest).with(
    test().name("Obj - #clone Date test")
);

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
bugmeta.annotate(objClonePassThroughTest).with(
    test().name("Obj - #clone pass through test")
);

/**
 * This tests..
 * 1) That the forIn function correctly iterates over an object and sets the context correctly
 */
var objForInIterationTest = {

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
        Obj.forIn(this.testObject, function(prop, value) {
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
bugmeta.annotate(objForInIterationTest).with(
    test().name("Obj forIn iteration test")
);


/**
 * This tests..
 * 1) That the forIn function correctly iterates over an object in IE8
 * 2) dont enum properties are not correctly iterated when they are overridden in IE8
 */
var objForInIterationDontEnumPropertiesTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testObject = {
            prop1: "value1",
            prop2: "value2",
            prop3: "value3"
        };
        Obj.hasOwnProperty = function(prop) {
            if (prop === 'toString') {
                return true;
            } else {
                return this.hasOwnProperty(prop);
            }
        };
        this.originalIsDontEnumSkipped = Obj.isDontEnumSkipped;
        Obj.isDontEnumSkipped = true;
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var iteratedProps = [];
        var iteratedValues = [];
        Obj.forIn(this.testObject, function(prop, value) {
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
        Obj.hasOwnProperty = Object.prototype.hasOwnProperty;
        Obj.isDontEnumSkipped = this.originalIsDontEnumSkipped;
    }
};
bugmeta.annotate(objForInIterationDontEnumPropertiesTest).with(
    test().name("Obj forIn iteration of don't enum properties test")
);

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
bugmeta.annotate(objEnsureInternalIdTest).with(
    test().name("Obj internalId already defined test")
);

var objMergeTest = {

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
        var returnedObj = Obj.merge(this.from, this.into);
        test.assertEqual(returnedObj, this.into,
        "Assert the object returned by Obj.merge is the object given as the second parameter");
        test.assertTrue( this.into.propertya === "a" && this.into.propertyb === "b" && this.into.propertyc === "c" &&
            this.into.propertyx === "x" && this.into.propertyy === "y" && this.into.propertyz === "z",
            "Assert that the into object has all properties from itself and from the from object");
    }
};
bugmeta.annotate(objMergeTest).with(
    test().name("Obj - .merge Test")
);
