//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Obj')
//@Require('Pair')
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
var Obj             = bugpack.require('Obj');
var Pair            = bugpack.require('Pair');
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
 * 1) Instantiate a simple Pair
 */
var pairInstantiationTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testPair = new Pair();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testPair.getA(), undefined,
            "Assert that Pair.a is undefined");
        test.assertEqual(this.testPair.getB(), undefined,
            "Assert that Pair.b is undefined");
        test.assertTrue(Class.doesExtend(this.testPair, Pair),
            "Assert that the testPair extends Pair");
    }
};
bugmeta.annotate(pairInstantiationTest).with(
    test().name("Pair - instantiation test")
);

/**
 * This tests
 * 1) Instantiate a Pair using another Pair
 */
var pairInstantiationWithPairTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testA          = "testA";
        this.testB          = "testB";
        this.testPair       = new Pair(this.testA, this.testB);
        this.testNewPair    = new Pair(this.testPair);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testNewPair.getA(), this.testPair.getA(),
            "Assert that testPair.a and testNewPair.a are equal");
        test.assertEqual(this.testNewPair.getB(), this.testPair.getB(),
            "Assert that testPair.b and testNewPair.b are equal");
    }
};
bugmeta.annotate(pairInstantiationWithPairTest).with(
    test().name("Pair - instantiation with Pair test")
);


/**
 * This tests
 * 1) Instantiate a simple Pair with values
 */
var pairInstantiationWithValuesTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testA    = "testA";
        this.testB    = "testB";
        this.testPair = new Pair(this.testA, this.testB);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testPair.getA(), this.testA,
            "Assert that Pair.a is testA");
        test.assertEqual(this.testPair.getB(), this.testB,
            "Assert that Pair.b is testB");
    }
};
bugmeta.annotate(pairInstantiationWithValuesTest).with(
    test().name("Pair - instantiation with values test")
);


/**
 * This tests
 * 1) Check if contains function works
 */
var pairContainsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testA    = "testA";
        this.testB    = "testB";
        this.testC    = "testC";
        this.testPair = new Pair(this.testA, this.testB);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testPair.contains(this.testA), true,
            "Assert that Pair#contains returns true when checked for 'testA'");
        test.assertEqual(this.testPair.contains(this.testB), true,
            "Assert that Pair#contains returns true when checked for 'testB'");
        test.assertEqual(this.testPair.contains(this.testC), false,
            "Assert that Pair#contains returns false when checked for 'testC'");

    }
};
bugmeta.annotate(pairContainsTest).with(
    test().name("Pair - #contains test")
);

/**
 * This tests
 * 1) Check if #getOther function works
 */
var pairGetOtherTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testA      = "testA";
        this.testB      = "testB";
        this.testC      = "testC";
        this.testPair = new Pair(this.testA, this.testB);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this   = this;
        var otherA  = this.testPair.getOther(this.testA);
        test.assertEqual(otherA, this.testB,
            "Assert that #getOther returns testB when called with testA");
        var otherB  = this.testPair.getOther(this.testB);
        test.assertEqual(otherB, this.testA,
            "Assert that #getOther returns testA when called with testB");
        test.assertThrows(function() {
            _this.testPair.getOther(_this.testC);
        }, "Assert calling getOther with a value that does not exist in the pair throws an Exception");
    }
};
bugmeta.annotate(pairGetOtherTest).with(
    test().name("Pair - #getOther test")
);
