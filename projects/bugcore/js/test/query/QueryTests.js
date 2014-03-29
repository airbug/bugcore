//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('ICondition')
//@Require('Obj')
//@Require('Query')
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
var Query           = bugpack.require('Query');
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
 * 1) Instantiation of a new Query
 * 2) That the conditionSet extends Set and is empty
 */
var queryInstantiationTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
       this.testQuery   = new Query();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testQuery, Query),
            "Assert instance extends Query class");
        var conditionSet = this.testQuery.getConditionSet();
        test.assertTrue(Class.doesExtend(conditionSet, Set),
            "Assert getConditionSet returns a Set");
        test.assertTrue(conditionSet.isEmpty(),
            "Assert conditionSet is empty");
    }
};
bugmeta.annotate(queryInstantiationTest).with(
    test().name("Query - instantiation test")
);


/**
 * This tests
 * 1) Adding a condition to a Query instance
 */
var queryAddConditionTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.ConditionClass = Class.extend(Obj, {
            check: function() {}
        });
        Class.implement(this.ConditionClass, ICondition);
        this.testQuery      = new Query();
        this.testCondition  = new this.ConditionClass();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testQuery.addCondition(this.testCondition);
        test.assertEqual(this.testQuery.getConditionSet().getCount(), 1,
            "Assert conditionSet has one item");
        test.assertTrue(this.testQuery.getConditionSet().contains(this.testCondition),
            "Assert conditionSet contains the testCondition");
    }
};
bugmeta.annotate(queryAddConditionTest).with(
    test().name("Query - #addCondition test")
);



/**
 * This tests
 * 1) Adding a non Condition to the query instance
 */
var queryAddNonConditionTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.NonConditionClass  = Class.extend(Obj, {});
        this.testQuery          = new Query();
        this.testNonCondition   = new this.NonConditionClass();
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        test.assertThrows(function() {
            _this.testQuery.addCondition(_this.testNonCondition);
        }, "Assert adding a non condition throws an error")
    }
};
bugmeta.annotate(queryAddNonConditionTest).with(
    test().name("Query - #addCondition non Condition test")
);


/**
 * This tests
 * 1) #run matching WhereCondition Query
 */
var queryRunMatchingWhereConditionTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testValue          = "testValue";
        this.testObject         = {
            testProp: {
                subProp: this.testValue
            }
        };
        this.testQuery          = new Query();
        this.testPropertyQuery  = "testProp.subProp";
        this.testInSet          = new Set([
            this.testValue
        ]);
        this.testWhereCondition = new WhereCondition(this.testPropertyQuery, this.testInSet);
        this.testQuery.addCondition(this.testWhereCondition);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var result = this.testQuery.run(this.testObject);
        test.assertEqual(result, true,
            "Assert #run returns a true result for matching WhereCondition Query");
    }
};
bugmeta.annotate(queryRunMatchingWhereConditionTest).with(
    test().name("Query - #run matching WhereCondition test")
);

/**
 * This tests
 * 1) #run WhereCondition Query against an empty Object. Should return back false.
 */
var queryRunEmptyObjectWhereConditionTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testValue          = "testValue";
        this.testObject         = {};
        this.testQuery          = new Query();
        this.testPropertyQuery  = "testProp.subProp";
        this.testInSet          = new Set([
            this.testValue
        ]);
        this.testWhereCondition = new WhereCondition(this.testPropertyQuery, this.testInSet);
        this.testQuery.addCondition(this.testWhereCondition);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var result = this.testQuery.run(this.testObject);
        test.assertEqual(result, false,
            "Assert #run returns a false result for matching WhereCondition Query");
    }
};
bugmeta.annotate(queryRunEmptyObjectWhereConditionTest).with(
    test().name("Query - #run WhereCondition Query against an empty Object test")
);


/**
 * This tests
 * 1) #run non matching WhereCondition Query
 */
var queryRunNonMatchingWhereConditionQueryTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testValue          = "testValue";
        this.testObject         = {
            testProp: {
                subProp: this.testValue
            }
        };
        this.testQuery          = new Query();
        this.testPropertyQuery  = "testProp.subProp";
        this.testInSet          = new Set([
            "nonMatch"
        ]);
        this.testWhereCondition = new WhereCondition(this.testPropertyQuery, this.testInSet);
        this.testQuery.addCondition(this.testWhereCondition);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var result = this.testQuery.run(this.testObject);
        test.assertEqual(result, false,
            "Assert #run returns a false result for non matching WhereCondition Query");
    }
};
bugmeta.annotate(queryRunNonMatchingWhereConditionQueryTest).with(
    test().name("Query - #run non matching WhereCondition Query test")
);
