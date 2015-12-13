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
//@Require('ICondition')
//@Require('Set')
//@Require('WhereCondition')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var ICondition      = bugpack.require('ICondition');
    var Set             = bugpack.require('Set');
    var WhereCondition  = bugpack.require('WhereCondition');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestTag         = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var test            = TestTag.test;


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
            this.testInSet              = new Set(['value']);
            this.testPropertyQuery      = 'propertyQuery';
            this.testWhereCondition     = new WhereCondition(this.testPropertyQuery, this.testInSet);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testWhereCondition, WhereCondition),
                'Assert instance extends WhereCondition class');
            test.assertTrue(Class.doesImplement(this.testWhereCondition, ICondition),
                'Assert instance implements ICondition interfaces');
            test.assertEqual(this.testWhereCondition.getInSet(), this.testInSet,
                'Assert #getInSet returns the testInSet');
            test.assertEqual(this.testWhereCondition.getPropertyQuery(), this.testPropertyQuery,
                'Assert #getPropertyQuery returns the testPropertyQuery');
        }
    };
    bugmeta.tag(whereConditionInstantiationTest).with(
        test().name('WhereCondition - instantiation test')
    );
});
