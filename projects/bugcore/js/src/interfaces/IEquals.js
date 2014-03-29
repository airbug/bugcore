//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IEquals')

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
var IEquals = Interface.declare({

    //-------------------------------------------------------------------------------
    // Interface Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value1
     * @param {*} value2
     * @return {boolean}
     */
    equals: function(value1, value2) {}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('IEquals', IEquals);
