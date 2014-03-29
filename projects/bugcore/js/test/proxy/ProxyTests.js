//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Proxy')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Proxy               = bugpack.require('Proxy');
var BugDouble           = bugpack.require('bugdouble.BugDouble');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta             = BugMeta.context();
var test                = TestAnnotation.test;
var spyOnObject         = BugDouble.spyOnObject;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var proxyDefaultsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {

        this.proxiedBasicObject = {
            method: function() {
                return 1;
            }
        };
        this.proxiedBasicObjectSpy = spyOnObject(this.proxiedBasicObject);
        this.proxy1 = {};
        Proxy.proxy(this.proxy1, this.proxiedBasicObject, [
            "method"
        ]);

        this.proxiedFunctionObject = function() {};
        this.proxiedFunctionObject.method = function() {
            return 1;
        };
        this.proxiedFunctionObjectSpy = spyOnObject(this.proxiedFunctionObject);
        this.proxy2 = {};
        Proxy.proxy(this.proxy2, this.proxiedFunctionObject, [
            "method"
        ]);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var result1 = this.proxy1.method();
        test.assertTrue(this.proxiedBasicObjectSpy.getSpy("method").wasCalled(),
            "Assert 'method' of the proxiedBasicObject was called");
        test.assertEqual(result1, 1,
            "Assert that the proxiedBasicObject method's return value was successfully returned");

        var result2 = this.proxy2.method();
        test.assertTrue(this.proxiedFunctionObjectSpy.getSpy("method").wasCalled(),
            "Assert 'method' of the proxiedFunctionObject was called");
        test.assertEqual(result2, 1,
            "Assert that the proxiedFunctionObject method's return value was successfully returned");
    }
};
bugmeta.annotate(proxyDefaultsTest).with(
    test().name("Proxy defaults test")
);

/**
 * This tests..
 * 1) That a proxy of a property on an object works correctly
 * 2) That a proxy of a property on a function works correctly
 */
var proxyPropertyTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {

        this.proxiedBasicObject = {
            property: {
                method: function() {
                    return 1;
                }
            }
        };
        this.proxiedBasicObjectPropertySpy = spyOnObject(this.proxiedBasicObject.property);
        this.proxy1 = {};
        Proxy.proxy(this.proxy1, Proxy.property(this.proxiedBasicObject, "property"), [
            "method"
        ]);

        var _this = this;
        this.proxiedBasicFunction = function() {};
        this.proxiedBasicFunction.property = {
            method: function() {
                return 2;
            }
        };
        this.proxiedBasicFunctionPropertySpy = spyOnObject(this.proxiedBasicFunction.property);
        this.proxy2 = {};
        Proxy.proxy(this.proxy2, Proxy.property(this.proxiedBasicFunction, "property"), [
            "method"
        ]);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var result1 = this.proxy1.method();
        test.assertTrue(this.proxiedBasicObjectPropertySpy.getSpy("method").wasCalled(),
            "Assert 'method' of the proxiedBasicObject.property was called");
        test.assertEqual(result1, 1,
            "Assert that the proxiedBasicObject.property method's return value was successfully returned");

        var result2 = this.proxy2.method();
        test.assertTrue(this.proxiedBasicFunctionPropertySpy.getSpy("method").wasCalled(),
            "Assert 'method' of the proxiedBasicFunction.property was called");
        test.assertEqual(result2, 2,
            "Assert that the proxiedBasicFunction.property method's return value was successfully returned");
    }
};
bugmeta.annotate(proxyPropertyTest).with(
    test().name("Proxy property test")
);

/*
var _this = this;
this.targetInstance = {
    method: function() {
        return 2;
    }
};
this.proxiedFunction = function() {
    return _this.targetInstance;
};
this.proxiedFunctionSpy = spyOnObject(this.targetInstance);
this.proxy2 = {};
Proxy.proxy(this.proxy2, this.proxiedFunction, [
    "method"
]);

 var result2 = this.proxy2.method();
 test.assertTrue(this.proxiedFunctionSpy.getSpy("method").wasCalled(),
 "Assert 'method' of the proxiedFunction was called");
 test.assertEqual(result2, 2,
 "Assert that the proxied proxiedFunction's return value was successfully returned");
*/

/**
 var _this = this;
 this.targetInstance = {
 method: function() {
 return 1;
 }
 };
 this.proxiedFunction = function() {
 return _this.targetInstance;
 };
 this.proxiedFunction.method = function() {};
 this.proxiedFunctionObjectSpy = spyOnObject(this.targetInstance);
 this.proxy2 = {};
 Proxy.proxy(this.proxy2, this.proxiedFunctionObject, [
 "method"
 ]);
 */
