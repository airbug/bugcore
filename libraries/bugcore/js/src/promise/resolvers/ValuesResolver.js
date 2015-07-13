/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ValuesResolver')

//@Require('ArgUtil')
//@Require('Bug')
//@Require('Class')
//@Require('Exception')
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
    var Exception   = bugpack.require('Exception');
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
    var ValuesResolver = Class.extend(Obj, {

        _name: "ValuesResolver",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {(Array.<*> | Collection.<*>)} illegalValues
         * @param {Array.<*>} values
         */
        _constructor: function(illegalValues, values) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {List.<*>}
             */
            this.illegalValues          = new List(illegalValues);

            /**
             * @private
             * @type {number}
             */
            this.numberExpectedValues   = values.length;

            /**
             * @private
             * @type {number}
             */
            this.numberResolvedValues   = 0;

            /**
             * @private
             * @type {boolean}
             */
            this.resolved               = false;

            /**
             * @private
             * @type {List.<*>}
             */
            this.resolvedReasonList     = new List();

            /**
             * @private
             * @type {List.<*>}
             */
            this.resolvedValueList      = new List();

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
         * @return {List.<*>}
         */
        getIllegalValues: function() {
            return this.illegalValues;
        },

        /**
         * @return {number}
         */
        getNumberExpectedValues: function() {
            return this.numberExpectedValues;
        },

        /**
         * @return {number}
         */
        getNumberResolvedValues: function() {
            return this.numberResolvedValues;
        },

        /**
         * @return {boolean}
         */
        getResolved: function() {
            return this.resolved;
        },

        /**
         * @return {List.<*>}
         */
        getResolvedReasonList: function() {
            return this.resolvedReasonList;
        },

        /**
         * @return {List.<*>}
         */
        getResolvedValueList: function() {
            return this.resolvedValueList;
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
         * @param {function(Array.<*>, Array.<*>)} callback
         */
        resolve: function(callback) {
            if (!this.resolved && !this.resolving) {
                this.resolving = true;
                this.resolveValues(function() {
                    var args = ArgUtil.toArray(arguments);
                    callback([], args);
                }, function() {
                    var args = ArgUtil.toArray(arguments);
                    callback(args, []);
                })
            } else {
                throw new Exception("IllegalState", {}, "Resolver is already resolving.");
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {function(*...)} valuesFulfilledCallback
         * @param {function(*...)} valuesRejectedCallback
         */
        resolveValues: function(valuesFulfilledCallback, valuesRejectedCallback) {
            var _this = this;
            if (this.values.length > 0) {
                this.values.forEach(function(value, index) {
                    _this.resolvedValueList.add(null);
                    _this.resolvedReasonList.add(null);
                    _this.resolveValue(value, function () {
                        var values = ArgUtil.toArray(arguments);
                        if (values.length === 1) {
                            values = values[0];
                        }
                        _this.resolvedValueList.set(index, values);
                        _this.numberResolvedValues++;
                        _this.tryResolving(valuesFulfilledCallback, valuesRejectedCallback);
                    }, function () {
                        var reasons = ArgUtil.toArray(arguments);
                        if (reasons.length === 1) {
                            reasons = reasons[0];
                        }
                        _this.resolvedReasonList.set(index, reasons);
                        _this.numberResolvedValues++;
                        _this.tryResolving(valuesFulfilledCallback, valuesRejectedCallback);
                    });
                });
            } else {
                _this.tryResolving(valuesFulfilledCallback, valuesRejectedCallback);
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
                                var valuesResolver = new ValuesResolver(values, valueFulfilledCallback, valueRejectedCallback);
                                valuesResolver.resolve(function(reasons, values) {
                                    if (reasons.length > 0) {
                                        valueRejectedCallback.apply(null, reasons);
                                    } else {
                                        valueFulfilledCallback.apply(null, vakues);
                                    }
                                });
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
         * @param {function(*...)} valuesFulfilledCallback
         * @param {function(*...)} valuesRejectedCallback
         */
        tryResolving: function(valuesFulfilledCallback, valuesRejectedCallback) {
            if (this.numberResolvedValues === this.numberExpectedValues) {
                var fulfill = true;

                for (var i = 0; i < this.numberExpectedValues; i++) {
                    var resolvedReason = this.resolvedReasonList.getAt(i);
                    if (resolvedReason) {
                        fulfill = false;
                    }
                }

                if (fulfill) {
                    valuesFulfilledCallback.apply(null, this.resolvedValueList.toArray());
                } else {
                    valuesRejectedCallback.apply(null, this.resolvedReasonList.toArray());
                }
            }
        },

        /**
         * @private
         * @param {*} value
         * @returns {boolean}
         */
        validateValue: function(value) {
            return !this.illegalValues.contains(value);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ValuesResolver', ValuesResolver);
});
