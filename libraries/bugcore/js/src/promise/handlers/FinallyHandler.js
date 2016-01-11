/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('FinallyHandler')

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
    var FinallyHandler = Class.extend(Handler, {

        _name: "FinallyHandler",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(*...):*} finallyFunction
         * @param {Promise} forwardPromise
         */
        _constructor: function(finallyFunction, forwardPromise) {

            this._super(forwardPromise);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {function(*...):*}
             */
            this.finallyFunction    = finallyFunction;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {function(*...):*}
         */
        getFinallyFunction: function() {
            return this.finallyFunction;
        },


        //-------------------------------------------------------------------------------
        // Handler Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array<*>} values
         */
        doHandleFulfilled: function(values) {
            this.doHandleFinally();
        },

        /**
         * @param {Array<*>} reasons
         */
        doHandleRejected: function(reasons) {
            this.doHandleFinally();
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        doHandleFinally: function() {
            if (TypeUtil.isFunction(this.getFinallyFunction())) {
                this.fireHandleMethod(this.getFinallyFunction(), []);
            } else {
                this.getForwardPromise().resolve([]);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('FinallyHandler', FinallyHandler);
});
