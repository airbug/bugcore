//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('List')
//@Require('LiteralUtil')
//@Require('Pair')
//@Require('Set')
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
var List            = bugpack.require('List');
var LiteralUtil     = bugpack.require('LiteralUtil');
var Pair            = bugpack.require('Pair');
var Set             = bugpack.require('Set');
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

var literalUtilConvertEmptySetToLiteral = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testSet            = new Set();
        this.testConvertedSet   = LiteralUtil.convertToLiteral(this.testSet);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(TypeUtil.isArray(this.testConvertedSet),
            "Assert converted Set is an array");
        test.assertEqual(this.testConvertedSet.length, 0,
            "Assert the converted Set's array is empty");
    }
};
bugmeta.annotate(literalUtilConvertEmptySetToLiteral).with(
    test().name("LiteralUtil - #convertToLiteral empty Set test")
);


var literalUtilConvertEmptyPairToLiteral = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testPair           = new Pair();
        this.testConvertedPair  = LiteralUtil.convertToLiteral(this.testPair);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(TypeUtil.isObject(this.testConvertedPair),
            "Assert converted Pair is an object");
        test.assertEqual(this.testConvertedPair.a, undefined,
            "Assert the convertedPair.a is undefined");
        test.assertEqual(this.testConvertedPair.b, undefined,
            "Assert the convertedPair.b is undefined");
    }
};
bugmeta.annotate(literalUtilConvertEmptyPairToLiteral).with(
    test().name("LiteralUtil - #convertToLiteral empty Pair test")
);


var literalUtilConvertListWithPairsToLiteral = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testList           = new List();
        this.testA1             = "testA1";
        this.testB1             = "testB1";
        this.testPairA          = new Pair(this.testA1, this.testB1);
        this.testA2             = "testA2";
        this.testB2             = "testB2";
        this.testPairB          = new Pair(this.testA2, this.testB2);
        this.testList.add(this.testPairA);
        this.testList.add(this.testPairB);
        this.testConvertedList  = LiteralUtil.convertToLiteral(this.testList);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(TypeUtil.isArray(this.testConvertedList),
            "Assert testConvertedList is an array");
        test.assertEqual(this.testConvertedList.length, 2,
            "Assert the testConvertedList's array is a length of 2");
        test.assertEqual(this.testConvertedList[0].a, this.testA1,
            "Assert testConvertedList[0].a is testA1");
        test.assertEqual(this.testConvertedList[0].b, this.testB1,
            "Assert testConvertedList[0].a is testB1");
        test.assertEqual(this.testConvertedList[1].a, this.testA2,
            "Assert testConvertedList[1].a is testA2");
        test.assertEqual(this.testConvertedList[1].b, this.testB2,
            "Assert testConvertedList[1].b is testB2");
    }
};
bugmeta.annotate(literalUtilConvertListWithPairsToLiteral).with(
    test().name("LiteralUtil - #convertToLiteral List with Pairs test")
);
