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
//@Require('Resolver')
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
    var Resolver    = bugpack.require('Resolver');
    var TypeUtil    = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Resolver}
     */
    var ValuesResolver = Class.extend(Resolver, {

        _name: "ValuesResolver",


        //-------------------------------------------------------------------------------
        // Resolver Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {function(Array<*>)} fulfilledCallback
         * @param {function(Array<*>)} rejectedCallback
         */
        doResolve: function(fulfilledCallback, rejectedCallback) {
            this.resolveValues(fulfilledCallback, rejectedCallback);
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {function(Array<*>)} fulfilledCallback
         * @param {function(Array<*>)} rejectedCallback
         */
        resolveValues: function(fulfilledCallback, rejectedCallback) {
            var _this = this;
            if (this.getValues().getCount() > 0) {
                this.getValues().forEach(function(value, index) {
                    _this.getResolvedValueList().add(undefined);
                    _this.getResolvedReasonList().add(undefined);
                    _this.resolveValue(value, function(values) {
                        if (values.length === 1) {
                            values = values[0];
                        }
                        _this.getResolvedValueList().set(index, values);
                        _this.incrementResolvedValues();
                        _this.tryResolving(fulfilledCallback, rejectedCallback);
                    }, function(reasons) {
                        if (reasons.length === 1) {
                            reasons = reasons[0];
                        }
                        _this.getResolvedReasonList().set(index, reasons);
                        _this.incrementResolvedValues();
                        _this.tryResolving(fulfilledCallback, rejectedCallback);
                    });
                });
            } else {
                this.tryResolving(fulfilledCallback, rejectedCallback);
            }
        },

        /**
         * @protected
         * @param {*} value
         * @param {function(Array.<*>)} fulfilledCallback
         * @param {function(Array.<*>)} rejectedCallback
         */
        resolveValue: function(value, fulfilledCallback, rejectedCallback) {
            try {
                this.validateValue(value);
                if (Class.doesImplement(value, IPromise)) {
                    this.resolveValueAsPromise(value, fulfilledCallback, rejectedCallback);
                } else if (TypeUtil.isFunction(value) || TypeUtil.isObject(value)) {
                    this.resolveValueAsObject(value, fulfilledCallback, rejectedCallback);
                } else {
                    fulfilledCallback([value]);
                }
            } catch(error) {
                rejectedCallback([error]);
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Object} object
         * @param {function(Array.<*>)} fulfilledCallback
         * @param {function(Array.<*>)} rejectedCallback
         */
        resolveValueAsObject: function(object, fulfilledCallback, rejectedCallback) {
            var _this = this;
            try {
                var then = object.then;
                if (TypeUtil.isFunction(then)) {
                    var complete = false;
                    try {
                        then.call(object, function () {
                            if (!complete) {
                                complete = true;
                                var values = ArgUtil.toArray(arguments);
                                var valuesResolver = new ValuesResolver(_this.getIllegalValues(), values);
                                valuesResolver.resolve(fulfilledCallback, rejectedCallback);
                            }
                        }, function () {
                            if (!complete) {
                                complete = true;
                                rejectedCallback(ArgUtil.toArray(arguments));
                            }
                        });
                    } catch(e) {
                        if (!complete) {
                            complete = true;
                            rejectedCallback([e]);
                        }
                    }
                } else {
                    fulfilledCallback([object]);
                }
            } catch(error) {
                rejectedCallback([error]);
            }
        },

        /**
         * @private
         * @param {IPromise} promise
         * @param {function(Array.<*>)} fulfilledCallback
         * @param {function(Array.<*>)} rejectedCallback
         */
        resolveValueAsPromise: function(promise, fulfilledCallback, rejectedCallback) {
            promise.then(function() {
                var values = ArgUtil.toArray(arguments);
                fulfilledCallback(values);
            }, function() {
                var reasons = ArgUtil.toArray(arguments);
                rejectedCallback(reasons);
            });
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ValuesResolver', ValuesResolver);
});
