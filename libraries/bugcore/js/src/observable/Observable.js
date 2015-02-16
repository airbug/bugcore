/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Observable')

//@Require('ArgumentBug')
//@Require('Class')
//@Require('IObservable')
//@Require('MultiListMap')
//@Require('Observation')
//@Require('ObservationPropagator')
//@Require('Observer')
//@Require('Set')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgumentBug                 = bugpack.require('ArgumentBug');
    var Class                       = bugpack.require('Class');
    var IObservable                 = bugpack.require('IObservable');
    var MultiListMap                = bugpack.require('MultiListMap');
    var Observation                 = bugpack.require('Observation');
    var ObservationPropagator       = bugpack.require('ObservationPropagator');
    var Observer                    = bugpack.require('Observer');
    var Set                         = bugpack.require('Set');
    var TypeUtil                    = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ObservationPropagator}
     * @implements {IObservable}
     */
    var Observable = Class.extend(ObservationPropagator, {

        _name: "Observable",


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
         * @param {(string | Array.<string>)} pathPatterns
         * @param {function(Observation)} observerFunction
         * @param {Object=} observerContext
         */
        addObserver: function(changeTypes, pathPatterns, observerFunction, observerContext) {
            if (!TypeUtil.isArray(changeTypes) && !TypeUtil.isString(changeTypes)) {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "changeTypes", changeTypes, "parameter must either be an Array or a string");
            }
            if (!TypeUtil.isArray(pathPatterns) && !TypeUtil.isString(pathPatterns)) {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "observationPathPatterns", pathPatterns, "parameter must either be an Array or a string");
            }
            this.buildObservers(changeTypes, pathPatterns, observerFunction, observerContext);
        },

        /**
         * @param {string} changeType
         * @param {string} pathPattern
         * @param {function(Observation)} observerFunction
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
         * @param {string} observationPath
         * @return {boolean}
         */
        isObserving: function(changeType, observationPath) {
            var changeTypeObserverList = this.changeTypeObserverMap.get(changeType);
            if (changeTypeObserverList) {
                var iterator = changeTypeObserverList.iterator();
                while (iterator.hasNext()) {
                    var observer = iterator.next();
                    if (observer.match(observationPath)) {
                        return true;
                    }
                }
            }
            return false;
        },

        /**
         * @param {Change} change
         * @param {string=} observationPath
         */
        notifyObservers: function(change, observationPath) {
            observationPath = observationPath || "";
            var observation = this.factoryObservation(change, observationPath);
            observation.setChangingObservable(this);
            observation.setReportingObservable(this);
            this.propagateObservationToObservers(observation);
            this.propagateObservationToPropagators(observation);
        },

        /**
         * @param {(string | Array.<string>)} changeTypes
         * @param {(string | Array.<string>)} pathPatterns
         * @param {function(Observation)} observerFunction
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
        // ObservationPropagator Methods
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @param {Observation} change
         */
        propagateObservation: function(change) {
            change.setReportingObservable(this);
            this.propagateObservationToObservers(change);
            this.propagateObservationToPropagators(change);
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
         *
         */
        detachAllObservers: function() {
            this.changeTypeObserverMap.clear();
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
        unobserveAll: function() {
            this.detachAllObservers();
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
         * @private
         * @param {(string | Array.<string>)} changeTypes
         * @param {(string | Array.<string>)} pathPatterns
         * @param {function(Observation)} observerFunction
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
         * @param {Change} change
         * @param {string} observationPath
         * @return {Observation}
         */
        factoryObservation: function(change, observationPath) {
            return new Observation(change, observationPath);
        },

        /**
         * @private
         * @param {string} pathPattern
         * @param {function(Observation)} observerFunction
         * @param {Object=} observerContext
         */
        factoryObserver: function(pathPattern, observerFunction, observerContext) {
            return new Observer(pathPattern, observerFunction, observerContext);
        },

        /**
         * @private
         * @param {Array.<string>} pathPatterns
         * @param {function(Observation)} observerFunction
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
         * @param {Observation} observation
         */
        propagateObservationToObservers: function(observation) {
            observation.setReportingObservable(this);
            var changeTypeObserverList = this.changeTypeObserverMap.get(observation.getChangeType());
            if (changeTypeObserverList) {
                var iterator = changeTypeObserverList.iterator();
                while (iterator.hasNext()) {
                    var observer = iterator.next();
                    if (observer.match(observation.getObservationPath())) {
                        observer.observeObservation(observation);
                    }
                }
            }
        },

        /**
         * @private
         * @param {Observation} observation
         */
        propagateObservationToPropagators: function(observation) {
            var clonePropagatorList = this.getObservationPropagatorList().clone();
            clonePropagatorList.forEach(function(propagator) {
                propagator.propagateObservation(observation);
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
});
