//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('ArgumentBug')
//@Require('ArgUtil')
//@Require('Bug')
//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgumentBug             = bugpack.require('ArgumentBug');
var ArgUtil                 = bugpack.require('ArgUtil');
var Bug                     = bugpack.require('Bug');
var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var TypeUtil                = bugpack.require('TypeUtil');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');


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
var argUtilToArrayTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testArg1       = "testArg1";
        this.testArg2       = 2;
        this.testFunction = function() {
            return ArgUtil.toArray(arguments);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var results = this.testFunction(this.testArg1, this.testArg2);
        test.assertTrue(TypeUtil.isArray(results),
            "Assert that ArgUtil returned an array");
        test.assertEqual(results[0], this.testArg1,
            "Assert that index 0 has testArg1");
        test.assertEqual(results[1], this.testArg2,
            "Assert that index 1 has testArg2");
    }

};
bugmeta.annotate(argUtilToArrayTest).with(
    test().name("ArgUtil - toArray test")
);


/**
 *
 */
var argUtilToArrayNoArgumentsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testFunction = function() {
            return ArgUtil.toArray(arguments);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var results = this.testFunction();
        test.assertTrue(TypeUtil.isArray(results),
            "Assert that ArgUtil returned an array");
        test.assertEqual(results.length, 0,
            "Assert that the array is empty");
    }

};
bugmeta.annotate(argUtilToArrayNoArgumentsTest).with(
    test().name("ArgUtil - toArray no arguments test")
);


/**
 *
 */
var argUtilProcessNoArgumentsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testFunction = function() {
            return ArgUtil.process(arguments, []);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var argsObject = this.testFunction();
        var properties = Obj.getProperties(argsObject);
        test.assertTrue(TypeUtil.isObject(argsObject),
            "Assert that ArgUtil returned an object");
        test.assertEqual(properties.length, 0,
            "Assert that returned argsObject is empty");
    }

};
bugmeta.annotate(argUtilProcessNoArgumentsTest).with(
    test().name("ArgUtil - #process no arguments test")
);


/**
 *
 */
var argUtilProcessNoDescriptionsThrowsBugTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testFunction = function() {
            return ArgUtil.process(arguments);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        test.assertThrows(function() {
            _this.testFunction();
        }, "Assert that running #process without a descriptions array throws a Bug");
    }

};
bugmeta.annotate(argUtilProcessNoDescriptionsThrowsBugTest).with(
    test().name("ArgUtil - #process no descriptions throws Bug test")
);


/**
 *
 */
var argUtilProcessOneArgumentSuccessTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testValue  = "testValue";
        this.testArgName   = "testArgName";
        this.testFunction = function() {
            return ArgUtil.process(arguments, [
                {name: _this.testArgName}
            ]);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var argsObject = this.testFunction(this.testValue);
        var properties = Obj.getProperties(argsObject);
        test.assertTrue(TypeUtil.isObject(argsObject),
            "Assert that ArgUtil returned an object");
        test.assertEqual(properties.length, 1,
            "Assert that returned argsObject has 1 property");
        test.assertEqual(argsObject.testArgName, this.testValue,
            "Assert that argsObject.testName is testValue")
    }

};
bugmeta.annotate(argUtilProcessOneArgumentSuccessTest).with(
    test().name("ArgUtil - #process one argument success test")
);


/**
 *
 */
var argUtilProcessMultipleArgumentsSuccessTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testValue1     = "testValue1";
        this.testArgName1   = "testArgName1";
        this.testValue2     = "testValue2";
        this.testArgName2   = "testArgName2";
        this.testValue3     = "testValue3";
        this.testArgName3   = "testArgName3";
        this.testFunction = function() {
            return ArgUtil.process(arguments, [
                {name: _this.testArgName1},
                {name: _this.testArgName2},
                {name: _this.testArgName3}
            ]);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var argsObject = this.testFunction(this.testValue1, this.testValue2, this.testValue3);
        var properties = Obj.getProperties(argsObject);
        test.assertTrue(TypeUtil.isObject(argsObject),
            "Assert that ArgUtil returned an object");
        test.assertEqual(properties.length, 3,
            "Assert that returned argsObject has 1 property");
        test.assertEqual(argsObject.testArgName1, this.testValue1,
            "Assert that argsObject.testArgName1 is testValue1");
        test.assertEqual(argsObject.testArgName2, this.testValue2,
            "Assert that argsObject.testArgName2 is testValue2");
        test.assertEqual(argsObject.testArgName3, this.testValue3,
            "Assert that argsObject.testArgName3 is testValue3");
    }

};
bugmeta.annotate(argUtilProcessMultipleArgumentsSuccessTest).with(
    test().name("ArgUtil - #process multiple argument success test")
);


