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


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgUtil             = bugpack.require('ArgUtil');
var Bug                 = bugpack.require('Bug');
var Class               = bugpack.require('Class');
var IPromise            = bugpack.require('IPromise');
var List                = bugpack.require('List');
var Obj                 = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
var Resolver = Class.extend(Obj, {

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
         * @type {Array.<*>}
         */
        this.values                 = values;

        /**
         * @private
         * @type {number}
         */
        this.numberExpectedValues   = this.values.length;

        /**
         * @private
         * @type {number}
         */
        this.numberResolvedValues   = 0;
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
            for (var i = 0; i < this.numberExpectedValues; i++) {
                var value = this.values[i];
                if (Obj.equals(this.promise, value)) {
                    return this.resolveToRejection([new Bug("TypeError", {}, "Promise received itself as one of the values to resolve")]);
                }
                this.resolvedValueList.add(null);
                this.resolvedReasonList.add(null);
            }
            this.resolveValues();
            this.tryResolving();
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
     */
    resolveValues: function() {
        var _this = this;
        this.values.forEach(function(value, index) {
            _this.resolveValue(index, value);
        });
    },

    /**
     * @private
     * @param {number} index
     * @param {*} value
     */
    resolveValue: function(index, value) {
        var _this = this;
        if (Class.doesImplement(value, IPromise)) {
            value.then(function() {
                var args = ArgUtil.toArray(arguments);
                if (args.length === 1) {
                    _this.resolvedValueList.set(index, args[0]);
                } else {
                    _this.resolvedValueList.set(index, args);
                }
                _this.numberResolvedValues++;
                _this.tryResolving();
            }, function() {
                var args = ArgUtil.toArray(arguments);
                if (args.length === 1) {
                    _this.resolvedValueList.set(index, args[0]);
                } else {
                    _this.resolvedValueList.set(index, args);
                }
                _this.numberResolvedValues++;
                _this.tryResolving();
            });
        } else {
            this.resolvedValueList.set(index, value);
            this.numberResolvedValues++;
        }
    },

    /**
     * @private
     */
    tryResolving: function() {
        var _this = this;
        if (!this.resolved) {
            if (this.numberResolvedValues === this.numberExpectedValues) {
                var fulfill             = true;

                //TODO
                /*
                 var resolvedValueList   = new List();
                 var resolvedReasonList  = new List();
                if (this.numberExpectedValues >= 0) {
                    if (this.numberExpectedValues === 1) {
                        var resolvedReasonArray = this.resolvedReasonList.getAt(0);
                        var resolvedValueArray = this.resolvedValueList.getAt(0);
                        if (resolvedReasonArray) {
                            resolvedReasonList.addAll(resolvedReasonArray);
                            fulfill = false;
                        }
                        if (resolvedValueArray) {
                            resolvedValueList.addAll(resolvedValueArray);
                        }
                    } else {
                        for (var i = 0; i < this.numberExpectedValues; i++) {
                            var resolvedReasonArray = this.resolvedReasonList.getAt(0);
                            var resolvedValueArray = this.resolvedValueList.getAt(0);
                            if (resolvedReasonArray) {
                                if (resolvedReasonArray === 1) {
                                    resolvedReasonList.addAll(resolvedReasonArray);
                                } else if (resolvedReasonArray.length > 1) {
                                    resolvedReasonList.add(resolvedReasonArray);
                                }
                                fulfill = false;
                            }
                            if (resolvedValueArray) {
                                if (resolvedValueArray === 1) {
                                    resolvedValueList.addAll(resolvedValueArray);
                                } else if (resolvedValueArray.length > 1) {
                                    resolvedValueList.add(resolvedValueArray);
                                }
                            }
                        }
                    }
                }*/

                if (fulfill) {
                    this.resolveToFulfillment(this.resolvedValueList.toArray());
                } else {
                    this.resolveToRejection(this.resolvedReasonList.toArray());
                }
            }
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Resolver', Resolver);
