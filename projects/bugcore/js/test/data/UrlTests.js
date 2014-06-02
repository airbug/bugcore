/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Url')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Url         = bugpack.require('Url');
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
     * 1) Url #isUrl method
     */
    var urlIsUrlTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.urls = [
                "domain.com",
                "domain.com/",
                "//domain.com",
                "//domain.com/",
                "http://domain.com",
                "https://domain.com",
                "https://domain.com/",
                "https://sub.domain.com",
                "https://sub.domain.com/",
                "https://sub2.sub.domain.com",
                "https://sub2.sub.domain.com/",
                "https://sub.domain.com/path/path-abc/_path/path1223",
                "https://domain.com?a=123",
                "https://domain.com?a=123#abc"
            ];
            this.notUrls = [
                "abc123",
                "abc123.",
                "abc123..",
                "https://domain.com/  broken"
            ];
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.urls.forEach(function(url) {
                test.assertTrue(Url.isUrl(url),
                    "Assert '" + url + "' is a url");
            });

            this.notUrls.forEach(function(notUrl) {
                test.assertFalse(Url.isUrl(notUrl),
                        "Assert '" + notUrl + "' is NOT a url");
            });
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(urlIsUrlTest).with(
        test().name("Url - #isUrl test")
    );
});
