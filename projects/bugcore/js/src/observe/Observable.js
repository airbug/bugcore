//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Observable')

//@Require('ArgumentBug')
//@Require('ChangePropagator')
//@Require('Class')
//@Require('IObservable')
//@Require('MultiListMap')
//@Require('Observer')
//@Require('Set')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgumentBug         = bugpack.require('ArgumentBug');
var ChangePropagator    = bugpack.require('ChangePropagator');
var Class               = bugpack.require('Class');
var IObservable         = bugpack.require('IObservable');
var MultiListMap        = bugpack.require('MultiListMap');
var Observer            = bugpack.require('Observer');
var Set                 = bugpack.require('Set');
var TypeUtil            = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {ChangePropagator}
 * @implements {IObservable}
 */
var Observable = Class.extend(ChangePropagator, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MultiListMap.<string, Observer>}
         */
        this.changeTypeObserverMap      = new MultiListMap();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {MultiListMap.<string, Observer>}
     */
    getChangeTypeObserverMap: function() {
        return this.changeTypeObserverMap;
    },


    //-------------------------------------------------------------------------------
    // IObservable Implementation
    //-------------------------------------------------------------------------------
        
    /**
     * @param {(string | Array.<string>)} changeTypes
     * @param {(string | Array.<string>)} objectPathPatterns
     * @param {function(ObservableChange)} observerFunction
     * @param {Object=} observerContext
     */
    addObserver: function(changeTypes, objectPathPatterns, observerFunction, observerContext) {
        if (!TypeUtil.isArray(changeTypes) && !TypeUtil.isString(changeTypes)) {
            throw new ArgumentBug(ArgumentBug.ILLEGAL, "changeTypes", changeTypes, "parameter must either be an Array or a string");
        }
        if (!TypeUtil.isArray(objectPathPatterns) && !TypeUtil.isString(objectPathPatterns)) {
            throw new ArgumentBug(ArgumentBug.ILLEGAL, "objectPathPatterns", objectPathPatterns, "parameter must either be an Array or a string");
        }
        this.buildObservers(changeTypes, objectPathPatterns, observerFunction, observerContext);
    },

    /**
     * @param {string} changeType
     * @param {string} pathPattern
     * @param {function(ObservableChange)} observerFunction
     * @param {Object=} observerContext
     * @return {boolean}
     */
    hasObserver: function(changeType, pathPattern, observerFunction, observerContext) {
        var changeTypeObserverList = this.changeTypeObserverMap.get(changeType);
        if (changeTypeObserverList) {
            var observer = this.factoryObserver(pathPattern, observerFunction, observerContext);
            return changeTypeObserverList.contains(observer);
        }
        return false;
    },

    /**
     * @param {string} changeType
     * @param {string} objectPath
     * @return {boolean}
     */
    isObserving: function(changeType, objectPath) {
        var changeTypeObserverList = this.changeTypeObserverMap.get(changeType);
        if (changeTypeObserverList) {
            var iterator = changeTypeObserverList.iterator();
            while (iterator.hasNext()) {
                var observer = iterator.next();
                if (observer.match(objectPath)) {
                    return true;
                }
            }
        }
        return false;
    },

    /**
     * @param {ObservableChange} change
     */
    notifyObservers: function(change) {
        change.setChangingObservable(this);
        change.setReportingObservable(this);
        this.propagateChangeToObservers(change);
        this.propagateChangeToPropagators(change);
    },

    /**
     * @param {(string | Array.<string>)} changeTypes
     * @param {(string | Array.<string>)} pathPatterns
     * @param {function(ObservableChange)} observerFunction
     * @param {?Object=} observerContext
     */
    removeObserver: function(changeTypes, pathPatterns, observerFunction, observerContext) {
        if (TypeUtil.isArray(pathPatterns)) {
            var observerSet = this.factoryObservers(pathPatterns, observerFunction, observerContext);
            this.detachObserversFromTypes(changeTypes, observerSet);
        } else {
            var observer = this.factoryObserver(pathPatterns, observerFunction, observerContext);
            this.detachObserverFromTypes(changeTypes, observer);
        }
    },

    /**
     *
     */
    removeAllObservers: function() {
        this.changeTypeObserverMap.clear();
    },


    //-------------------------------------------------------------------------------
    // ChangePropagator Methods
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @param {ObservableChange} change
     */
    propagateChange: function(change) {
        change.setReportingObservable(this);
        this.propagateChangeToObservers(change);
        this.propagateChangeToPropagators(change);
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} changeType
     * @param {Observer} observer
     */
    attachObserver: function(changeType, observer) {
        var changeTypeObserverList = this.changeTypeObserverMap.get(changeType);
        if (!changeTypeObserverList) {
            this.changeTypeObserverMap.put(changeType, observer);
        } else if (!changeTypeObserverList.contains(observer)) {
            changeTypeObserverList.add(observer);
        }
    },

    /**
     * @param {(string | Array.<string>)} changeTypes
     * @param {Observer} observer
     */
    attachObserverToTypes: function(changeTypes, observer) {
        var _this = this;
        if (TypeUtil.isArray(changeTypes)) {
            changeTypes.forEach(function(changeType) {
                _this.attachObserver(changeType, observer);
            });
        } else {
            this.attachObserver(changeTypes, observer);
        }
    },

    /**
     * @param {(string | Array.<string>)} changeTypes
     * @param {Set.<Observer>} observerSet
     */
    attachObserversToTypes: function(changeTypes, observerSet) {
        var _this = this;
        observerSet.forEach(function(observer) {
            _this.attachObserverToTypes(changeTypes, observer);
        });
    },

    /**
     * @param {string} changeType
     * @param {Observer} observer
     */
    detachObserver: function(changeType, observer) {
        this.changeTypeObserverMap.removeKeyValuePair(changeType, observer);
    },

    /**
     * @param {(string | Array.<string>)} changeTypes
     * @param {Observer} observer
     */
    detachObserverFromTypes: function(changeTypes, observer) {
        var _this = this;
        if (TypeUtil.isArray(changeTypes)) {
            changeTypes.forEach(function(changeType) {
                _this.detachObserver(changeType, observer);
            });
        } else {
            this.detachObserver(changeTypes, observer);
        }
    },

    /**
     * @param {(string | Array.<string>)} changeTypes
     * @param {Set.<Observer>} observerSet
     */
    detachObserversFromTypes: function(changeTypes, observerSet) {
        var _this = this;
        observerSet.forEach(function(observer) {
            _this.detachObserverFromTypes(changeTypes, observer);
        });
    },

    /**
     *
     */
    unobserve: function() {
        this.removeObserver.apply(this, arguments);
    },

    /**
     *
     */
    observe: function() {
        this.addObserver.apply(this, arguments);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {(string | Array.<string>)} changeTypes
     * @param {(string | Array.<string>)} pathPatterns
     * @param {function(ObservableChange)} observerFunction
     * @param {Object=} observerContext
     */
    buildObservers: function(changeTypes, pathPatterns, observerFunction, observerContext) {
        if (TypeUtil.isArray(pathPatterns)) {
            var observerSet = this.factoryObservers(pathPatterns, observerFunction, observerContext);
            this.attachObserversToTypes(changeTypes, observerSet);
        } else {
            var observer = this.factoryObserver(pathPatterns, observerFunction, observerContext);
            this.attachObserverToTypes(changeTypes, observer);
        }
    },

    /**
     * @private
     * @param {string} pathPattern
     * @param {function(ObservableChange)} observerFunction
     * @param {Object=} observerContext
     */
    factoryObserver: function(pathPattern, observerFunction, observerContext) {
        return new Observer(pathPattern, observerFunction, observerContext);
    },

    /**
     * @private
     * @param {Array.<string>} pathPatterns
     * @param {function(ObservableChange)} observerFunction
     * @param {Object=} observerContext
     */
    factoryObservers: function(pathPatterns, observerFunction, observerContext) {
        var _this           = this;
        var observerSet     = new Set();
        pathPatterns.forEach(function(pathPattern) {
            var observer = _this.factoryObserver(pathPattern, observerFunction, observerContext);
            observerSet.add(observer);
        });
        return observerSet;
    },

    /**
     * @private
     * @param {ObservableChange} change
     */
    propagateChangeToObservers: function(change) {
        change.setReportingObservable(this);
        var changeTypeObserverList = this.changeTypeObserverMap.get(change.getChangeType());
        if (changeTypeObserverList) {
            var iterator = changeTypeObserverList.iterator();
            while (iterator.hasNext()) {
                var observer = iterator.next();
                if (observer.match(change.getObjectPath())) {
                    observer.observeChange(change);
                }
            }
        }
    },

    /**
     * @private
     * @param {ObservableChange} change
     */
    propagateChangeToPropagators: function(change) {
        var clonePropagatorList = this.getChangePropagatorList().clone();
        clonePropagatorList.forEach(function(propagator) {
            propagator.propagateChange(change);
        });
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(Observable, IObservable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Observable', Observable);
