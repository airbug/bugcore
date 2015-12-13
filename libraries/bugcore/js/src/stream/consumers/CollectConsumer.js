/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('CollectConsumer')

//@Require('Class')
//@Require('Consumer')
//@Require('ICollection')
//@Require('Throwables')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Consumer        = bugpack.require('Consumer');
    var ICollection     = bugpack.require('ICollection');
    var Throwables      = bugpack.require('Throwables');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Consumer.<I>}
     * @template I
     */
    var CollectConsumer = Class.extend(Consumer, {

        _name: 'CollectConsumer',


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ICollection.<I>}
             */
            this.collection     = null;
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {ISupplier.<I>} supplier
         * @param {ICollection.<I>} collection
         * @return {CollectConsumer}
         */
        init: function(supplier, collection) {
            this._super(supplier);
            if (Class.doesImplement(collection, ICollection)) {
                this.collection = collection;
            } else {
                throw Throwables.illegalArgumentBug('collection', collection, '"collection" must implement ICollection');
            }
            return this;
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
