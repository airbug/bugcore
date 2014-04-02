//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Func')
//@Require('TypeUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Func            = bugpack.require('Func');
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
 * 1) Func#bind static method
 */
var funcStaticBindTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this           = this;
        this.testObject     = {};
        this.testArgument   = "testArgument";
        this.testReturn     = "testReturn";
        this.testFunction   = function(testParam) {
            test.assertEqual(this, _this.testObject,
                "Assert that 'this' matches the testObject");
            test.assertEqual(testParam, _this.testArgument,
                "Assert that the testParam was set correctly");
            return _this.testReturn;
        };
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var boundFunction = Func.bind(this.testFunction, this.testObject);
        var returnedValue = boundFunction(this.testArgument);
        test.assertEqual(returnedValue, this.testReturn,
            "Assert that the testReturn value was correctly returned");
    }
};
bugmeta.annotate(funcStaticBindTest).with(
    test().name("Func - #bind test")
);
