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
//@Require('StackTraceUtil')
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
    var StackTraceUtil  = bugpack.require('StackTraceUtil');
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
     *
     */
    var generateStackFromCallerTest = {

        async: true,

        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            function testFunction() {
                var stackTraceArray = StackTraceUtil.generateStackFromCaller();
                test.assertEqual(stackTraceArray[0], "function testFunction()",
                    "Assert that the 0 index function is 'testFunction'");
                test.assertEqual(stackTraceArray[1], "function ()",
                    "Assert that the 1 index function is anonymous function");
                test.assertEqual(stackTraceArray[2], "function listOnTimeout()",
                    "Assert that the 2 index function is 'listOnTimeout'");
            }
            setTimeout(function() {
                testFunction();
                test.completeTest();
            }, 0);
        }
    };
    bugmeta.tag(generateStackFromCallerTest).with(
        test().name("Generate stack trace from caller test")
    );


    /**
     *
     */
    var stackTraceUtilCreateExceptionTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {

        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {

            var error = StackTraceUtil.createException();
            var isError = error instanceof Error;
            test.assertTrue(isError, "Assert createException returns an error");
        }
    };
    bugmeta.tag(stackTraceUtilCreateExceptionTest).with(
        test().name("StackTraceUtil - #createException test")
    );
});
