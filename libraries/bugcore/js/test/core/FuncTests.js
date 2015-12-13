/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Func')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Func        = bugpack.require('Func');
    var BugMeta     = bugpack.require('bugmeta.BugMeta');
    var TestTag     = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta     = BugMeta.context();
    var test        = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests
     * 1) Func#bind static method
     */
    var funcStaticBindTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this           = this;
            this.testObject     = {};
            this.testArgument   = 'testArgument';
            this.testReturn     = 'testReturn';
            this.testFunction   = function(testParam) {
                test.assertEqual(this, _this.testObject,
                    'Assert that "this" matches the testObject');
                test.assertEqual(testParam, _this.testArgument,
                    'Assert that the testParam was set correctly');
                return _this.testReturn;
            };
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var boundFunction = Func.bind(this.testFunction, this.testObject);
            var returnedValue = boundFunction(this.testArgument);
            test.assertEqual(returnedValue, this.testReturn,
                'Assert that the testReturn value was correctly returned');
        }
    };

    /**
     * This tests
     * 1) Func#deferCall static method
     */
    var funcStaticDeferCallTest = {

        async: true,


        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this           = this;
            this.testObject     = {};
            this.testArgument   = 'testArgument';
            this.testFunctionCalled = false;
            this.testFunction   = function(testParam) {
                _this.testFunctionCalled = true;
                test.assertEqual(this, _this.testObject,
                    'Assert that "this" matches the testObject');
                test.assertEqual(testParam, _this.testArgument,
                    'Assert that the testParam was set correctly');
                test.completeTest();
            };
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertFalse(this.testFunctionCalled,
                'Assert testFunction was not called');
            Func.deferCall(this.testFunction, this.testObject, this.testArgument);
            test.assertFalse(this.testFunctionCalled,
                'Assert testFunction was not called');
        },

        final: function(test) {
            test.assertTrue(this.testFunctionCalled,
                'Assert testFunction was called');
            test.completeFinalize();
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(funcStaticBindTest).with(
        test().name('Func - #bind test')
    );
    bugmeta.tag(funcStaticDeferCallTest).with(
        test().name('Func - #deferCall test')
    );
});
