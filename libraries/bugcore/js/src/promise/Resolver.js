/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Resolver')

//@Require('Class')
//@Require('List')
//@Require('Obj')
//@Require('Throwables')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var List        = bugpack.require('List');
    var Obj         = bugpack.require('Obj');
    var Throwables  = bugpack.require('Throwables');
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
         * @param {(Array<*> | IArrayable<*> | IIterable<*>)} illegalValues
         * @param {(Array<*> | IArrayable<*> | IIterable<*>)} values
         */
        _constructor: function(illegalValues, values) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {List<*>}
             */
            this.illegalValues          = new List(illegalValues);

            /**
             * @private
             * @type {number}
             */
            this.numberExpectedValues   = 0;

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
             * @type {List<*>}
             */
            this.resolvedReasonList     = new List();

            /**
             * @private
             * @type {List<*>}
             */
            this.resolvedValueList      = new List();

            /**
             * @private
             * @type {boolean}
             */
            this.resolving              = false;

            /**
             * @private
             * @type {List<*>}
             */
            this.values                 = new List(values);
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Resolver}
         */
        init: function() {
            var _this = this._super();
            if (_this) {
                _this.numberExpectedValues = _this.values.getCount();
            }
            return _this;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {List<*>}
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
         * @return {List<*>}
         */
        getResolvedReasonList: function() {
            return this.resolvedReasonList;
        },

        /**
         * @return {List<*>}
         */
        getResolvedValueList: function() {
            return this.resolvedValueList;
        },

        /**
         * @return {boolean}
         */
        getResolving: function() {
            return this.resolving;
        },

        /**
         * @return {List<*>}
         */
        getValues: function() {
            return this.values;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        isResolved: function() {
            return this.resolved;
        },

        /**
         * @return {boolean}
         */
        isResolving: function() {
            return this.resolving;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Array<*>)} fulfilledCallback
         * @param {function(Array<*>)} rejectedCallback
         */
        resolve: function(fulfilledCallback, rejectedCallback) {
            if (!this.resolved && !this.resolving) {
                this.resolving = true;
                this.doResolve(fulfilledCallback, rejectedCallback);
            } else {
                throw Throwables.exception("IllegalState", {}, "Resolver is already resolving.");
            }
        },


        //-------------------------------------------------------------------------------
        // Abstract Methods
        //-------------------------------------------------------------------------------

        /**
         * @abstract
         * @protected
         * @param {function(Array<*>)} fulfilledCallback
         * @param {function(Array<*>)} rejectedCallback
         */
        doResolve: function(fulfilledCallback, rejectedCallback) {
            throw Throwables.bug('AbstractMethodNotImplemented', {}, 'Must implement Resolver#doResolve');
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        incrementResolvedValues: function() {
            this.numberResolvedValues++;
        },

        /**
         * @protected
         * @param {function(Array.<*>)} fulfilledCallback
         * @param {function(Array.<*>)} rejectedCallback
         */
        tryResolving: function(fulfilledCallback, rejectedCallback) {
            if (this.numberResolvedValues === this.numberExpectedValues) {
                this.resolved = true;
                var fulfill = true;

                for (var i = 0; i < this.numberExpectedValues; i++) {
                    var resolvedReason = this.getResolvedReasonList().getAt(i);
                    if (resolvedReason !== undefined) {
                        fulfill = false;
                    }
                }

                if (fulfill) {
                    fulfilledCallback(this.getResolvedValueList().toArray());
                } else {
                    rejectedCallback(this.getResolvedReasonList().toArray());
                }
            }
        },

        /**
         * @protected
         * @param {*} value
         */
        validateValue: function(value) {
            if (this.illegalValues.contains(value)) {
                throw Throwables.bug("TypeError", {}, "Promise received itself as one of the values to resolve");
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Resolver', Resolver);
});
