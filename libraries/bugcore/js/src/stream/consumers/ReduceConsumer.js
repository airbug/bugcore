/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ReduceConsumer')

//@Require('Class')
//@Require('Consumer')
//@Require('Throwables')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Consumer    = bugpack.require('Consumer');
    var Throwables  = bugpack.require('Throwables');
    var TypeUtil    = bugpack.require('TypeUtil');


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
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {*}
             */
            this.memo           = null;

            /**
             * @private
             * @type {function(*, I): *}
             */
            this.reduceMethod   = null;
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {ISupplier.<I>} supplier
         * @param {*} memo
         * @param {function(*, I):*} reduceMethod
         * @return {ReduceConsumer}
         */
        init: function(supplier, memo, reduceMethod) {
            this._super(supplier);
            this.memo = memo;

            if (TypeUtil.isFunction(reduceMethod)) {
                this.reduceMethod = reduceMethod;
            } else {
                throw Throwables.illegalArgumentBug("reduceMethod", reduceMethod, "'reduceMethod' must be a function");
            }
            return this;
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