/**
 *
 */
var argUtilProcessTooFewDescriptionsBugTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testValue1     = "testValue1";
        this.testArgName1   = "testArgName1";
        this.testValue2     = "testValue2";
        this.testArgName2   = "testArgName2";
        this.testValue3     = "testValue3";
        this.testFunction = function() {
            return ArgUtil.process(arguments, [
                {name: _this.testArgName1},
                {name: _this.testArgName2}
            ]);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        test.assertThrows(function() {
            _this.testFunction(_this.testValue1, _this.testValue2, _this.testValue3);
        }, "Assert that a Bug is thrown when there are fewer descriptions than arguments");
    }

};
bugmeta.annotate(argUtilProcessTooFewDescriptionsBugTest).with(
    test().name("ArgUtil - #process too few descriptions test")
);

/**
 *
 */
var argUtilProcessMultipleArgumentsOptionalArgSuccessTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testValue1     = "testValue1";
        this.testArgName1   = "testArgName1";
        this.testArgName2   = "testArgName2";
        this.testValue3     = "testValue3";
        this.testArgName3   = "testArgName3";
        this.testFunction = function() {
            return ArgUtil.process(arguments, [
                {name: _this.testArgName1},
                {name: _this.testArgName2, optional: true},
                {name: _this.testArgName3}
            ]);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var argsObject = this.testFunction(this.testValue1, this.testValue3);
        var properties = Obj.getProperties(argsObject);
        test.assertTrue(TypeUtil.isObject(argsObject),
            "Assert that ArgUtil returned an object");
        test.assertEqual(properties.length, 3,
            "Assert that returned argsObject has 3 properties");
        test.assertEqual(argsObject.testArgName1, this.testValue1,
            "Assert that argsObject.testArgName1 is testValue1");
        test.assertEqual(argsObject.testArgName2, undefined,
            "Assert that argsObject.testArgName2 is undefined");
        test.assertEqual(argsObject.testArgName3, this.testValue3,
            "Assert that argsObject.testArgName3 is testValue3")
    }

};
bugmeta.annotate(argUtilProcessMultipleArgumentsOptionalArgSuccessTest).with(
    test().name("ArgUtil - #process multiple arguments with optional arg success test")
);

/**
 *
 */
var argUtilProcessMultipleArgumentsOptionalArgArgMissingTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testValue1     = "testValue1";
        this.testArgName1   = "testArgName1";
        this.testArgName2   = "testArgName2";
        this.testArgName3   = "testArgName3";
        this.testFunction = function() {
            return ArgUtil.process(arguments, [
                {name: _this.testArgName1},
                {name: _this.testArgName2, optional: true},
                {name: _this.testArgName3}
            ]);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        test.assertThrows(function() {
            _this.testFunction(_this.testValue1);
        }, "Assert an error is thrown when there is a missing argument with an optional argument");
    }

};
bugmeta.annotate(argUtilProcessMultipleArgumentsOptionalArgArgMissingTest).with(
    test().name("ArgUtil - #process multiple arguments with optional arg and one missing arg test")
);

/**
 *
 */
var argUtilProcessMultipleArgumentsOptionalArgWitDefaultSuccessTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testValue1     = "testValue1";
        this.testArgName1   = "testArgName1";
        this.testArgName2   = "testArgName2";
        this.testDefault2   = "testDefault2";
        this.testValue3     = "testValue3";
        this.testArgName3   = "testArgName3";
        this.testFunction = function() {
            return ArgUtil.process(arguments, [
                {name: _this.testArgName1},
                {name: _this.testArgName2, optional: true, default: _this.testDefault2},
                {name: _this.testArgName3}
            ]);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var argsObject = this.testFunction(this.testValue1, this.testValue3);
        var properties = Obj.getProperties(argsObject);
        test.assertTrue(TypeUtil.isObject(argsObject),
            "Assert that ArgUtil returned an object");
        test.assertEqual(properties.length, 3,
            "Assert that returned argsObject has 3 properties");
        test.assertEqual(argsObject.testArgName1, this.testValue1,
            "Assert that argsObject.testArgName1 is testValue1");
        test.assertEqual(argsObject.testArgName2, this.testDefault2,
            "Assert that argsObject.testArgName2 is testDefault2");
        test.assertEqual(argsObject.testArgName3, this.testValue3,
            "Assert that argsObject.testArgName3 is testValue3")
    }

};
bugmeta.annotate(argUtilProcessMultipleArgumentsOptionalArgWitDefaultSuccessTest).with(
    test().name("ArgUtil - #process multiple arguments with optional arg and default success test")
);

