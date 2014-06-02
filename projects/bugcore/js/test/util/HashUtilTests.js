/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('HashUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('tests.TypeValueSetsHelper')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var HashUtil            = bugpack.require('HashUtil');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var TestTag      = bugpack.require('bugunit.TestTag');
    var TypeValueSetsHelper = bugpack.require('tests.TypeValueSetsHelper');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var test                = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     *
     */
    var hashRepeatTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            var _this = this;
            this.typeValueSets = TypeValueSetsHelper.getTypeValueSets();
            this.hashValues = {};
            for (var type in this.typeValueSets) {
                var typeValueSet = this.typeValueSets[type];
                typeValueSet.forEach(function(typeValue) {
                    var hash = HashUtil.hash(typeValue.value);
                    _this.hashValues[typeValue.name] = hash;
                });
            }
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {

            // TEST: Repeat the hashing and ensure that the hash values are the same.

            for (var type in this.typeValueSets) {
                var typeValueSet = this.typeValueSets[type];
                var _this = this;
                typeValueSet.forEach(function(typeValue) {
                    var repeatHash = HashUtil.hash(typeValue.value);
                    var expectedHash = _this.hashValues[typeValue.name];
                    test.assertEqual(repeatHash, expectedHash, "Assert hash of " + typeValue.name + " " + typeValue.value +
                        " is the same when it is hashed repeatedly.");
                });
            }
        }
    };
    bugmeta.tag(hashRepeatTest).with(
        test().name("Hash repeat test")
    );

    /**
     *
     */
    var hashNativeTypesTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.native1 = new Error();
            this.native2 = new Error();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var nativeHash1 = HashUtil.hash(this.native1);
            var nativeHash2 = HashUtil.hash(this.native2);
            test.assertNotEqual(nativeHash1, nativeHash2,
                "Assert that nativeHash1 and nativeHash2 are not equal");
            test.assertEqual(nativeHash1, HashUtil.hash(this.native1),
                "Assert that the same hash is given for rehash");
        }
    };
    bugmeta.tag(hashNativeTypesTest).with(
        test().name("Hash - native types test")
    );
});
