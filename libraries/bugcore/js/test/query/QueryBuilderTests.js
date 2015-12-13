/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Query')
//@Require('QueryBuilder')
//@Require('Set')
//@Require('WhereConditionBuilder')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Query                   = bugpack.require('Query');
    var QueryBuilder            = bugpack.require('QueryBuilder');
    var Set                     = bugpack.require('Set');
    var WhereConditionBuilder   = bugpack.require('WhereConditionBuilder');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var TestTag                 = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var test                    = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests
     * 1) Instantiation of a new QueryBuilder
     * 2) That the conditionBuilderSet extends Set and is empty
     */
    var queryBuilderInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testQueryBuilder   = new QueryBuilder();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testQueryBuilder, QueryBuilder),
                'Assert instance extends QueryBuilder class');
            var conditionBuilderSet = this.testQueryBuilder.getConditionBuilderSet();
            test.assertTrue(Class.doesExtend(conditionBuilderSet, Set),
                'Assert #getConditionBuilderSet returns a Set');
            test.assertTrue(conditionBuilderSet.isEmpty(),
                'Assert conditionBuilderSet is empty');
        }
    };
    bugmeta.tag(queryBuilderInstantiationTest).with(
        test().name('QueryBuilder - instantiation test')
    );


    /**
     * This tests
     * 1) #where method of QueryBuilder
     */
    var queryBuilderWhereTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testPropertyQuery  = 'testPropertyQuery';
            this.testQueryBuilder   = new QueryBuilder();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var whereConditionBuilder = this.testQueryBuilder.where(this.testPropertyQuery);
            test.assertTrue(Class.doesExtend(whereConditionBuilder, WhereConditionBuilder),
                'Assert returned whereConditionBuilder extends WhereConditionBuilder');
            test.assertTrue(this.testQueryBuilder.getConditionBuilderSet().contains(whereConditionBuilder),
                'Assert conditionBuilderSet contains WhereConditionBuilder');
        }
    };
    bugmeta.tag(queryBuilderWhereTest).with(
        test().name('QueryBuilder - #where test')
    );

    /**
     * This tests
     * 1) #build method of QueryBuilder
     */
    var queryBuilderBuildTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testPropertyQuery  = 'testPropertyQuery';
            this.testQueryBuilder   = new QueryBuilder();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testQueryBuilder.where(this.testPropertyQuery);
            var query                       = this.testQueryBuilder.build();
            test.assertTrue(Class.doesExtend(query, Query),
                'Assert query extends Query');
        }
    };
    bugmeta.tag(queryBuilderBuildTest).with(
        test().name('QueryBuilder - #build test')
    );
});
