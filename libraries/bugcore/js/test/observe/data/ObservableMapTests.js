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
//@Require('Map')
//@Require('ObservableMap')
//@Require('PutChange')
//@Require('TypeUtil')
//@Require('bugdouble.BugDouble')
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
    var Map             = bugpack.require('Map');
    var ObservableMap   = bugpack.require('ObservableMap');
    var PutChange       = bugpack.require('PutChange');
    var TypeUtil        = bugpack.require('TypeUtil');
    var BugDouble       = bugpack.require('bugdouble.BugDouble');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestTag         = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var spyOnObject     = BugDouble.spyOnObject;
    var test            = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests...
     * 1) Instantiating a ObservableMap class with no parameters
     */
    var observableMapInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testObservableMap = new ObservableMap();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testObservableMap.getObserved(), Map),
                "Assert ObservableMap.observed defaults to a Map")
        }
    };
    bugmeta.tag(observableMapInstantiationTest).with(
        test().name("ObservableMap - instantiation test")
    );

    /**
     * This tests...
     * 1) Instantiating a ObservableMap class with parameters
     */
    var observableMapInstantiationWithParametersTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testKey                = "testKey";
            this.testValue              = "testValue";
            this.testMap                = new Map();
            this.testMap.put(this.testKey, this.testValue);
            this.testObservableMap      = new ObservableMap(this.testMap);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testObservableMap.getObserved(), Map),
                "Assert ObservableMap.observed was set to a Map");
            test.assertEqual(this.testObservableMap.getObserved().get(this.testKey), this.testValue,
                "Assert ObservableMap.observed was set correctly");
        }
    };
    bugmeta.tag(observableMapInstantiationWithParametersTest).with(
        test().name("ObservableMap - instantiation with parameters test")
    );
});
