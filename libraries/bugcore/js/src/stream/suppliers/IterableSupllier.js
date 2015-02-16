/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IterableSupplier')

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
    var IterableSupplier = Class.extend(Supplier, {

        _name: "IterableSupplier",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {IIterable.<I>} iterable
         */
        _constructor: function(iterable) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {IIterable.<I>}
             */
            this.iterable   = iterable;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {IIterable.<I>}
         */
        getIterable: function() {
            return this.iterable;
        },


        //-------------------------------------------------------------------------------
        // Supplier Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        doStart: function() {
            var _this = this;
            this.iterable.forEach(function(item) {
                _this.push(item);
            });
            this.doEnd();
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('IterableSupplier', IterableSupplier);
});
