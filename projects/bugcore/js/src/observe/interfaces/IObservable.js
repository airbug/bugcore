//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IObservable')

//@Require('IChangePropagator')
//@Require('Interface')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var IChangePropagator   = bugpack.require('IChangePropagator');
var Interface           = bugpack.require('Interface');


//-------------------------------------------------------------------------------
// Declare Interface
//-------------------------------------------------------------------------------

/**
 * @interface
 * @extends {IChangePropagator}
 */
var IObservable = Interface.extend(IChangePropagator, {

    //-------------------------------------------------------------------------------
    // Interface Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {(string | Array.<string>)} changeTypes
     * @param {(string | Array.<string>)} pathPatterns
     * @param {function(ObservableChange)} observerFunction
     * @param {Object=} observerContext
     */
    addObserver: function(changeTypes, pathPatterns, observerFunction, observerContext) {},

    /**
     * @param {string} changeType
     * @param {string} pathPattern
     * @param {function(ObservableChange)} observerFunction
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
     * @param {ObservableChange} change
     */
    notifyObservers: function(change) {},

    /**
     *
     */
    removeAllObservers: function(paths, changeTypes) {},

    /**
     * @param {(string | Array.<string>)} changeTypes
     * @param {(string | Array.<string>)} pathPatterns
     * @param {function(ObservableChange)} observerFunction
     * @param {Object=} observerContext
     */
    removeObserver: function(changeTypes, pathPatterns, observerFunction, observerContext) {}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('IObservable', IObservable);
