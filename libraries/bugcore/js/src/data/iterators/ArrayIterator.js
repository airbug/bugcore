/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ArrayIterator')

//@Require('Class')
//@Require('Exception')
//@Require('IIterator')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Exception   = bugpack.require('Exception');
    var IIterator   = bugpack.require('IIterator');
    var Obj         = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IIterator.<I>}
     * @template I
     */
    var ArrayIterator = Class.extend(Obj, {

        _name: "ArrayIterator",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Array.<I>} array
         */
        _constructor: function(array) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Array.<I>}
             */
            this.array      = array;

            /**
             * @private
             * @type {number}
             */
            this.index      = -1;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        hasNext: function() {
            return (this.index < (this.array.length - 1));
        },

        /**
         * @return {I}
         */
        next: function() {
            if (this.hasNext()) {
                this.index++;
                return this.array[this.index];
            } else {
                throw new Exception("NoSuchElement", {}, "End of iteration reached.");
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(ArrayIterator, IIterator);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ArrayIterator', ArrayIterator);
});
