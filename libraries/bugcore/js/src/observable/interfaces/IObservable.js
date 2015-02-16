/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IObservable')

//@Require('IObservationPropagator')
//@Require('Interface')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var IObservationPropagator  = bugpack.require('IObservationPropagator');
    var Interface               = bugpack.require('Interface');


    //-------------------------------------------------------------------------------
    // Declare Interface
    //-------------------------------------------------------------------------------

    /**
     * @interface
     * @extends {IObservationPropagator}
     */
    var IObservable = Interface.extend(IObservationPropagator, {

        _name: "IObservable",


        //-------------------------------------------------------------------------------
        // Interface Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {(string | Array.<string>)} changeTypes
         * @param {(string | Array.<string>)} pathPatterns
         * @param {function(Observation)} observerFunction
         * @param {Object=} observerContext
         */
        addObserver: function(changeTypes, pathPatterns, observerFunction, observerContext) {},

        /**
         * @param {string} changeType
         * @param {string} pathPattern
         * @param {function(Observation)} observerFunction
         * @param {Object=} observerContext
         * @return {boolean}
         */
        hasObserver: function(changeType, pathPattern, observerFunction, observerContext) {},

        /**
         * @param {string} changeType
         * @param {string} objectPath
         * @return {boolean}
         */
        isObserving: function(changeType, objectPath) {},

        /**
         * @param {Change} change
         */
        notifyObservers: function(change) {},

        /**
         * @param {Array.<string>} paths
         * @param {Array.<string>} changeTypes
         */
        removeAllObservers: function(paths, changeTypes) {},

        /**
         * @param {(string | Array.<string>)} changeTypes
         * @param {(string | Array.<string>)} pathPatterns
         * @param {function(Observation)} observerFunction
         * @param {Object=} observerContext
         */
        removeObserver: function(changeTypes, pathPatterns, observerFunction, observerContext) {}
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('IObservable', IObservable);
});
