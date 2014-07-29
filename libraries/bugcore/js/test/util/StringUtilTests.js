/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('StringUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var StringUtil  = bugpack.require('StringUtil');
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
     * 1) left padding a string
     */
    var stringUtilLpadTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testString = "ABC";
            this.testPadChar = "+";
            this.testLength = 10;
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var result = StringUtil.lpad(this.testString, this.testPadChar, this.testLength);
            test.assertEqual(result, "+++++++ABC",
                "Assert the string has been left padded correctly");
        }
    };

    /**
     * This tests
     * 1) padding a string
     */
    var stringUtilPadTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testString = "ABC";
            this.testPadChar = "+";
            this.testLength = 10;
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var result = StringUtil.pad(this.testString, this.testPadChar, this.testLength);
            test.assertEqual(result, "++++ABC++++",
                "Assert the string has been padded correctly");
        }
    };

    /**
     * This tests
     * 1) right padding a string
     */
    var stringUtilRpadTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testString = "ABC";
            this.testPadChar = "+";
            this.testLength = 10;
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var result = StringUtil.rpad(this.testString, this.testPadChar, this.testLength);
            test.assertEqual(result, "ABC+++++++",
                "Assert the string has been right padded correctly");
        }
    };

    /**
     * This tests
     * 1) Escape a string
     */
    var stringUtilEscapeStringTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testString = "\'ABC\"123";
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var result = StringUtil.escapeString(this.testString);
            test.assertEqual(result, "\\\'ABC\\\"123",
                "Assert the string has been escaped correctly");
        }
    };

    /**
     * This tests
     * 1) Splitting a string with a lineProcessor
     */
    var stringUtilSplitWithLineProcessorTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testString = "ABC\n123\nEFG";
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var results = StringUtil.split(this.testString, "\n", function(line, index) {
                return line + index;
            });
            test.assertEqual(results[0], "ABC0",
                "Assert that line 0 was set correctly");
            test.assertEqual(results[1], "1231",
                "Assert that line 1 was set correctly");
            test.assertEqual(results[2], "EFG2",
                "Assert that line 2 was set correctly");
        }
    };

    /**
     * This tests
     * 1) Left trimming a string
     */
    var stringUtilLtrimTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testString = "  ABC  ";
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var result = StringUtil.ltrim(this.testString);
            test.assertEqual(result, "ABC  ",
                "Assert the string has been left trimmed correctly");
        }
    };

    /**
     * This tests
     * 1) Right trimming a string
     */
    var stringUtilRtrimTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testString = "  ABC  ";
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var result = StringUtil.rtrim(this.testString);
            test.assertEqual(result, "  ABC",
                "Assert the string has been right trimmed correctly");
        }
    };

    /**
     * This tests
     * 1) Trimming a string
     */
    var stringUtilTrimTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testString = "  ABC  ";
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var result = StringUtil.trim(this.testString);
            test.assertEqual(result, "ABC",
                "Assert the string has been trimmed correctly");
        }
    };

    /**
     * This tests
     * 1) Trimming a string with new lines at the end/beginning
     */
    var stringUtilTrimNewLineTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testString = "\nABC\n";
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var result = StringUtil.trim(this.testString);
            test.assertEqual(result, "ABC",
                "Assert the string has been trimmed correctly");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(stringUtilLpadTest).with(
        test().name("StringUtil - #lpad test")
    );
    bugmeta.tag(stringUtilPadTest).with(
        test().name("StringUtil - #pad test")
    );
    bugmeta.tag(stringUtilRpadTest).with(
        test().name("StringUtil - #rpad test")
    );
    bugmeta.tag(stringUtilEscapeStringTest).with(
        test().name("StringUtil - #escapeString test")
    );
    bugmeta.tag(stringUtilSplitWithLineProcessorTest).with(
        test().name("StringUtil - #split with lineProcessor test")
    );
    bugmeta.tag(stringUtilLtrimTest).with(
        test().name("StringUtil - #ltrim test")
    );
    bugmeta.tag(stringUtilRtrimTest).with(
        test().name("StringUtil - #rtrim test")
    );
    bugmeta.tag(stringUtilTrimTest).with(
        test().name("StringUtil - #trim test")
    );
    bugmeta.tag(stringUtilTrimNewLineTest).with(
        test().name("StringUtil - #trim new line test")
    );
});
