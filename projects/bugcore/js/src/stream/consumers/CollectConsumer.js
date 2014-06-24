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


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Consumer    = bugpack.require('Consumer');


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
         * @param {function(new:Collection)} constructor
         */
        _constructor: function(supplier, constructor) {

            this._super(supplier);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Collection.<I>}
             */
            this.collection     = null;

            /**
             * @private
             * @type {function(new:Collection)}
             */
            this.constructor    = constructor;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Collection.<I>}
         */
        getCollection: function() {
            return this.collection;
        },

        /**
         * @return {function(new:Collection)}
         */
        getConstructor: function() {
            return this.constructor;
        },


        //-------------------------------------------------------------------------------
        // Consumer Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {I} item
         */
        doAccept: function(item) {
            if (!this.collection) {
                this.collection = this.constructor.getClass().newInstance();
            }
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
