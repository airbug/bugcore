/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Promise')

//@Require('ArgUtil')
//@Require('Bug')
//@Require('CallbackHandler')
//@Require('CatchHandler')
//@Require('Class')
//@Require('FinallyHandler')
//@Require('IPromise')
//@Require('List')
//@Require('Obj')
//@Require('Resolver')
//@Require('ThenHandler')
//@Require('Tracer')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgUtil             = bugpack.require('ArgUtil');
    var Bug                 = bugpack.require('Bug');
    var CallbackHandler     = bugpack.require('CallbackHandler');
    var CatchHandler        = bugpack.require('CatchHandler');
    var Class               = bugpack.require('Class');
    var FinallyHandler      = bugpack.require('FinallyHandler');
    var IPromise            = bugpack.require('IPromise');
    var List                = bugpack.require('List');
    var Obj                 = bugpack.require('Obj');
    var Resolver            = bugpack.require('Resolver');
    var ThenHandler         = bugpack.require('ThenHandler');
    var Tracer              = bugpack.require('Tracer');
    var TypeUtil            = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $error              = Tracer.$error;
    var $trace              = Tracer.$trace;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IPromise}
     */
    var Promise = Class.extend(Obj, {

        _name: 'Promise',


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
             * @type {List.<Handler>}
             */
            this.handlerList            = new List();

            /**
             * @private
             * @type {number}
             */
            this.processIndex           = 0;

            /**
             * @private
             * @type {boolean}
             */
            this.processing            = false;

            /**
             * @private
             * @type {List.<*>}
             */
            this.reasonList             = new List();

            /**
             * @private
             * @type {Resolver}
             */
            this.resolver               = null;

            /**
             * @private
             * @type {boolean}
             */
            this.resolving              = false;

            /**
             * @private
             * @type {Promise.State}
             */
            this.state                  = Promise.State.PENDING;

            /**
             * @private
             * @type {List.<*>}
             */
            this.valueList              = new List();
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(function(*...), function(*...))=} promiseMethod
         * @return {Promise}
         */
        init: function(promiseMethod) {
            var _this = this._super();

            if (_this) {
                if (TypeUtil.isFunction(promiseMethod)) {
                    promiseMethod.call(_this,
                        function() {
                            _this.resolvePromise(ArgUtil.toArray(arguments));
                        },
                        function() {
                             _this.rejectPromise(ArgUtil.toArray(arguments));
                        }
                    );
                }
            }

            return _this;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {List.<Handler>}
         */
        getHandlerList: function() {
            return this.handlerList;
        },

        /**
         * @return {List.<*>}
         */
        getReasonList: function() {
            return this.reasonList;
        },

        /**
         * @return {Resolver}
         */
        getResolver: function() {
            return this.resolver;
        },

        /**
         * @return {boolean}
         */
        getResolving: function() {
            return this.resolving;
        },

        /**
         * @return {Promise.State}
         */
        getState: function() {
            return this.state;
        },

        /**
         * @return {List.<*>}
         */
        getValueList: function() {
            return this.valueList;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        isFulfilled: function() {
            return this.state === Promise.State.FULFILLED;
        },

        /**
         * @return {boolean}
         */
        isPending: function() {
            return this.state === Promise.State.PENDING;
        },

        /**
         * @return {boolean}
         */
        isProcessing: function() {
            return this.processing;
        },

        /**
         * @return {boolean}
         */
        isRejected: function() {
            return this.state === Promise.State.REJECTED;
        },

        /**
         * @return {boolean}
         */
        isResolving: function() {
            return this.resolving;
        },


        //-------------------------------------------------------------------------------
        // IPromise Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable, *...=)} callback
         * @return {Promise}
         */
        callback: function(callback) {
            var handler = this.generateCallbackHandler(callback);
            this.processHandlers();
            return handler.getForwardPromise();
        },

        /**
         * @param {function(...):*=} catchFunction
         * @return {Promise}
         */
        'catch': function(catchFunction) {
            var handler = this.generateCatchHandler(catchFunction);
            this.processHandlers();
            return handler.getForwardPromise();
        },

        /**
         * @param {function():*=} finallyFunction
         * @return {Promise}
         */
        'finally': function(finallyFunction) {
            var handler = this.generateFinallyHandler(finallyFunction);
            this.processHandlers();
            return handler.getForwardPromise();
        },

        /**
         * @param {function(...*):*=} fulfilledFunction
         * @param {function(...*):*=} rejectedFunction
         * @return {Promise}
         */
        then: function(fulfilledFunction, rejectedFunction) {
            var handler = this.generateThenHandler(fulfilledFunction, rejectedFunction);
            this.processHandlers();
            return handler.getForwardPromise();
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Array.<*>} reasons
         * @return {Promise}
         */
        rejectPromise: function(reasons) {
            if (!this.isPending()) {
                throw new Bug('IllegalState', {}, 'Promise is no longer pending. Cannot reject a promise that is not pending.');
            }
            if (this.isResolving()) {
                throw new Bug('IllegalState', {}, 'Promise is already resolving. Cannot resolve a promise that is already resolving.');
            }
            this.doRejectPromise(reasons);
            return this;
        },

        /**
         * @protected
         * @param {Array.<*>} values
         * @return {Promise}
         */
        resolvePromise: function(values) {
            if (!this.isPending()) {
                throw new Bug('IllegalState', {}, 'Promise is no longer pending. Cannot resolve a promise that is not pending.');
            }
            if (this.isResolving()) {
                throw new Bug('IllegalState', {}, 'Promise is already resolving. Cannot resolve a promise that is already resolving.');
            }
            this.doResolvePromise(values);
            return this;
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Array.<*>} values
         */
        doFulfillPromise: function(values) {
            if (this.isPending()) {
                this.resolving  = false;
                this.state      = Promise.State.FULFILLED;
                this.valueList.addAll(values);
                this.processHandlers();
            } else {
                throw new Bug('PromiseAlreadyResolved', 'Promise has already been resolved');
            }
        },

        /**
         * @private
         */
        doProcessHandlers: function() {
            var _this       = this;
            this.processing = true;

            //NOTE BRN: This setTimeout fulfills the 2.2.4 portion of the Promises A+ spec
            //2.2.4: onFulfilled or onRejected must not be called until the execution context stack contains only platform code.

            setTimeout($trace(function() {
                while (_this.processIndex < _this.handlerList.getCount()) {
                    _this.processHandler(_this.processIndex);
                    _this.processIndex++;
                }
                _this.processing = false;
            }), 0);
        },

        /**
         * @protected
         * @param {Array.<*>} reasons
         */
        doRejectPromise: function(reasons) {
            if (this.isPending()) {
                reasons.forEach(function(reason) {
                    $error(reason);
                });
                this.resolving  = false;
                this.state      = Promise.State.REJECTED;
                this.reasonList.addAll(reasons);
                this.processHandlers();
            } else {
                throw new Bug('PromiseAlreadyResolved', 'Promise has already been resolved');
            }
        },

        /**
         * @private
         * @param {Array.<*>} values
         */
        doResolvePromise: function(values) {
            var _this       = this;
            this.resolving  = true;
            this.resolver   = new Resolver([this], values);
            this.resolver.resolve(function(reasons, values) {
                if (reasons.length > 0) {
                    _this.doRejectPromise(reasons);
                } else {
                    _this.doFulfillPromise(values);
                }
            });
        },

        /**
         * @private
         * @param {function(Throwable, *...):*} callbackFunction
         * @param {Promise} forwardPromise
         * @return {CallbackHandler}
         */
        factoryCallbackHandler: function(callbackFunction, forwardPromise) {
            return new CallbackHandler(callbackFunction, forwardPromise);
        },

        /**
         * @private
         * @param {function(*...):*} catchFunction
         * @param {Promise} forwardPromise
         * @return {CatchHandler}
         */
        factoryCatchHandler: function(catchFunction, forwardPromise) {
            return new CatchHandler(catchFunction, forwardPromise);
        },

        /**
         * @private
         * @param {function(*...):*} finallyFunction
         * @param {Promise} forwardPromise
         * @return {FinallyHandler}
         */
        factoryFinallyHandler: function(finallyFunction, forwardPromise) {
            return new FinallyHandler(finallyFunction, forwardPromise);
        },

        /**
         * @private
         * @param {function(*...):*} fulfilledFunction
         * @param {function(*...):*} rejectedFunction
         * @param {Promise} forwardPromise
         * @return {ThenHandler}
         */
        factoryThenHandler: function(fulfilledFunction, rejectedFunction, forwardPromise) {
            return new ThenHandler(fulfilledFunction, rejectedFunction, forwardPromise);
        },

        /**
         * @private
         * @param {function(Throwable, *...):*} callbackFunction
         * @return {CallbackHandler}
         */
        generateCallbackHandler: function(callbackFunction) {
            var forwardPromise  = new Promise();
            var handler = this.factoryCallbackHandler(callbackFunction, forwardPromise);
            this.handlerList.add(handler);
            return handler;
        },

        /**
         * @private
         * @param {function(*...):*} catchFunction
         * @return {CatchHandler}
         */
        generateCatchHandler: function(catchFunction) {
            var forwardPromise  = new Promise();
            var handler = this.factoryCatchHandler(catchFunction, forwardPromise);
            this.handlerList.add(handler);
            return handler;
        },

        /**
         * @private
         * @param {function(*...):*} finallyFunction
         * @return {FinallyHandler}
         */
        generateFinallyHandler: function(finallyFunction) {
            var forwardPromise  = new Promise();
            var handler = this.factoryFinallyHandler(finallyFunction, forwardPromise);
            this.handlerList.add(handler);
            return handler;
        },

        /**
         * @private
         * @param {function(*...):*} fulfilledFunction
         * @param {function(*...):*} rejectedFunction
         * @return {ThenHandler}
         */
        generateThenHandler: function(fulfilledFunction, rejectedFunction) {
            var forwardPromise  = new Promise();
            var handler = this.factoryThenHandler(fulfilledFunction, rejectedFunction, forwardPromise);
            this.handlerList.add(handler);
            return handler;
        },

        /**
         * @private
         * @param {number} index
         */
        processHandler: function(index) {
            var handler = this.handlerList.getAt(index);
            if (this.isFulfilled()) {
                var values = this.valueList.toArray();
                handler.handleFulfilled(values);
            } else {
                var reasons = this.reasonList.toArray();
                handler.handleRejected(reasons);
            }
        },

        /**
         * @private
         */
        processHandlers: function() {
            if (!this.isPending() && !this.isProcessing()) {
                this.doProcessHandlers();
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(Promise, IPromise);


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    Promise.State = {
        FULFILLED: 'fulfilled',
        PENDING: 'pending',
        REJECTED: 'rejected'
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Promise', Promise);
});
