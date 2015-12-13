/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('ForEachParallel')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ForEachParallel     = bugpack.require('ForEachParallel');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var TestTag             = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var test                = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests..
     * 1) That each item in the array is iterated over in ForEachParallel execute
     */
    var forEachParallelExecuteTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            this.testIndex = -1;
            this.testArray = [
                'value1',
                'value2',
                'value3'
            ];
            this.testIteratorMethod = function(flow, value, index) {
                _this.testIndex++;
                test.assertEqual(index, _this.testIndex,
                    'Assert index is in correct order. Should be "' + _this.testIndex + '"');
                test.assertEqual(value, _this.testArray[_this.testIndex],
                    'Assert value matches test index value');
                flow.complete();
            };
            this.forEachParallel = new ForEachParallel(this.testArray, this.testIteratorMethod);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            var executeCallbackFired = false;
            this.forEachParallel.execute(function(error) {
                test.assertFalse(executeCallbackFired,
                    'Assert that the execute callback has not already fired');
                executeCallbackFired = true;
                if (!error) {
                    test.assertEqual(_this.testIndex, 2,
                        'Assert that the ForEachParallel iterated 3 times');
                } else {
                    test.error(error);
                }
            });
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(forEachParallelExecuteTest).with(
        test().name('ForEachParallel - execute test')
    );
});
