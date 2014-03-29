//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Document')
//@Require('IDocument')
//@Require('Obj')
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
var Document        = bugpack.require('Document');
var IDocument       = bugpack.require('IDocument');
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

var documentInstantiationTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.document = new Document();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.document, Document),
            "Assert instance of Document");
        test.assertTrue(Class.doesImplement(this.document, IDocument),
            "Assert implements IDocument");
        test.assertEqual(this.document.getData(), undefined,
            "Assert data is undefined");
    }
};
bugmeta.annotate(documentInstantiationTest).with(
    test().name("Document - instantiation test")
);

var documentInstantiationWithParamsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testData = "abc123";
        this.document = new Document(this.testData);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.document.getData(), this.testData,
            "Assert data is testData");
    }
};
bugmeta.annotate(documentInstantiationWithParamsTest).with(
    test().name("Document - instantiation with params test")
);

var documentGetPathNoStringThrowsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.document = new Document();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertThrows(function() {
            this.getPath(1);
        }, "Assert getPath with a number throws ArgumentBug");
        test.assertThrows(function() {
            this.getPath(null);
        }, "Assert getPath with a null throws ArgumentBug");
        test.assertThrows(function() {
            this.getPath(undefined);
        }, "Assert getPath with undefined string throws ArgumentBug");
        test.assertThrows(function() {
            this.getPath({});
        }, "Assert getPath with Object throws ArgumentBug");
        test.assertThrows(function() {
            this.getPath([]);
        }, "Assert getPath with Array throws ArgumentBug");
        test.assertThrows(function() {
            this.getPath(false);
        }, "Assert getPath with boolean throws ArgumentBug");
    }
};
bugmeta.annotate(documentGetPathNoStringThrowsTest).with(
    test().name("Document - getPath with non string test")
);

var documentGetPathUndefinedDocTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.document = new Document();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.document.getPath(""), undefined,
            "Assert blank path path is undefined");
        test.assertEqual(this.document.getPath("abc"), undefined,
            "Assert single path path is undefined");
        test.assertEqual(this.document.getPath("abc.edf"), undefined,
            "Assert double path path is undefined");
        test.assertEqual(this.document.getPath("abc.edf.ghi"), undefined,
            "Assert triple path path is undefined");
    }
};
bugmeta.annotate(documentGetPathUndefinedDocTest).with(
    test().name("Document - #getPath with undefined doc test")
);

var documentGetPathSimpleTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testPath  = "testPath";
        this.testValue = "abc123";
        this.testDoublePath = "testDoublePath.testSubPath";
        this.testDoubleValue = "bcd234";
        this.testTriplePath = "testTriplePath.testSubPath.testSubSubPath";
        this.testTripleValue = "cde345";
        this.testData = {
            testPath: this.testValue,
            testDoublePath: {
                testSubPath: this.testDoubleValue
            },
            testTriplePath: {
                testSubPath: {
                    testSubSubPath: this.testTripleValue
                }
            }
        };
        this.document = new Document(this.testData);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.document.getPath(""), this.testData,
            "Assert blank path path is testData");
        test.assertEqual(this.document.getPath(this.testPath), this.testValue,
            "Assert testPath is testValue");
        test.assertEqual(this.document.getPath(this.testDoublePath), this.testDoubleValue,
            "Assert testDoublePath is testDoubleValue");
        test.assertEqual(this.document.getPath(this.testTriplePath), this.testTripleValue,
            "Assert testTriplePath is testTripleValue");
        test.assertEqual(this.document.getPath("abc"), undefined,
            "Assert single path path is undefined");
        test.assertEqual(this.document.getPath("abc.edf"), undefined,
            "Assert double path path is undefined");
        test.assertEqual(this.document.getPath("abc.edf.ghi"), undefined,
            "Assert triple path path is undefined");
    }
};
bugmeta.annotate(documentGetPathSimpleTest).with(
    test().name("Document - #getPath simple test")
);

var documentSetPathUndefinedDocTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testPath = "";
        this.testValue = "testValue";
        this.document = new Document();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.document.setPath(this.testPath, this.testValue);
        test.assertEqual(this.document.getPath(this.testPath), this.testValue,
            "Assert value was set correctly at base path");
    }
};
bugmeta.annotate(documentSetPathUndefinedDocTest).with(
    test().name("Document - #setPath undefined doc test")
);

var documentSetPathSimpleTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testPath = "abc.def.ghi";
        this.testValue = "testValue";
        this.document = new Document();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.document.setPath(this.testPath, this.testValue);
        test.assertEqual(this.document.getPath(this.testPath), this.testValue,
            "Assert value was set correctly at triple path");
        test.assertTrue(TypeUtil.isObject(this.document.getPath("abc")),
            "Assert object was created at path 'abc'");
        test.assertTrue(TypeUtil.isObject(this.document.getPath("abc")),
            "Assert object was created at path 'abc.def'");
    }
};
bugmeta.annotate(documentSetPathSimpleTest).with(
    test().name("Document - #setPath simple test")
);

var documentSetPathExistingPathTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testPath = "abc.def.ghi";
        this.testValue = "testValue";
        this.document = new Document({
            abc: {
                def: {
                    ghi: "existingValue"
                }
            }
        });
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.document.getPath(this.testPath), "existingValue",
            "Assert value is existing value");
        this.document.setPath(this.testPath, this.testValue);
        test.assertEqual(this.document.getPath(this.testPath), this.testValue,
            "Assert value was updated correctly at path");
    }
};
bugmeta.annotate(documentSetPathExistingPathTest).with(
    test().name("Document - #setPath existing path test")
);
