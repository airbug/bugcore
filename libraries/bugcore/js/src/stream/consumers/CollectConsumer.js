/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('CollectConsumer')

//@Require('Class')
//@Require('Consumer')
//@Require('Exception')
//@require('ICollection')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Consumer        = bugpack.require('Consumer');
    var Exception       = bugpack.require('Exception');
    var ICollection     = bugpack.require('ICollection');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Consumer.<I>}
     * @template I
     */
    var CollectConsumer = Class.extend(Consumer, {

        _name: "CollectConsumer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ISupplier.<I>} supplier
         * @param {ICollection.<I>} collection
         */
        _constructor: function(supplier, collection) {

            this._super(supplier);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ICollection.<I>}
             */
            this.collection     = collection;
        },

        /**
         * @private
         * @param {ISupplier.<I>} supplier
         * @param {ICollection.<I>} collection
         */
        _initializer: function(supplier, collection) {
            if (!Class.doesImplement(this.collection, ICollection)) {
                throw new Exception("IllegalArgument", {}, "'collection' must implement ICollection");
            }
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {ICollection.<I>}
         */
        getCollection: function() {
            return this.collection;
        },


        //-------------------------------------------------------------------------------
        // Consumer Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {I} item
         */
        doAccept: function(item) {
            this.collection.add(item);
        },

        /**
         * @return {*}
         */
        doConsume: function() {
            return this.collection;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('CollectConsumer', CollectConsumer);
});
