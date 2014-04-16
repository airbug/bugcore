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
     * @type {Array.<Interface>}
     */
    Constructor._interfaces = [];

    /**
     * @static
     * @private
     * @type {Class}
     */
    Constructor._superclass = null;


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @return {string}
     */
    Constructor.getBugPackKey = function() {

        //NOTE BRN: Perform this check for backwards compatibility with bugpack <= 0.0.5

        if (this._bugPack) {
            return this._bugPack.bugPackKey;
        } else {
            return "";
        }
    };

    /**
     * @static
     * @return {Array.<Interface>}
     */
    Constructor.getInterfaces = function() {
        return this._interfaces;
    };

    /**
     * @static
     * @return {Class}
     */
    Constructor.getSuperClass = function() {
        return this._superclass;
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Constructor', Constructor);
});
