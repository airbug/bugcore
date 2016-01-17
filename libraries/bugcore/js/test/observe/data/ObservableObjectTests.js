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
//@Require('ClearChange')
//@Require('ObservableObject')
//@Require('Observation')
//@Require('SetPropertyChange')
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

    var Class               = bugpack.require('Class');
    var ClearChange         = bugpack.require('ClearChange');
    var ObservableObject    = bugpack.require('ObservableObject');
    var Observation         = bugpack.require('Observation');
    var SetPropertyChange   = bugpack.require('SetPropertyChange');
    var TypeUtil            = bugpack.require('TypeUtil');
    var BugDouble           = bugpack.require('bugdouble.BugDouble');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var TestTag             = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var spyOnObject         = BugDouble.spyOnObject;
    var test                = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests...
     * 1) Instantiating a ObservableObject class with no parameters
     */
    var observableObjectInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testObservableObject =   new ObservableObject();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(TypeUtil.isObject(this.testObservableObject.getObservedObject()),
                "Assert ObservableObject.observedObject defaults to an object")
        }
    };

    /**
     * This tests...
     * 1) Instantiating a ObservableObject class with parameters
     */
    var observableObjectInstantiationWithParametersTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testValue              = "testValue";
            this.testObject             = {
                someProperty: this.testValue
            };
            this.testObservableObject   = new ObservableObject(this.testObject);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(TypeUtil.isObject(this.testObservableObject.getObservedObject()),
                "Assert ObservableObject.observedObject is an object");
            test.assertEqual(this.testObservableObject.getObservedObject().someProperty, this.testValue,
                "Assert that the object was set correctly");
        }
    };

    /**
     * This tests...
     * 1) the ObservableObject#setProperty
     */
    var observableObjectSetPropertyTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this                   = this;
            this.testObject             = {};
            this.testPropertyName       = "testPropertyName";
            this.testPropertyValue      = "testPropertyValue";
            this.testObservableObject   = new ObservableObject(this.testObject);
            this.testObserver           = {
                observeObservation: function(observation) {
                    test.assertTrue(Class.doesExtend(observation, Observation),
                        "Assert that observeObservation receives an Observation");
                    var change = /** @type {SetPropertyChange} */(observation.getChange());
                    test.assertTrue(Class.doesExtend(change, SetPropertyChange),
                        "Assert that the change observed is a SetPropertyChange");
                    test.assertEqual(change.getPropertyName(), _this.testPropertyName,
                        "Assert change.getPropertyName() returns the testPropertyName");
                    test.assertEqual(change.getPropertyValue(), _this.testPropertyValue,
                        "Assert change.getPropertyValue() returns the testPropertyValue");
                    test.assertEqual(change.getPreviousValue(), undefined,
                        "Assert change.getPreviousValue() returns the undefined")
                }
            };
            this.testObserverSpy = spyOnObject(this.testObserver);
            this.testObservableObject.observe(SetPropertyChange.CHANGE_TYPE, "*", this.testObserver.observeObservation, this.testObserver);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.testObservableObject.setProperty(this.testPropertyName, this.testPropertyValue);
            test.assertTrue(this.testObserverSpy.getSpy("observeObservation").wasCalled(),
                "Assert that observeObservation was called");
            test.assertEqual(this.testObservableObject.getProperty(this.testPropertyName), this.testPropertyValue,
                "Assert that getProperty() returns the testPropertyValue");
        }
    };

    /**
     * This tests...
     * 1) the ObservableObject#clearProperties
     */
    var observableObjectClearPropertiesTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this                   = this;
            this.testObject             = {};
            this.testPropertyName       = "testPropertyName";
            this.testPropertyValue      = "testPropertyValue";
            this.testObject[this.testPropertyName] = this.testPropertyValue;
            this.testObservableObject   = new ObservableObject(this.testObject);
            this.testObserver           = {
                observeObservation: function(observation) {
                    test.assertTrue(Class.doesExtend(observation, Observation),
                        "Assert that observeObservation receives an Observation");
                    var change = /** @type {ClearChange} */(observation.getChange());
                    test.assertTrue(Class.doesExtend(change, ClearChange),
                        "Assert that the change observed is a ClearChange");
                }
            };
            this.testObserverSpy = spyOnObject(this.testObserver);
            this.testObservableObject.observe(ClearChange.CHANGE_TYPE, "*", this.testObserver.observeObservation, this.testObserver);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertEqual(this.testObservableObject.getProperty(this.testPropertyName), this.testPropertyValue,
                "Sanity check that property value is set correctly");
            this.testObservableObject.clearProperties();
            test.assertTrue(this.testObserverSpy.getSpy("observeObservation").wasCalled(),
                "Assert that observeObservation was called");
            test.assertEqual(this.testObservableObject.getProperty(this.testPropertyName), undefined,
                "Assert that getProperty() returns undefined");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(observableObjectInstantiationTest).with(
        test().name("ObservableObject - instantiation test")
    );
    bugmeta.tag(observableObjectInstantiationWithParametersTest).with(
        test().name("ObservableObject - instantiation with parameters test")
    );
    bugmeta.tag(observableObjectSetPropertyTest).with(
        test().name("ObservableObject - #setProperty test")
    );
    bugmeta.tag(observableObjectClearPropertiesTest).with(
        test().name("ObservableObject - #clearProperties test")
    );
});
