//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('IConditionBuilder')
//@Require('Obj')
//@Require('QueryBuilder')
//@Require('Set')
//@Require('WhereCondition')
//@Require('WhereConditionBuilder')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var IConditionBuilder       = bugpack.require('IConditionBuilder');
var Obj                     = bugpack.require('Obj');
var QueryBuilder            = bugpack.require('QueryBuilder');
var Set                     = bugpack.require('Set');
var WhereCondition          = bugpack.require('WhereCondition');
var WhereConditionBuilder   = bugpack.require('WhereConditionBuilder');
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
 * This tests
 * 1) Instantiation of a new WhereConditionBuilder
 */
var whereConditionBuilderInstantiationTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testQueryBuilder           = new QueryBuilder();
        this.testPropertyQuery          = "testPropertyQuery";
        this.testWhereConditionBuilder  = new WhereConditionBuilder(this.testQueryBuilder, this.testPropertyQuery);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testWhereConditionBuilder, WhereConditionBuilder),
            "Assert instance extends WhereConditionBuilder class");
        test.assertTrue(Class.doesImplement(this.testWhereConditionBuilder, IConditionBuilder),
            "Assert instances implements IConditionBuilder");
        var inSet   = this.testWhereConditionBuilder.getInSet();
        test.assertTrue(Class.doesExtend(inSet, Set),
            "Assert #getInSet returns a Set");
        test.assertTrue(inSet.isEmpty(),
            "Assert #getInSet returns a Set that is empty");
        test.assertEqual(this.testWhereConditionBuilder.getPropertyQuery(), this.testPropertyQuery,
            "Assert #getPropertyQuery returns the testPropertyQuery");
        test.assertEqual(this.testWhereConditionBuilder.getQueryBuilder(), this.testQueryBuilder,
            "Assert #getQueryBuilder returns the testQueryBuilder");
    }
};
bugmeta.annotate(whereConditionBuilderInstantiationTest).with(
    test().name("WhereConditionBuilder - instantiation test")
);


/**
 * This tests
 * 1) #in method of WhereConditionBuilder
 */
var whereConditionBuilderInTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testValue                  = "testValue";
        this.inArray                    = [this.testValue];
        this.testQueryBuilder           = new QueryBuilder();
        this.testPropertyQuery          = "testPropertyQuery";
        this.testWhereConditionBuilder  = new WhereConditionBuilder(this.testQueryBuilder, this.testPropertyQuery);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var returned = this.testWhereConditionBuilder.in(this.inArray);
        test.assertEqual(returned, this.testQueryBuilder,
            "Assert the in method returns the testQueryBuilder");
        test.assertTrue(this.testWhereConditionBuilder.getInSet().contains(this.testValue),
            "Assert the inSet contains the testValue");
    }
};
bugmeta.annotate(whereConditionBuilderInTest).with(
    test().name("WhereConditionBuilder - #in test")
);

/**
 * This tests
 * 1) #buildCondition method of WhereConditionBuilder
 */
var whereConditionBuilderBuildConditionTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testValue                  = "testValue";
        this.inArray                    = [this.testValue];
        this.testQueryBuilder           = new QueryBuilder();
        this.testPropertyQuery          = "testPropertyQuery";
        this.testWhereConditionBuilder  = new WhereConditionBuilder(this.testQueryBuilder, this.testPropertyQuery);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testWhereConditionBuilder.in(this.inArray);
        /** @type {WhereCondition} */
        var whereCondition = /** @type {WhereCondition} */ (this.testWhereConditionBuilder.buildCondition());
        test.assertTrue(Class.doesExtend(whereCondition, WhereCondition),
            "Assert returned value is a WhereCondition");
        test.assertEqual(whereCondition.getPropertyQuery(), this.testPropertyQuery,
            "Assert whereCondition#getPropertyQuery() returns the testPropertyQuery");
        test.assertTrue(whereCondition.getInSet().contains(this.testValue),
            "Assert the whereCondition's inSet contains the testValue");
    }
};
bugmeta.annotate(whereConditionBuilderBuildConditionTest).with(
    test().name("WhereConditionBuilder - #buildCondition test")
);
