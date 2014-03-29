//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('HtmlUtil')
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
var HtmlUtil        = bugpack.require('HtmlUtil');
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
 * 1) Escaping html characters
 */
var htmlUtilEscapeHtmlTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testStrings = [
            {
                expected: "&lt;div&gt;&amp;&lt;/div&gt;&quot;",
                value: "<div>&</div>\""
            }
        ];
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testStrings.forEach(function(testString) {
            var result = HtmlUtil.escapeHtml(testString.value);
            test.assertEqual(result, testString.expected,
                "Assert that result escaped string is equal to the expected value");
        })
    }
};
bugmeta.annotate(htmlUtilEscapeHtmlTest).with(
    test().name("HtmlUtil - #escapeHtml test")
);


/**
 * This tests
 * 1) Escaping html characters
 */
var htmlUtilReplaceUrlsTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        this.testStrings = [
            {
                expected: "<b>http://localhost</b>",
                value: "http://localhost"
            },
            {
                expected: "test <b>http://localhost</b> test",
                value: "test http://localhost test"
            },
            {
                expected: "<b>www.airbug.com</b>",
                value: "www.airbug.com"
            },
            {
                expected: "test <b>www.airbug.com</b> test",
                value: "test www.airbug.com test"
            },
            {
                expected: "<b>subsub.sub.airbug.com</b>",
                value: "subsub.sub.airbug.com"
            },
            {
                expected: "<b>open.spotify.com</b>",
                value: "open.spotify.com"
            },
            {
                expected: "<b>www.airbug.com:80</b>",
                value: "www.airbug.com:80"
            },
            {
                expected: "<b>http://localhost:8000/app#conversation/52d997cf05830c97a6a5da50</b>",
                value: "http://localhost:8000/app#conversation/52d997cf05830c97a6a5da50"
            },
            {
                expected: "<b>http://localhost</b>:/app#conversation/52d997cf05830c97a6a5da50",
                value: "http://localhost:/app#conversation/52d997cf05830c97a6a5da50"
            },
            {
                expected: "<b>https://maps.google.com/maps?q=arlington,+va+to+airbug+inc,+san+francisco,+ca&saddr=arlington,+va&daddr=airbug+inc,+san+francisco,+ca&hl=en&ll=39.774769,-99.755859&spn=48.496045,88.242187&sll=37.0625,-95.677068&sspn=50.111473,88.242187&geocode=FVVJUQIdW69n-ykPp6d7nba3iTE0voUzYAOG4A%3BFdX-PwIdewGz-CGgBC0rVL4deCk7B7kygX2PgDGgBC0rVL4deA&t=m&z=4</b>",
                value: "https://maps.google.com/maps?q=arlington,+va+to+airbug+inc,+san+francisco,+ca&saddr=arlington,+va&daddr=airbug+inc,+san+francisco,+ca&hl=en&ll=39.774769,-99.755859&spn=48.496045,88.242187&sll=37.0625,-95.677068&sspn=50.111473,88.242187&geocode=FVVJUQIdW69n-ykPp6d7nba3iTE0voUzYAOG4A%3BFdX-PwIdewGz-CGgBC0rVL4deCk7B7kygX2PgDGgBC0rVL4deA&t=m&z=4"
            },
            {
                expected: "<b>https://embed.spotify.com/?uri=spotify:user:matthewvroom:playlist:1wZihJ4AKuJoo98bdXr9me</b>",
                value: "https://embed.spotify.com/?uri=spotify:user:matthewvroom:playlist:1wZihJ4AKuJoo98bdXr9me"
            }
        ];
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testStrings.forEach(function(testString) {
            var result = HtmlUtil.replaceUrls(testString.value, function(match) {
                return "<b>" + match + "</b>";
            });
            test.assertEqual(result, testString.expected,
                "Assert that result replaced url is equal to the expected value");
        })
    }
};
bugmeta.annotate(htmlUtilReplaceUrlsTest).with(
    test().name("HtmlUtil - #replaceUrls test")
);
