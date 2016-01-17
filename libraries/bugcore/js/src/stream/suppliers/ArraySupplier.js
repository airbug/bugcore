/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ArraySupplier')

//@Require('Class')
//@Require('Supplier')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Supplier    = bugpack.require('Supplier');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Supplier}
     * @template I
     */
    var ArraySupplier = Class.extend(Supplier, {

        _name: "ArraySupplier",


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
            this.array  = array;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Array.<I>}
         */
        getArray: function() {
            return this.array;
        },


        //-------------------------------------------------------------------------------
        // Supplier Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        doStart: function() {
            var _this = this;
            this.array.forEach(function(item) {
                _this.push(item);
            });
            this.doEnd();
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ArraySupplier', ArraySupplier);
});
