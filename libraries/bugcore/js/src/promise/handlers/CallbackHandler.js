/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('CallbackHandler')

//@Require('Class')
//@Require('Exception')
//@Require('Handler')
//@Require('ParallelException')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Exception           = bugpack.require('Exception');
    var Handler             = bugpack.require('Handler');
    var ParallelException   = bugpack.require('ParallelException');
    var TypeUtil            = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Handler}
     */
    var CallbackHandler = Class.extend(Handler, {

        _name: 'CallbackHandler',


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(Throwable, *...):*} callbackFunction
         * @param {Promise} forwardPromise
         */
        _constructor: function(callbackFunction, forwardPromise) {

            this._super(forwardPromise);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {function(Throwable, *...):*}
             */
            this.callbackFunction   = callbackFunction;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {function(Throwable, *...):*}
         */
        getCallbackFunction: function() {
            return this.callbackFunction;
        },


        //-------------------------------------------------------------------------------
        // Handler Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<*>} values
         */
        doHandleFulfilled: function(values) {
            if (TypeUtil.isFunction(this.getCallbackFunction())) {
                try {
                    var result = this.callbackFunction.apply(null, [null].concat(values));
                    if (TypeUtil.isUndefined(result)) {
                        this.getForwardPromise().resolvePromise([]);
                    } else {
                        this.getForwardPromise().resolvePromise([result]);
                    }
                } catch(e) {
                    this.getForwardPromise().rejectPromise([e]);
                }
            } else {
                this.getForwardPromise().resolvePromise(values);
            }
        },

        /**
         * @param {Array.<*>} reasons
         */
        doHandleRejected: function(reasons) {
            if (TypeUtil.isFunction(this.getCallbackFunction())) {
                var exception = null;
                if (reasons.length > 1) {
                    exception = new ParallelException('MultipleRejectionsException', {}, 'Multiple rejection reasons', reasons);
                } else if (reasons.length === 1) {
                    exception = reasons[0];
                } else {
                    exception = new Exception('PromiseRejected', {}, 'Promise was rejected with no reasons given');
                }
                try {
                    var result = this.callbackFunction.call(null, exception);
                    if (TypeUtil.isUndefined(result)) {
                        this.getForwardPromise().resolvePromise([]);
                    } else {
                        this.getForwardPromise().resolvePromise([result]);
                    }
                } catch(e) {
                    this.getForwardPromise().rejectPromise([e]);
                }
            } else {
                this.getForwardPromise().rejectPromise(reasons);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('CallbackHandler', CallbackHandler);
});
