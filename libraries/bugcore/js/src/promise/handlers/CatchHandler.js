/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('CatchHandler')

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
    var CatchHandler = Class.extend(Handler, {

        _name: "CatchHandler",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(*...):*} catchFunction
         * @param {Promise} forwardPromise
         */
        _constructor: function(catchFunction, forwardPromise) {

            this._super(forwardPromise);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {function(*...):*}
             */
            this.catchFunction      = catchFunction;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {function(*...):*}
         */
        getCatchFunction: function() {
            return this.catchFunction;
        },


        //-------------------------------------------------------------------------------
        // Handler Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array<*>} values
         */
        doHandleFulfilled: function(values) {
            this.getForwardPromise().resolve(values);
        },

        /**
         * @param {Array<*>} reasons
         */
        doHandleRejected: function(reasons) {
            if (TypeUtil.isFunction(this.getCatchFunction())) {
                this.fireHandleMethod(this.getCatchFunction(), reasons);
            } else {
                this.getForwardPromise().resolve([]);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('CatchHandler', CatchHandler);
});
