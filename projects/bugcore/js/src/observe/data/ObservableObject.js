//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ObservableObject')

//@Require('Class')
//@Require('ClearChange')
//@Require('DualMap')
//@Require('IObjectable')
//@Require('IObservable')
//@Require('Obj')
//@Require('Observable')
//@Require('RemovePropertyChange')
//@Require('SetPropertyChange')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var ClearChange             = bugpack.require('ClearChange');
var DualMap                 = bugpack.require('DualMap');
var IObjectable             = bugpack.require('IObjectable');
var IObservable             = bugpack.require('IObservable');
var Obj                     = bugpack.require('Obj');
var Observable              = bugpack.require('Observable');
var RemovePropertyChange    = bugpack.require('RemovePropertyChange');
var SetPropertyChange       = bugpack.require('SetPropertyChange');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Observable}
 */
var ObservableObject = Class.extend(Observable, /** @lends {ObservableObject.prototype} */{

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {Object} observedObject
     */
    _constructor: function(observedObject) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Object}
         */
        this.observedObject         = {};

        /**
         * @private
         * @type {DualMap.<string, IObservable>}
         */
        this.observablePropertyMap  = new DualMap();

        if (observedObject) {
            this.observedObject = Obj.clone(observedObject, true);
        }
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    getObservedObject: function() {
        return this.observedObject;
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    toObject: function() {
        var object = {};
        this.forIn(function(propertyName, propertyValue) {
            object[propertyName] = propertyValue;
        });
        return object;
    },


    //-------------------------------------------------------------------------------
    // Observable Methods
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @param {ObservableChange} change
     */
    propagateChange: function(change) {
        var _this = this;
        var propertyNames = this.findPropertyNamesByObservable(change.getReportingObservable());
        propertyNames.forEach(function(propertyName) {
            var changeClone = change.clone();
            var objectPath = changeClone.getObjectPath();
            if (objectPath !== "") {
                objectPath = "." + objectPath;
            }
            objectPath = propertyName + objectPath;
            changeClone.setObjectPath(objectPath);
            _this._super(changeClone);
        });
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    clearProperties: function() {
        var _this = this;
        this.observedObject = {};
        this.observablePropertyMap.forEach(function(observable, propertyName) {
            _this.removeObservableProperty(propertyName);
        });

    },

    /**
     * @param {function(string, *)} func
     */
    forIn: function(func) {
        Obj.forIn(this.observedObject, func);
    },

    /**
     * @param {string} propertyName
     * @return {*}
     */
    getProperty: function(propertyName) {
        return Obj.getProperty(this.observedObject, propertyName);
    },

    /**
     * @param {string} propertyName
     * @returns {*}
     */
    hasProperty: function(propertyName) {
        return Obj.hasProperty(this.observedObject, propertyName);
    },

    /**
     * @param {string} propertyName
     */
    removeProperty: function(propertyName) {
        if (Obj.hasProperty(this.observedObject, propertyName)) {
            var previousValue = this.getProperty(propertyName);
            if (this.hasObservableProperty(propertyName)) {
                this.removeObservableProperty(propertyName);
            }
            delete this.observedObject[propertyName];
            this.notifyObservers(new RemovePropertyChange(propertyName, propertyName, previousValue));
        }
    },

    /**
     * @param {string} propertyName
     * @param {*} propertyValue
     */
    setProperty: function(propertyName, propertyValue) {
        var previousValue = this.getProperty(propertyName);
        if (!Obj.equals(previousValue, propertyValue)) {
            if (this.hasObservableProperty(propertyName)) {
                this.removeObservableProperty(propertyName);
            }
            this.observedObject[propertyName] = propertyValue;
            if (Class.doesImplement(propertyValue, IObservable)) {
                this.putObservableProperty(propertyName, propertyValue);
            }
            this.notifyObservers(new SetPropertyChange(propertyName, propertyName, propertyValue, previousValue));
        }
    },

    /**
     * @param {Object} propertiesObject
     */
    setProperties: function(propertiesObject) {
        var _this = this;
        Obj.forIn(propertiesObject, function(propertyName, propertyValue) {
            _this.setProperty(propertyName, propertyValue);
        });
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {IObservable} observable
     * @returns {boolean}
     */
    containsObservable: function(observable) {
        return this.observablePropertyMap.containsValue(observable);
    },

    /**
     * @private
     * @param {IObservable} observable
     * @returns {Collection.<string>}
     */
    findPropertyNamesByObservable: function(observable) {
        return this.observablePropertyMap.getKeys(observable)
    },

    /**
     * @private
     * @param {string} propertyName
     * @returns {IObservable}
     */
    getObservableProperty: function(propertyName) {
        return this.observablePropertyMap.get(propertyName);
    },

    /**
     * @private
     * @param {string} propertyName
     * @return {boolean}
     */
    hasObservableProperty: function(propertyName) {
        return this.observablePropertyMap.containsKey(propertyName);
    },

    /**
     * @private
     * @param propertyName
     * @param observable
     */
    putObservableProperty: function(propertyName, observable) {
        this.observablePropertyMap.put(propertyName, observable);
        observable.addChangePropagator(this);
    },

    /**
     * @private
     * @param {string} propertyName
     */
    removeObservableProperty: function(propertyName) {
        var observable = this.getObservableProperty(propertyName);
        this.observablePropertyMap.remove(propertyName);
        if (!this.containsObservable(observable)) {
            observable.removeChangePropagator(this);
        }
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(ObservableObject, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('ObservableObject', ObservableObject);
