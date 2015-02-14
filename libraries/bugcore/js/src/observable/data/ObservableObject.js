/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


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
//@Require('ObjectUtil')
//@Require('Observable')
//@Require('RemovePropertyChange')
//@Require('SetPropertyChange')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var ClearChange             = bugpack.require('ClearChange');
    var DualMap                 = bugpack.require('DualMap');
    var IObjectable             = bugpack.require('IObjectable');
    var IObservable             = bugpack.require('IObservable');
    var Obj                     = bugpack.require('Obj');
    var ObjectUtil              = bugpack.require('ObjectUtil');
    var Observable              = bugpack.require('Observable');
    var RemovePropertyChange    = bugpack.require('RemovePropertyChange');
    var SetPropertyChange       = bugpack.require('SetPropertyChange');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Observable}
     * @implements {IObjectable}
     */
    var ObservableObject = Class.extend(Observable, /** @lends {ObservableObject.prototype} */{

        _name: "ObservableObject",


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
         * @param {Observation} observation
         */
        propagateObservation: function(observation) {
            var _this = this;
            var propertyNames = this.findPropertyNamesByObservable(observation.getReportingObservable());
            propertyNames.forEach(function(propertyName) {
                var observationClone    = observation.clone();
                var observationPath     = observationClone.getObservationPath();
                if (observationPath !== "") {
                    observationPath = "." + observationPath;
                }
                observationPath = propertyName + observationPath;
                observationClone.setObservationPath(observationPath);
                _this._super(observationClone);
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
            this.notifyObservers(new ClearChange());
        },

        /**
         * @param {function(string, *)} func
         */
        forIn: function(func) {
            ObjectUtil.forIn(this.observedObject, func);
        },

        /**
         * @param {string} propertyName
         * @return {*}
         */
        getProperty: function(propertyName) {
            return ObjectUtil.getProperty(this.observedObject, propertyName);
        },

        /**
         * @param {string} propertyName
         * @return {*}
         */
        hasProperty: function(propertyName) {
            return ObjectUtil.hasProperty(this.observedObject, propertyName);
        },

        /**
         * @param {string} propertyName
         */
        removeProperty: function(propertyName) {
            if (ObjectUtil.hasProperty(this.observedObject, propertyName)) {
                var previousValue = this.getProperty(propertyName);
                if (this.hasObservableProperty(propertyName)) {
                    this.removeObservableProperty(propertyName);
                }
                delete this.observedObject[propertyName];
                this.notifyObservers(new RemovePropertyChange(propertyName, previousValue), propertyName);
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
                this.notifyObservers(new SetPropertyChange(propertyName, propertyValue, previousValue), propertyName);
            }
        },

        /**
         * @param {Object} propertiesObject
         */
        setProperties: function(propertiesObject) {
            var _this = this;
            ObjectUtil.forIn(propertiesObject, function(propertyName, propertyValue) {
                _this.setProperty(propertyName, propertyValue);
            });
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {IObservable} observable
         * @return {boolean}
         */
        containsObservable: function(observable) {
            return this.observablePropertyMap.containsValue(observable);
        },

        /**
         * @private
         * @param {IObservable} observable
         * @return {Collection.<string>}
         */
        findPropertyNamesByObservable: function(observable) {
            return this.observablePropertyMap.getKeys(observable)
        },

        /**
         * @private
         * @param {string} propertyName
         * @return {IObservable}
         */
        getObservableProperty: function(propertyName) {
            return this.observablePropertyMap.getValue(propertyName);
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
            observable.addObservationPropagator(this);
        },

        /**
         * @private
         * @param {string} propertyName
         */
        removeObservableProperty: function(propertyName) {
            var observable = this.getObservableProperty(propertyName);
            this.observablePropertyMap.removeByKey(propertyName);
            if (!this.containsObservable(observable)) {
                observable.removeObservationPropagator(this);
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
});
