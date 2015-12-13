/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ObjectPathMatcher')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var ObjectPathMatcher = Class.extend(Obj, {

        _name: 'ObjectPathMatcher',


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} objectPathPattern
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
            this.objectPathPatternParts     = objectPathPattern.split('.');
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
            var pathParts       = path.split('.');
            for (var i = 0, size = pathParts.length; i < size; i++) {
                var pathPart    = pathParts[i];
                var patternPart = patternParts[i];
                if (patternPart === '*') {
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
});
