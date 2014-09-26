/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Func')

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
    var Func = Class.extend(Obj, {

        _name: "Func",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(...):*} method
         */
        _constructor: function(method) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Object}
             */
            this.context    = null;

            /**
             * @private
             * @type {function(...[*]): *}
             */
            this.method     = method;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        getContext: function() {
            return this.context;
        },

        /**
         * @return {function(...[*]): *}
         */
        getMethod: function() {
            return this.method;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<*>} args
         */
        apply: function(args) {
            return this.method.apply(this.context, args);
        },

        /**
         * @param {Object} context
         * @param {Array.<*>} args
         */
        applyOn: function(context, args) {
            return this.method.apply(context, args);
        },

        /**
         * @param {Object} context
         * @return {Func}
         */
        bind: function(context) {
            this.context = context;
            return this;
        },

        /**
         * @param {...} arguments
         */
        call: function() {
            return this.method.apply(this.context, arguments);
        },

        /**
         * @param {Object} context
         * @param {...} arguments
         */
        callOn: function(context) {
            return this.method.apply(context, arguments);
        },

        /**
         * @param {Array.<*>} args
         */
        deferApply: function(args) {
            var _this = this;
            setTimeout(function() {
                _this.apply(args);
            }, 0);
        },

        /**
         * @param {...} arguments
         */
        deferCall: function() {
            var args = Array.prototype.slice.call(arguments, 0);
            this.deferApply(args);
        },

        /**
         * @param {number} wait
         * @param {Array.<*>} args
         */
        delayApply: function(wait, args) {
            var _this = this;
            setTimeout(function() {
                _this.apply(args);
            }, wait);
        },

        /**
         * @param {number} wait
         * @param {...} arguments
         */
        delayCall: function(wait) {
            var args = Array.prototype.slice.call(arguments, 1);
            this.delayApply(wait, args);
        },

        wrap: function(wrapper) {

        }
    });


    //-------------------------------------------------------------------------------
    // Static Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param count
     * @param method
     * @param context
     */
    Func.after = function(count, method, context) {

    };

    /**
     * @static
     * @param {function(...):*} method
     * @param {Object} context
     * @param {...} arguments
     * @return {function(...):*}
     */
    Func.bind = function(method, context) {
        if (!TypeUtil.isFunction(method)) {
            throw new TypeError("Func.bind - what is trying to be bound is not callable");
        }
        var func        = Func.func(method);
        var argsBound   = Array.prototype.slice.call(arguments, 2);
        var funcNOP     = function () {};
        var funcBound   = function () {
            return func.applyOn(this instanceof funcNOP && context
                    ? this
                    : context,
                argsBound.concat(Array.prototype.slice.call(arguments)));
        };

        funcNOP.prototype = this.prototype;
        funcBound.prototype = new funcNOP();

        return funcBound;
    };

    Func.debounce = function(wait, method, context) {

    };

    /**
     * @static
     * @param {function(...):*} method
     * @param {Object} context
     * @param {Array.<*>} args
     */
    Func.deferApply = function(method, context, args) {
        Func.func(method, context).deferApply(args);
    };

    /**
     * @static
     * @param {function(...):*} method
     * @param {Object} context
     * @param {...} arguments
     */
    Func.deferCall = function(method, context) {
        var args = Array.prototype.slice.call(arguments, 2);
        Func.func(method, context).deferApply(args);
    };

    /**
     * @static
     * @param {function(...):*} method
     * @param {Object} context
     * @param {number} wait
     * @param {Array.<*>} args
     */
    Func.delayApply = function(method, context, wait, args) {
        Func.func(method, context).delayApply(wait, args);
    };

    /**
     * @static
     * @param {function(...):*} method
     * @param {Object} context
     * @param {number} wait
     * @param {...} arguments
     */
    Func.delayCall = function(method, context, wait) {
        var args = Array.prototype.slice.call(arguments, 3);
        Func.func(method, context).delayApply(wait, args);
    };

    /**
     * @static
     * @param {function(...):*} method
     * @param {Object=} context
     * @returns {Func}
     */
    Func.func = function(method, context) {
        return (new Func(method)).bind(context);
    };

    /**
     * @static
     * @param {function(...):*} method
     * @param {Object} context
     * @return {function(...):*}
     */
    Func.memoize = function(method, context) {

    };

    Func.once = function(method, context) {

    };

    Func.partialApply = function(method, args) {

    };

    Func.partialCall = function(method, args) {

    };

    Func.throttle = function(wait, method, context) {

    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Func', Func);
});
