//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Constructor')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructor
     */
    var Constructor = function() {

        /**
         * @private
         * @type {Class}
         */
        this._class = null;
    };


    //-------------------------------------------------------------------------------
    // Prototype
    //-------------------------------------------------------------------------------

    Constructor.prototype = {

        /**
         * @constructs
         */
        _constructor: function() {

        },

        /**
         * @return {Class}
         */
        getClass: function() {
            return this._class;
        }
    };


    //-------------------------------------------------------------------------------
    // Static Private Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @private
     * @type {Class}
     */
    Constructor._class = null;


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @return {Class}
     */
    Constructor.getClass = function() {
        return this._class;
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Constructor', Constructor);
});
