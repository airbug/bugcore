/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ReduceConsumer')

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
    var ReduceConsumer = Class.extend(Consumer, {

        _name: "ReduceConsumer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ISupplier.<I>} supplier
         * @param {*} memo
         * @param {function(*, I):*} reduceMethod
         */
        _constructor: function(supplier, memo, reduceMethod) {

            this._super(supplier);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {*}
             */
            this.memo           = memo;

            /**
             * @private
             * @type {function(*, I): *}
             */
            this.reduceMethod   = reduceMethod;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {*}
         */
        getMemo: function() {
            return this.memo;
        },

        /**
         * @return {function(*, I): *}
         */
        getReduceMethod: function() {
            return this.reduceMethod;
        },


        //-------------------------------------------------------------------------------
        // Consumer Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {I} item
         */
        doAccept: function(item) {
            this.memo = this.reduceMethod(this.memo, item);
        },

        /**
         * @return {*}
         */
        doConsume: function() {
            return this.memo;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ReduceConsumer', ReduceConsumer);
});
