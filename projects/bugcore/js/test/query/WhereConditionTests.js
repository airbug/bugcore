//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('ICondition')
//@Require('Obj')
//@Require('Set')
//@Require('WhereCondition')
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
var ICondition      = bugpack.require('ICondition');
var Obj             = bugpack.require('Obj');
var Set             = bugpack.require('Set');
var WhereCondition  = bugpack.require('WhereCondition');
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
 * 1) Instantiation of a new WhereCondition
 */
var whereConditionInstantiationTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testInSet              = new Set(["value"]);
        this.testPropertyQuery      = "propertyQuery";
        this.testWhereCondition     = new WhereCondition(this.testPropertyQuery, this.testInSet);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testWhereCondition, WhereCondition),
            "Assert instance extends WhereCondition class");
        test.assertTrue(Class.doesImplement(this.testWhereCondition, ICondition),
            "Assert instance implements ICondition interfaces");
        test.assertEqual(this.testWhereCondition.getInSet(), this.testInSet,
            "Assert #getInSet returns the testInSet");
        test.assertEqual(this.testWhereCondition.getPropertyQuery(), this.testPropertyQuery,
            "Assert #getPropertyQuery returns the testPropertyQuery");
    }
};
bugmeta.annotate(whereConditionInstantiationTest).with(
    test().name("WhereCondition - instantiation test")
);