/**
 *
 */
var argUtilProcessMultipleArgumentsNotOptionalOneArgUndefinedTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testValue1     = "testValue1";
        this.testArgName1   = "testArgName1";
        this.testValue2     = undefined;
        this.testArgName2   = "testArgName2";
        this.testValue3     = "testValue3";
        this.testArgName3   = "testArgName3";
        this.testFunction = function() {
            return ArgUtil.process(arguments, [
                {name: _this.testArgName1, optional: false, type: "string"},
                {name: _this.testArgName2, optional: false, type: "string"},
                {name: _this.testArgName3, optional: false, type: "string"}
            ]);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        var throwable = test.assertThrows(function() {
            _this.testFunction(_this.testValue1, _this.testValue2, _this.testValue3);
        }, "Assert an error is thrown when there is a missing argument with an optional argument");
        test.assertTrue(Class.doesExtend(throwable, ArgumentBug),
            "Assert that throwable is an instance of ArgumentBug");
        if (Class.doesExtend(throwable, ArgumentBug)) {
            throwable = /** @type {ArgumentBug} */(throwable);
            test.assertEqual(throwable.getArgName(), this.testArgName2,
                "Assert argName of throwable was '" + this.testArgName2 + "'");
        }
    }
};
bugmeta.annotate(argUtilProcessMultipleArgumentsNotOptionalOneArgUndefinedTest).with(
    test().name("ArgUtil - #process multiple arguments with non optional args and one undefined arg test")
);

/**
 *
 */
var argUtilProcessMultipleArgumentsOneOptionalOneArgUndefinedTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testValue1     = "testValue1";
        this.testArgName1   = "testArgName1";
        this.testValue2     = undefined;
        this.testArgName2   = "testArgName2";
        this.testArgName3   = "testArgName3";
        this.testFunction = function() {
            return ArgUtil.process(arguments, [
                {name: _this.testArgName1, optional: false, type: "string"},
                {name: _this.testArgName2, optional: false, type: "string"},
                {name: _this.testArgName3, optional: true, type: "string"}
            ]);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        var throwable = test.assertThrows(function() {
            _this.testFunction(_this.testValue1, _this.testValue2);
        }, "Assert an error is thrown when there is a missing argument with an optional argument");
        test.assertTrue(Class.doesExtend(throwable, ArgumentBug),
            "Assert that throwable is an instance of ArgumentBug");
        if (Class.doesExtend(throwable, ArgumentBug)) {
            throwable = /** @type {ArgumentBug} */(throwable);
            test.assertEqual(throwable.getArgName(), this.testArgName2,
                "Assert argName of throwable was '" + this.testArgName2 + "'");
        }
    }
};
bugmeta.annotate(argUtilProcessMultipleArgumentsOneOptionalOneArgUndefinedTest).with(
    test().name("ArgUtil - #process multiple arguments with one optional arg and one undefined arg test")
);

/**
 *
 */
var argUtilRealWorldTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testArgName1   = "testArgName1";
        this.testValue2     = function() {};
        this.testArgName2   = "testArgName2";
        this.testFunction = function() {
            return ArgUtil.process(arguments, [
                {name: _this.testArgName1, optional: true, type: "array", default: []},
                {name: _this.testArgName2, optional: false, type: "function"}
            ]);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var argsObject = this.testFunction(this.testValue2);
        var properties = Obj.getProperties(argsObject);
        test.assertTrue(TypeUtil.isObject(argsObject),
            "Assert that ArgUtil returned an object");
        test.assertEqual(properties.length, 2,
            "Assert that returned argsObject has 2 properties");
        test.assertTrue(Class.doesExtend(argsObject.testArgName1, Array),
            "Assert that argsObject.testArgName1 is an Array");
        test.assertEqual(argsObject.testArgName2, this.testValue2,
            "Assert that argsObject.testArgName2 is testValue2");
    }
};
bugmeta.annotate(argUtilRealWorldTest).with(
    test().name("ArgUtil - #process real world test")
);

/**
 *
 */
