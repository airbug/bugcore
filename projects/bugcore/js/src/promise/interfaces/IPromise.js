//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IPromise')

//@Require('Interface')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Interface   = bugpack.require('Interface');


//-------------------------------------------------------------------------------
// Declare Interface
//-------------------------------------------------------------------------------

/**
 * @interface
 */
var IPromise = Interface.declare({

    //-------------------------------------------------------------------------------
    // Interface Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(...):*=} catchFunction
     * @return {Promise}
     */
    catch: function(catchFunction) {},

    /**
     * @param {function():*=} finallyFunction
     * @return {Promise}
     */
    finally: function(finallyFunction) {},

    /**
     * @param {function(...):*=} fulfilledFunction
     * @param {function(...):*=} rejectedFunction
     * @return {Promise}
     */
    then: function(fulfilledFunction, rejectedFunction) {}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('IPromise', IPromise);
