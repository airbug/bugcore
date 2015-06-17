/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Flow')

//@Require('ArgUtil')
//@Require('Class')
//@Require('Obj')
//@Require('Throwables')
//@Require('Tracer')
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
    var Obj         = bugpack.require('Obj');
    var Throwables  = bugpack.require('Throwables');
    var Tracer      = bugpack.require('Tracer');
    var TypeUtil    = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $error      = Tracer.$error;
    var $trace      = Tracer.$trace;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Flow = Class.extend(Obj, {

        _name: "Flow",


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
             * @type {function(Throwable=)}
             */
            this.callback       = null;

            /**
             * @private
             * @type {boolean}
             */
            this.completed      = false;

            /**
             * @private
             * @type {boolean}
             */
            this.errored        = false;

            /**
             * @private
             * @type {boolean}
             */
            this.executed       = false;

            /**
             * @private
             * @type {Throwable}
             */
            this.throwable      = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        hasCompleted: function() {
            return this.completed;
        },

        /**
         * @return {boolean}
         */
        hasExecuted: function() {
            return this.executed;
        },

        /**
         * @return {boolean}
         */
        hasErrored: function() {
            return this.errored;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Throwable=} throwable
         * @param {...} arguments
         */
        complete: function(throwable) {
            var _this = this;
            if (throwable) {
                this.error(throwable);
            } else {
                var args = ArgUtil.toArray(arguments);
                if (this.hasErrored()) {
                    this.throwBug(Throwables.bug("DuplicateFlow", {}, "Cannot complete flow. Flow has already errored out."));
                }
                if (this.hasCompleted()) {
                    this.throwBug(Throwables.bug("DuplicateFlow", {}, "Can only complete a flow once."));
                }
                _this.completeFlow(args);
            }
        },

        /**
         * @param {Throwable} throwable
         */
        error: function(throwable) {
            if (this.hasErrored()) {
                this.throwBug(Throwables.bug("DuplicateFlow", {}, "Can only error flow once.", [throwable]));
            }
            if (this.hasCompleted()) {
                this.throwBug(Throwables.bug("DuplicateFlow", {}, "Cannot error flow. Flow has already completed.", [throwable]));
            }
            this.errorFlow($error(throwable));
        },

        /**
         * @param {(Array.<*> | function(Throwable=))} args
         * @param {function(Throwable=)=} callback
         */
        execute: function(args, callback) {
            if (TypeUtil.isFunction(args)) {
                callback = args;
                args = [];
            }
            this.callback = callback;
            if (!this.executed) {
                try {
                    this.executeFlow(args);
                } catch(throwable) {
                    this.error(throwable);
                }
            } else {
                throw Throwables.bug("IllegalState", {}, "A flow can only be executed once.");
            }
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param  {Array.<*>} args
         */
        completeFlow: function(args) {
            var _this = this;
            this.completed = true;
            if (this.callback) {
                //setTimeout($trace(function() {
                    _this.callback.apply(this, args);
               // }), 0);
            }
        },

        /**
         * @protected
         * @param {Throwable} throwable
         */
        errorFlow: function(throwable) {
            this.errored    = true;
            this.throwable  = throwable;
            if (this.callback) {
                this.callback(throwable);
            } else {
                throw throwable;
            }
        },

        /**
         * @protected
         * @param {Array.<*>} args
         */
        executeFlow: function(args) {
            this.executed = true;
        },

        /**
         * @protected
         * @param {Bug} bug
         */
        throwBug: function(bug) {
            if (this.throwable) {
                bug.addCause(this.throwable);
            }
            throw bug;
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('Flow', Flow);
});
