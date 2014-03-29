//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ObjectPathMatcher')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ObjectPathMatcher = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} objectPathPattern
     * @extends {Obj}
     */
    _constructor: function(objectPathPattern) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.objectPathPattern          = objectPathPattern;

        /**
         * @private
         * @type {Array.<string>}
         */
        this.objectPathPatternParts     = objectPathPattern.split(".");
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} path
     * @return {boolean}
     */
    match: function(path) {
        var patternParts    = this.objectPathPatternParts;
        var pathParts       = path.split(".");
        for (var i = 0, size = pathParts.length; i < size; i++) {
            var pathPart    = pathParts[i];
            var patternPart = patternParts[i];
            if (patternPart === "*") {
                return true;
            } else if (pathPart !== patternPart) {
                return false;
            }
        }
        if (pathParts.length === patternParts.length) {
            return true;
        }
        return false;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('ObjectPathMatcher', ObjectPathMatcher);
