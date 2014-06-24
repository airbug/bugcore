/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
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

            /**
             * @private
             * @type {IIterator.<I>}
             */
            this.iterator   = iterable.iterator();
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

        /**
         * @return {IIterator.<I>}
         */
        getIterator: function() {
            return this.iterator;
        },


        //-------------------------------------------------------------------------------
        // Supplier Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        doStart: function() {
            while (this.iterator.hasNext()) {
                var next = this.iterator.next();
                this.push(next);
            }
            this.doEnd();
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('IterableSupplier', IterableSupplier);
});
