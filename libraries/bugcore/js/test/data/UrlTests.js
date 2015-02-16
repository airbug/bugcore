/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
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
     * 1) Instantiating a Url
     */
    var urlInstantiationWithArgumentsTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testUrlParts = {
                host: "testhost.com",
                path: "/test/path",
                port: 8080,
                protocol: "http",
                anchor: "abc",
                queryKey: {
                    abc: "123"
                }
            };
            this.testUrl = new Url(this.testUrlParts);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testUrl.getAnchor(), this.testUrlParts.anchor,
                "Assert Url.anchor was set correctly");
            test.assertEqual(this.testUrl.getHost(), this.testUrlParts.host,
                "Assert Url.host was set correctly");
            test.assertEqual(this.testUrl.getPath(), this.testUrlParts.path,
                "Assert Url.path was set correctly");
            test.assertEqual(this.testUrl.getPort(), this.testUrlParts.port,
                "Assert Url.port was set correctly");
            test.assertEqual(this.testUrl.getProtocol(), this.testUrlParts.protocol,
                "Assert Url.protocol was set correctly");
            test.assertEqual(this.testUrl.getUrlQuery("abc"), this.testUrlParts.queryKey.abc,
                "Assert Url.urlQueryMap was set correctly");
        }
    };

    /**
     * This tests
     * 1) That .equals() works correctly
     */
    var urlEqualsTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testUrl = new Url({
                host: "testhost.com"
            });
            this.testEqualUrl = new Url({
                host: "testhost.com"
            });
            this.testNotEqualUrl = new Url({
                host: "testnothost.com"
            });
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(this.testUrl.equals(this.testEqualUrl),
                "Assert correct equals check is true");
            test.assertFalse(this.testUrl.equals(this.testNotEqualUrl),
                "Assert incorrect equals check is false");
        }
    };

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

    bugmeta.tag(urlInstantiationWithArgumentsTest).with(
        test().name("Url - instantiation with arguments test")
    );
    bugmeta.tag(urlEqualsTest).with(
        test().name("Url - #equals test")
    );
    bugmeta.tag(urlIsUrlTest).with(
        test().name("Url - #isUrl test")
    );
});
