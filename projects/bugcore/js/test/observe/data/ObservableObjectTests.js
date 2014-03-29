//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('ObservableObject')
//@Require('SetPropertyChange')
//@Require('TypeUtil')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var ObservableObject    = bugpack.require('ObservableObject');
var SetPropertyChange   = bugpack.require('SetPropertyChange');
var TypeUtil            = bugpack.require('TypeUtil');
var BugDouble           = bugpack.require('bugdouble.BugDouble');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta             = BugMeta.context();
var spyOnObject         = BugDouble.spyOnObject;
var test                = TestAnnotation.test;


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
bugmeta.annotate(observableObjectInstantiationTest).with(
    test().name("ObservableObject - instantiation test")
);

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
bugmeta.annotate(observableObjectInstantiationWithParametersTest).with(
    test().name("ObservableObject - instantiation with parameters test")
);

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
            observeChange: function(change) {
                test.assertTrue(Class.doesExtend(change, SetPropertyChange),
                    "Assert that the change observed is a SetPropertyChange")
                test.assertEqual(change.getPropertyName(), _this.testPropertyName,
                    "Assert change.getPropertyName() returns the testPropertyName");
                test.assertEqual(change.getPropertyValue(), _this.testPropertyValue,
                    "Assert change.getPropertyValue() returns the testPropertyValue");
                test.assertEqual(change.getPreviousValue(), undefined,
                    "Assert change.getPreviousValue() returns the undefined")
            }
        };
        this.testObserverSpy = spyOnObject(this.testObserver);
        this.testObservableObject.observe(SetPropertyChange.CHANGE_TYPE, "*", this.testObserver.observeChange, this.testObserver);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testObservableObject.setProperty(this.testPropertyName, this.testPropertyValue);
        test.assertTrue(this.testObserverSpy.getSpy("observeChange").wasCalled(),
            "Assert that observeChange was called");
        test.assertEqual(this.testObservableObject.getProperty(this.testPropertyName), this.testPropertyValue,
            "Assert that getProperty() returns the testPropertyValue");
    }
};
bugmeta.annotate(observableObjectSetPropertyTest).with(
    test().name("ObservableObject - #setProperty test")
);
