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
//@Require('CallbackHandler')
//@Require('CatchHandler')
//@Require('Class')
//@Require('FinallyHandler')
//@Require('IIterable')
//@Require('IMap')
//@Require('IPromise')
//@Require('List')
//@Require('Obj')
//@Require('Resolvers')
//@Require('ThenHandler')
//@Require('Throwables')
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
    var CallbackHandler     = bugpack.require('CallbackHandler');
    var CatchHandler        = bugpack.require('CatchHandler');
    var Class               = bugpack.require('Class');
    var FinallyHandler      = bugpack.require('FinallyHandler');
    var IIterable           = bugpack.require('IIterable');
    var IMap                = bugpack.require('IMap');
    var IPromise            = bugpack.require('IPromise');
    var List                = bugpack.require('List');
    var Obj                 = bugpack.require('Obj');
    var Resolvers           = bugpack.require('Resolvers');
    var ThenHandler         = bugpack.require('ThenHandler');
    var Throwables          = bugpack.require('Throwables');
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
             * @type {List<Handler>}
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
             * @type {List<*>}
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
             * @type {List<*>}
             */
            this.valueList              = new List();
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(function(...*), function(...*))=} promiseMethod
         * @return {Promise}
         */
        init: function(promiseMethod) {
            var _this = this._super();

            if (_this) {
                if (TypeUtil.isFunction(promiseMethod)) {
                    promiseMethod.call(_this,
                        function() {
                            _this.resolve(ArgUtil.toArray(arguments));
                        },
                        function() {
                             _this.reject(ArgUtil.toArray(arguments));
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
         * @return {List<Handler>}
         */
        getHandlerList: function() {
            return this.handlerList;
        },

        /**
         * @return {List<*>}
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
         * @return {List<*>}
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
         * @param {function(Throwable, ...*=)} callback
         * @return {Promise}
         */
        callback: function(callback) {
            var handler = this.generateCallbackHandler(callback);
            this.processHandlers();
            return handler.getForwardPromise();
        },

        /**
         * @param {function(...*):*=} catchFunction
         * @return {Promise}
         */
        catch: function(catchFunction) {
            var handler = this.generateCatchHandler(catchFunction);
            this.processHandlers();
            return handler.getForwardPromise();
        },

        /**
         * @param {function():*=} finallyFunction
         * @return {Promise}
         */
        finally: function(finallyFunction) {
            var handler = this.generateFinallyHandler(finallyFunction);
            this.processHandlers();
            return handler.getForwardPromise();
        },

        /**
         * @param {Array<*>} reasons
         * @return {Promise}
         */
        reject: function(reasons) {
            this.validatePromiseState();
            this.doRejectPromise(reasons);
            return this;
        },

        /**
         * @param {Array<*>} values
         * @return {Promise}
         */
        resolve: function(values) {
            this.validatePromiseState();
            this.doResolveValues(values);
            return this;
        },

        /**
         * @param {Array<(Array<*> | IIterable<*>)>} iterables
         * @return {Promise}
         */
        resolveAll: function(iterables) {
            this.validatePromiseState();
            this.validateIterables(iterables);
            this.doResolveAll(iterables);
            return this;
        },

        /**
         * @param {Array<(Object<*, *> | Map<*, *>)>} objects
         * @return {Promise}
         */
        resolveProps: function(objects) {
            this.validatePromiseState();
            this.validateObjects(objects);
            this.doResolveProps(objects);
            return this;
        },

        /**
         * @param {Array<(Array<*> | IIterable<*>)>} iterables
         * @return {Promise}
         */
        resolveRace: function(iterables) {
            this.validatePromiseState();
            this.validateIterables(iterables);
            this.doResolveRace(iterables);
            return this;
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
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Array<*>} values
         */
        doFulfillPromise: function(values) {
            if (this.isPending()) {
                this.resolving  = false;
                this.state      = Promise.State.FULFILLED;
                this.valueList.addAll(values);
                this.processHandlers();
            } else {
                throw Throwables.bug('PromiseAlreadyResolved', 'Promise has already been resolved');
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
         * @param {Array<*>} reasons
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
                throw Throwables.bug('PromiseAlreadyResolved', 'Promise has already been resolved');
            }
        },

        /**
         * @private
         */
        doResolve: function() {
            var _this       = this;
            this.resolving  = true;
            this.resolver.resolve(function(values) {
                _this.doFulfillPromise(values);
            }, function(reasons) {
                _this.doRejectPromise(reasons);
            });
        },

        /**
         * @private
         * @param {Array<(Array<*> | IIterable<*>)>} iterables
         */
        doResolveAll: function(iterables) {
            this.resolver   = Resolvers.resolveAll([this], iterables);
            this.doResolve();
        },

        /**
         * @private
         * @param {Array<(Object<*, *> | IMap<*, *>)>} objects
         */
        doResolveProps: function(objects) {
            this.resolver   = Resolvers.resolveProps([this], objects);
            this.doResolve();
        },

        /**
         * @private
         * @param {Array<(Array<*> | IIterable<*>)>} iterables
         */
        doResolveRace: function(iterables) {
            this.resolver   = Resolvers.resolveRace([this], iterables);
            this.doResolve();
        },

        /**
         * @private
         * @param {Array<*>} values
         */
        doResolveValues: function(values) {
            this.resolver   = Resolvers.resolveValues([this], values);
            this.doResolve();
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
        },

        /**
         * @private
         * @param {Array.<(Array.<*> | IIterable<*>)>} iterables
         */
        validateIterables: function(iterables) {
            iterables.forEach(function(iterable) {
                if (!TypeUtil.isArray(iterable) && !Class.doesImplement(iterable, IIterable)) {
                    throw Throwables.bug('TypeError', {}, 'Expecting an array or an iterable object but got ' + iterable);
                }
            })
        },

        /**
         * @private
         * @param {Array<(Object<*, *> | IMap<*, *>)>} objects
         * @throws {Bug}
         */
        validateObjects: function(objects) {
            objects.forEach(function(object) {
                if (!TypeUtil.isObject(object) && !Class.doesImplement(object, IMap)) {
                    throw Throwables.bug('TypeError', {}, 'Expecting an object or an IMap but got ' + object);
                }
            })
        },

        /**
         * @private
         * @throws {Bug}
         */
        validatePromiseState: function() {
            if (!this.isPending()) {
                throw Throwables.bug('IllegalState', {}, 'Promise is no longer pending. Cannot resolve a promise that is not pending.');
            }
            if (this.isResolving()) {
                throw Throwables.bug('IllegalState', {}, 'Promise is already resolving. Cannot resolve a promise that is already resolving.');
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
    // Static Mehtods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {...(Array<*> | IIterable<*>)} iterable
     * @return {Promise}
     */
    Promise.all = function(iterable) {
        return Promise.promise()
            .resolveAll(ArgUtil.toArray(arguments));
    };

    /**
     * @static
     * @param {function(function(...*), function(...*))=} promiseMethod
     * @return {Promise}
     */
    Promise.promise = function(promiseMethod) {
        return new Promise(promiseMethod);
    };

    /**
     * @static
     * @param {...(Object<*, *> | IMap<*, *>)} object
     * @return {Promise}
     */
    Promise.props = function(object) {
        return Promise.promise()
            .resolveProps(ArgUtil.toArray(arguments));
    };

    /**
     * @static
     * @param {...(Array<*> | IIterable<*>)} iterable
     * @return {Promise}
     */
    Promise.race = function(iterable) {
        return Promise.promise()
            .resolveRace(ArgUtil.toArray(arguments));
    };

    /**
     * @static
     * @param {...*} reason
     * @return {Promise}
     */
    Promise.reject = function(reason) {
        return Promise.promise()
            .reject(ArgUtil.toArray(arguments));
    };

    /**
     * @static
     * @param {...*} value
     * @returns {Promise}
     */
    Promise.resolve = function(value) {
        return Promise.promise()
            .resolve(ArgUtil.toArray(arguments));
    };

    /**
     * @static
     * @param {function(...*):*} promiseMethod
     * @returns {Promise}
     */
    Promise.try = function(promiseMethod) {
        return Promise.promise()
            .resolve([])
            .then(promiseMethod);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Promise', Promise);
});
