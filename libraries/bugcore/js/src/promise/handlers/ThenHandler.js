/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ThenHandler')

//@Require('Class')
//@Require('Handler')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Handler     = bugpack.require('Handler');
    var TypeUtil    = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Handler}
     */
    var ThenHandler = Class.extend(Handler, {

        _name: "ThenHandler",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(*...):*} fulfilledFunction
         * @param {function(*...):*} rejectedFunction
         * @param {Promise} forwardPromise
         */
        _constructor: function(fulfilledFunction, rejectedFunction, forwardPromise) {

            this._super(forwardPromise);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {function(*...):*}
             */
            this.fulfilledFunction  = fulfilledFunction;

            /**
             * @private
             * @type {function(*...):*}
             */
            this.rejectedFunction   = rejectedFunction;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {function(*...):*}
         */
        getFulfilledFunction: function() {
            return this.fulfilledFunction;
        },

        /**
         * @return {function(*...):*}
         */
        getRejectedFunction: function() {
            return this.rejectedFunction;
        },


        //-------------------------------------------------------------------------------
        // Handler Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array<*>} values
         */
        doHandleFulfilled: function(values) {
            if (TypeUtil.isFunction(this.getFulfilledFunction())) {
                this.fireHandleMethod(this.getFulfilledFunction(), values);
            } else {
                this.getForwardPromise().resolve(values);
            }
        },

        /**
         * @param {Array<*>} reasons
         */
        doHandleRejected: function(reasons) {
            if (TypeUtil.isFunction(this.getRejectedFunction())) {
                this.fireHandleMethod(this.getRejectedFunction(), reasons);
            } else {
                this.getForwardPromise().reject(reasons);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ThenHandler', ThenHandler);
});
