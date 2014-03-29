//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IChangePropagator')

//@Require('Interface')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Interface = bugpack.require('Interface');


//-------------------------------------------------------------------------------
// Declare Interface
//-------------------------------------------------------------------------------

/**
 * @interface
 */
var IChangePropagator = Interface.declare({

    //-------------------------------------------------------------------------------
    // Interface Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {IChangePropagator} changePropagator
     */
    addChangePropagator: function(changePropagator) {},

    /**
     * @param {ObservableChange} change
     */
    propagateChange: function(change) {},

    /**
     * @param {IChangePropagator} changePropagator
     */
    removeChangePropagator: function(changePropagator) {}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('IChangePropagator', IChangePropagator);