var argUtilRealWorld2Test = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testValue1     = {};
        this.testArgName1   = "testArgName1";
        this.testValue2     = function() {};
        this.testArgName2   = "testArgName2";
        this.testValue3     = undefined;
        this.testArgName3   = "testArgName3";
        this.testFunction = function() {
            return ArgUtil.process(arguments, [
                {name: _this.testArgName1, optional: false, type: "object"},
                {name: _this.testArgName2, optional: true, type: "array", default: []},
                {name: _this.testArgName3, optional: false, type: "function"}
            ]);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var argsObject = this.testFunction(this.testValue1, this.testValue2, this.testValue3);
        var properties = Obj.getProperties(argsObject);
        test.assertTrue(TypeUtil.isObject(argsObject),
            "Assert that ArgUtil returned an object");
        test.assertEqual(properties.length, 3,
            "Assert that returned argsObject has 3 properties");
        test.assertEqual(argsObject.testArgName1, this.testValue1,
            "Assert that argsObject.testArgName1 is testValue1");
        test.assertTrue(Class.doesExtend(argsObject.testArgName2, Array),
            "Assert that argsObject.testArgName2 is an Array");
        test.assertEqual(argsObject.testArgName3, this.testValue2,
            "Assert that argsObject.testArgName3 is testValue3");
    }
};
bugmeta.annotate(argUtilRealWorld2Test).with(
    test().name("ArgUtil - #process real world 2 test")
);

/**
 *
 */
var argUtilRealWorld3Test = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testValue1     = function() {};
        this.testArgName1   = "testArgName1";
        this.testValue2     = undefined;
        this.testArgName2   = "testArgName2";
        this.testValue3     = undefined;
        this.testArgName3   = "testArgName3";
        this.testFunction = function() {
            return ArgUtil.process(arguments, [
                {name: _this.testArgName1, optional: true, type: "object"},
                {name: _this.testArgName2, optional: true, type: "array", default: []},
                {name: _this.testArgName3, optional: false, type: "function"}
            ]);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var argsObject = this.testFunction(this.testValue1, this.testValue2, this.testValue3);
        var properties = Obj.getProperties(argsObject);
        test.assertTrue(TypeUtil.isObject(argsObject),
            "Assert that ArgUtil returned an object");
        test.assertEqual(properties.length, 3,
            "Assert that returned argsObject has 3 properties");
        test.assertEqual(argsObject.testArgName1, undefined,
            "Assert that argsObject.testArgName1 is testValue1");
        test.assertTrue(Class.doesExtend(argsObject.testArgName2, Array),
            "Assert that argsObject.testArgName2 is an Array");
        test.assertEqual(argsObject.testArgName3, this.testValue1,
            "Assert that argsObject.testArgName3 is testValue1");
    }
};
bugmeta.annotate(argUtilRealWorld3Test).with(
    test().name("ArgUtil - #process real world 3 test")
);

/**
 *
 */
var argUtilRealWorld4Test = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.testValue1     = "testValue1";
        this.testArgName1   = "testArgName1";
        this.testValue2     = function() {};
        this.testArgName2   = "testArgName2";
        this.testValue3     = undefined;
        this.testArgName3   = "testArgName3";
        this.testValue4     = undefined;
        this.testArgName4   = "testArgName4";
        this.testFunction = function() {
            return ArgUtil.process(arguments, [
                {name: _this.testArgName1, optional: true, type: "object"},
                {name: _this.testArgName2, optional: true, type: "array", default: []},
                {name: _this.testArgName3, optional: false, type: "string"},
                {name: _this.testArgName4, optional: false, type: "function"}
            ]);
        }
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var argsObject = this.testFunction(this.testValue1, this.testValue2, this.testValue3, this.testValue4);
        var properties = Obj.getProperties(argsObject);
        test.assertTrue(TypeUtil.isObject(argsObject),
            "Assert that ArgUtil returned an object");
        test.assertEqual(properties.length, 4,
            "Assert that returned argsObject has 4 properties");
        test.assertEqual(argsObject.testArgName1, undefined,
            "Assert that argsObject.testArgName1 is testValue1");
        test.assertTrue(Class.doesExtend(argsObject.testArgName2, Array),
            "Assert that argsObject.testArgName2 is an Array");
        test.assertEqual(argsObject.testArgName3, this.testValue1,
            "Assert that argsObject.testArgName3 is testValue1");
    }
};
bugmeta.annotate(argUtilRealWorld4Test).with(
    test().name("ArgUtil - #process real world 4 test")
);