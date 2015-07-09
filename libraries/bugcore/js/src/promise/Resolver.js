/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Resolver')

//@Require('ArgUtil')
//@Require('Bug')
//@Require('Class')
//@Require('IPromise')
//@Require('List')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgUtil     = bugpack.require('ArgUtil');
    var Bug         = bugpack.require('Bug');
    var Class       = bugpack.require('Class');
    var IPromise    = bugpack.require('IPromise');
    var List        = bugpack.require('List');
    var Obj         = bugpack.require('Obj');
    var TypeUtil    = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Resolver = Class.extend(Obj, {

        _name: "Resolver",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Promise} promise
         * @param {Array.<*>} values
         */
        _constructor: function(promise, values) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Promise}
             */
            this.promise                = promise;

            /**
             * @private
             * @type {boolean}
             */
            this.resolved               = false;

            /**
             * @private
             * @type {boolean}
             */
            this.resolving              = false;

            /**
             * @private
             * @type {Array.<*>}
             */
            this.values                 = values;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Promise}
         */
        getPromise: function() {
            return this.promise;
        },

        /**
         * @return {boolean}
         */
        getResolved: function() {
            return this.resolved;
        },

        /**
         * @return {Array.<*>}
         */
        getValues: function() {
            return this.values;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        resolve: function() {
            if (!this.resolved && !this.resolving) {
                this.resolving = true;
                this.startResolving();
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Array.<*>} values
         */
        resolveToFulfillment: function(values) {
            this.resolved = true;
            this.resolving = false;
            this.promise.doFulfillPromise(values);
        },

        /**
         * @private
         * @param {Array.<*>} reasons
         */
        resolveToRejection: function(reasons) {
            this.resolved = true;
            this.resolving = false;
            this.promise.doRejectPromise(reasons);
        },

        /**
         * @private
         * @param {Array.<*>} values
         * @param {function(*...)} valuesFulfilledCallback
         * @param {function(*...)} valuesRejectedCallback
         */
        resolveValues: function(values, valuesFulfilledCallback, valuesRejectedCallback) {
            var resolvedReasonList     = new List();
            var resolvedValueList      = new List();
            var numberExpectedValues   = values.length;
            var numberResolvedValues   = 0;
            var tryResolving = function() {
                if (numberResolvedValues === numberExpectedValues) {
                    var fulfill = true;

                    for (var i = 0; i < numberExpectedValues; i++) {
                        var resolvedReason = resolvedReasonList.getAt(i);
                        if (resolvedReason) {
                            fulfill = false;
                        }
                    }

                    if (fulfill) {
                        valuesFulfilledCallback.apply(null, resolvedValueList.toArray());
                    } else {
                        valuesRejectedCallback.apply(null, resolvedReasonList.toArray());
                    }
                }
            };

            var _this = this;
            if (values.length > 0) {
                values.forEach(function (value, index) {
                    resolvedValueList.add(null);
                    resolvedReasonList.add(null);
                    _this.resolveValue(value, function () {
                        var values = ArgUtil.toArray(arguments);
                        if (values.length === 1) {
                            values = values[0];
                        }
                        resolvedValueList.set(index, values);
                        numberResolvedValues++;
                        tryResolving();
                    }, function () {
                        var reasons = ArgUtil.toArray(arguments);
                        if (reasons.length === 1) {
                            reasons = reasons[0];
                        }
                        resolvedReasonList.set(index, reasons);
                        numberResolvedValues++;
                        tryResolving();
                    });
                });
            } else {
                tryResolving();
            }
        },

        /**
         * @private
         * @param {*} value
         * @param {function(*...)} valueFulfilledCallback
         * @param {function(*...)} valueRejectedCallback
         */
        resolveValue: function(value, valueFulfilledCallback, valueRejectedCallback) {
            if (this.validateValue(value)) {
                if (Class.doesImplement(value, IPromise)) {
                    this.resolveValueAsPromise(value, valueFulfilledCallback, valueRejectedCallback);
                } else if (TypeUtil.isFunction(value) || TypeUtil.isObject(value)) {
                    this.resolveValueAsObject(value, valueFulfilledCallback, valueRejectedCallback);
                } else {
                    valueFulfilledCallback(value);
                }
            } else {
                valueRejectedCallback(new Bug("TypeError", {}, "Promise received itself as one of the values to resolve"));
            }
        },

        /**
         * @private
         * @param {Object} object
         * @param {function(*...)} valueFulfilledCallback
         * @param {function(*...)} valueRejectedCallback
         */
        resolveValueAsObject: function(object, valueFulfilledCallback, valueRejectedCallback) {
            var _this = this;
            try {
                var then = object.then;
                if (TypeUtil.isFunction(then)) {
                    var resolvePromiseCalled = false;
                    var rejectPromiseCalled  = false;
                    try {
                        then.call(object, function () {
                            if (!resolvePromiseCalled && !rejectPromiseCalled) {
                                resolvePromiseCalled = true;
                                var values = ArgUtil.toArray(arguments);
                                _this.resolveValues(values, valueFulfilledCallback, valueRejectedCallback);
                            }
                        }, function () {
                            if (!resolvePromiseCalled && !rejectPromiseCalled) {
                                rejectPromiseCalled = true;
                                valueRejectedCallback.apply(null, arguments)
                            }
                        });
                    } catch(e) {
                        if (!resolvePromiseCalled && !rejectPromiseCalled) {
                            valueRejectedCallback(e);
                        }
                    }
                } else {
                    valueFulfilledCallback(object)
                }
            } catch(e) {
                valueRejectedCallback(e)
            }
        },

        /**
         * @private
         * @param {IPromise} promise
         * @param {function(*...)} valueFulfilledCallback
         * @param {function(*...)} valueRejectedCallback
         */
        resolveValueAsPromise: function(promise, valueFulfilledCallback, valueRejectedCallback) {
            promise.then(valueFulfilledCallback, valueRejectedCallback);
        },

        /**
         * @private
         */
        startResolving: function() {
            var _this = this;
            this.resolveValues(this.values, function() {
                var args = ArgUtil.toArray(arguments);
                _this.resolveToFulfillment(args);
            }, function() {
                var args = ArgUtil.toArray(arguments);
                _this.resolveToRejection(args);
            })
        },


        /**
         * @private
         * @param {*} value
         * @returns {boolean}
         */
        validateValue: function(value) {
            return !Obj.equals(this.promise, value);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Resolver', Resolver);
});
