/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Handler')

//@Require('Bug')
//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug         = bugpack.require('Bug');
    var Class       = bugpack.require('Class');
    var Obj         = bugpack.require('Obj');
    var TypeUtil    = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Handler = Class.extend(Obj, {

        _name: "Handler",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Promise} forwardPromise
         */
        _constructor: function(forwardPromise) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {boolean}
             */
            this.executed           = false;

            /**
             * @private
             * @type {Promise}
             */
            this.forwardPromise     = forwardPromise;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        getExecuted: function() {
            return this.executed;
        },

        /**
         * @return {Promise}
         */
        getForwardPromise: function() {
            return this.forwardPromise;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<*>} values
         */
        handleFulfilled: function(values) {
            if (!this.getExecuted()) {
                this.executed = true;
                this.doHandleFulfilled(values);
            } else {
                throw new Bug("IllegalState", {}, "Handler cannot be executed more than once");
            }
        },

        /**
         * @param {Array.<*>} reasons
         */
        handleRejected: function(reasons) {
            if (!this.getExecuted()) {
                this.executed = true;
                this.doHandleRejected(reasons);
            } else {
                throw new Bug("IllegalState", {}, "Handler cannot be executed more than once");
            }
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {function(*...)} method
         * @param {Array.<*>} args
         */
        fireHandleMethod: function(method, args) {
            try {
                var result = method.apply(null, args);
                if (TypeUtil.isUndefined(result)) {
                    this.forwardPromise.resolvePromise([]);
                } else {
                    this.forwardPromise.resolvePromise([result]);
                }
            } catch(e) {
                this.forwardPromise.rejectPromise([e]);
            }
        },


        //-------------------------------------------------------------------------------
        // Abstract Methods
        //-------------------------------------------------------------------------------

        /**
         * @abstract
         * @param {Array.<*>} values
         */
        doHandleFulfilled: function(values) {
            throw new Bug("AbstractMethodNotImplemented", {}, "Must implement doHandleFulfilled");
        },

        /**
         * @abstract
         * @param {Array.<*>} reasons
         */
        doHandleRejected: function(reasons) {
            throw new Bug("AbstractMethodNotImplemented", {}, "Must implement doHandleRejected");
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Handler', Handler);
});
