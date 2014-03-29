//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Promise')

//@Require('Bug')
//@Require('Class')
//@Require('FinallyHandler')
//@Require('FulfilledHandler')
//@Require('IPromise')
//@Require('List')
//@Require('Obj')
//@Require('RejectedHandler')
//@Require('Resolver')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Bug                 = bugpack.require('Bug');
var Class               = bugpack.require('Class');
var FinallyHandler      = bugpack.require('FinallyHandler');
var FulfilledHandler    = bugpack.require('FulfilledHandler');
var IPromise            = bugpack.require('IPromise');
var List                = bugpack.require('List');
var Obj                 = bugpack.require('Obj');
var RejectedHandler     = bugpack.require('RejectedHandler');
var Resolver            = bugpack.require('Resolver');
var TypeUtil            = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 * @implements {IPromise}
 */
var Promise = Class.extend(Obj, {

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
     * @returns {boolean}
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
     * @param {function(...):*=} catchFunction
     * @return {Promise}
     */
    catch: function(catchFunction) {
        var forwardPromise = new Promise();
        this.generateRejectedHandler(catchFunction, forwardPromise);
        this.processHandlers();
        return forwardPromise;
    },

    /**
     * @param {function():*=} finallyFunction
     * @return {Promise}
     */
    finally: function(finallyFunction) {
        var forwardPromise = new Promise();
        this.generateFinallyHandler(finallyFunction, forwardPromise);
        this.processHandlers();
        return forwardPromise;
    },

    /**
     * @param {function(...):*=} fulfilledFunction
     * @param {function(...):*=} rejectedFunction
     * @return {Promise}
     */
    then: function(fulfilledFunction, rejectedFunction) {
        var forwardPromise = new Promise();
        this.generateFulfilledHandler(fulfilledFunction, forwardPromise);
        this.generateRejectedHandler(rejectedFunction, forwardPromise);
        this.processHandlers();
        return forwardPromise;
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
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
            throw new Bug("Promise has already been resolved");
        }
    },

    /**
     * @protected
     * @param {Array.<*>} reasons
     */
    doRejectPromise: function(reasons) {
        if (this.isPending()) {
            this.resolving  = false;
            this.state      = Promise.State.REJECTED;
            this.reasonList.addAll(reasons);
            this.processHandlers();
        } else {
            throw new Bug("Promise has already been resolved");
        }
    },

    /**
     * @protected
     * @param {Array.<*>} reasons
     */
    rejectPromise: function(reasons) {
        if (!this.isPending()) {
           throw new Bug("IllegalState", {}, "Promise is no longer pending. Cannot reject a promise that is not pending.");
        }
        if (this.isResolving()) {
            throw new Bug("IllegalState", {}, "Promise is already resolving. Cannot resolve a promise that is already resolving.");
        }
        this.doRejectPromise(reasons);
    },

    /**
     * @protected
     * @param {Array.<*>} values
     */
    resolvePromise: function(values) {
        if (!this.isPending()) {
            throw new Bug("IllegalState", {}, "Promise is no longer pending. Cannot resolve a promise that is not pending.");
        }
        if (this.isResolving()) {
            throw new Bug("IllegalState", {}, "Promise is already resolving. Cannot resolve a promise that is already resolving.");
        }
        this.doResolvePromise(values);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    doProcessHandlers: function() {
        var _this       = this;
        this.processing = true;
        setTimeout(function() {
            while (_this.processIndex < _this.handlerList.getCount()) {
                _this.processHandler(_this.processIndex);
                _this.processIndex++;
            }
            _this.processing = false;
        }, 0);
    },

    /**
     * @private
     * @param {Array.<*>} values
     */
    doResolvePromise: function(values) {
        this.resolving  = true;
        this.resolver   = new Resolver(this, values);
        this.resolver.resolve();
    },

    /**
     * @private
     * @param {function(...):*} finallyFunction
     * @param {Promise} forwardPromise
     * @return {FinallyHandler}
     */
    factoryFinallyHandler: function(finallyFunction, forwardPromise) {
        return new FinallyHandler(finallyFunction, forwardPromise);
    },

    /**
     * @private
     * @param {function(...):*} fulfilledFunction
     * @param {Promise} forwardPromise
     * @return {FulfilledHandler}
     */
    factoryFulfilledHandler: function(fulfilledFunction, forwardPromise) {
        return new FulfilledHandler(fulfilledFunction, forwardPromise);
    },

    /**
     * @private
     * @param {function(Throwable):*} rejectedFunction
     * @param {Promise} forwardPromise
     * @return {RejectedHandler}
     */
    factoryRejectedHandler: function(rejectedFunction, forwardPromise) {
        return new RejectedHandler(rejectedFunction, forwardPromise);
    },

    /**
     * @private
     * @param {function(...):*} finallyFunction
     * @param {Promise} forwardPromise
     */
    generateFinallyHandler: function(finallyFunction, forwardPromise) {
        var finallyHandler = this.factoryFinallyHandler(finallyFunction, forwardPromise);
        this.handlerList.add(finallyHandler);
    },

    /**
     * @private
     * @param {function(...):*} fulfilledFunction
     * @param {Promise} forwardPromise
     */
    generateFulfilledHandler: function(fulfilledFunction, forwardPromise) {
        var fulfilledHandler = this.factoryFulfilledHandler(fulfilledFunction, forwardPromise);
        this.handlerList.add(fulfilledHandler);
    },

    /**
     * @private
     * @param {function(Throwable):*} rejectedFunction
     * @param {Promise} forwardPromise
     */
    generateRejectedHandler: function(rejectedFunction, forwardPromise) {
        var rejectedHandler = this.factoryRejectedHandler(rejectedFunction, forwardPromise);
        this.handlerList.add(rejectedHandler);
    },

    /**
     * @private
     * @param {number} index
     */
    processHandler: function(index) {
        var handler = this.handlerList.getAt(index);
        if (Class.doesExtend(handler, FulfilledHandler)) {
            if (this.isFulfilled()) {
                var values = this.valueList.toArray();
                handler.handle(values);
            }
        } else if (Class.doesExtend(handler, RejectedHandler)) {
            if (this.isRejected()) {
                var reasons = this.reasonList.toArray();
                handler.handle(reasons)
            }
        } else if (Class.doesExtend(handler, FinallyHandler)) {
            handler.handle([]);
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
    FULFILLED: "fulfilled",
    PENDING: "pending",
    REJECTED: "rejected"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Promise', Promise);
