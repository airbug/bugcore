/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('IterableSeries')
//@Require('List')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var IterableSeries  = bugpack.require('IterableSeries');
    var List            = bugpack.require('List');
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
     * This tests..
     * 1) That each item in the List is iterated over in IterableSeries execute
     * 2) That each items in the List is iterated in order
     * 3) That the
     */
    var iterableSeriesExecuteTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            this.testIndex = -1;
            this.testList = new List([
                "value1",
                "value2",
                "value3"
            ]);
            this.actualOrder = [];
            this.testIteratorMethod = function(flow, value) {
                _this.testIndex++;
                _this.actualOrder.push(value);
                test.assertEqual(value, _this.testList.getAt(_this.testIndex),
                    "Assert value matches test index value");
                flow.complete();
            };
            this.iterableSeries = new IterableSeries(this.testList, this.testIteratorMethod);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            var executeCallbackFired = false;
            this.iterableSeries.execute(function(error) {
                test.assertFalse(executeCallbackFired,
                    "Assert that the execute callback has not already fired");
                executeCallbackFired = true;
                for (var i = 0, size = _this.actualOrder.length; i < size; i++) {
                    test.assertEqual(_this.actualOrder[i], _this.testList.getAt(i),
                        "Assert that actual order matches the list");
                }
                if (!error) {
                    test.assertEqual(_this.testIndex, 2,
                        "Assert that the IterableSeries iterated 3 times");
                } else {
                    test.error(error);
                }
            });
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(iterableSeriesExecuteTest).with(
        test().name("IterableSeries - #execute test")
    );
});
