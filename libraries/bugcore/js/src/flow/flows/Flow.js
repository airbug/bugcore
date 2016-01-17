/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
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
//@Require('Resolvers')
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
    var Resolvers   = bugpack.require('Resolvers');
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
             * @type {Array.<*>}
             */
            this.flowArgs       = null;

            /**
             * @private
             * @type {boolean}
             */
            this.resolving      = false;

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
         * @return {function(Throwable=)}
         */
        getCallback: function() {
            return this.callback;
        },

        /**
         * @return {boolean}
         */
        getCompleted: function() {
            return this.completed;
        },

        /**
         * @return {boolean}
         */
        getErrored: function() {
            return this.errored;
        },

        /**
         * @return {boolean}
         */
        getExecuted: function() {
            return this.executed;
        },

        /**
         * @return {Array.<*>}
         */
        getFlowArgs: function() {
            return this.flowArgs;
        },

        /**
         * @return {Throwable}
         */
        getThrowable: function() {
            return this.throwable;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        hasCompleted: function() {
            return this.getCompleted();
        },

        /**
         * @return {boolean}
         */
        hasErrored: function() {
            return this.getErrored();
        },

        /**
         * @return {boolean}
         */
        hasExecuted: function() {
            return this.getExecuted();
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
         * @param {Throwable=} throwable
         * @param {*...} arguments
         */
        complete: function(throwable) {
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
                args.shift();
                this.resolve.apply(this, args);
            }
        },

        /**
         * @param {Throwable=} throwable
         */
        error: function(throwable) {
            if (!throwable) {
                throwable = Throwables.exception("FlowException", {}, "A flow exception occurred");
            }
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
         * @param {function(Throwable, *...=)=} callback
         */
        execute: function(args, callback) {
            if (TypeUtil.isFunction(args)) {
                callback = args;
                args = [];
            }
            this.callback = callback;
            if (!this.executed) {
                try {
                    var returnedValue = this.executeFlow(args);
                    if (!TypeUtil.isUndefined(returnedValue)) {
                        this.complete(null, returnedValue);
                    }
                } catch(throwable) {
                    this.error(throwable);
                }
            } else {
                throw Throwables.bug("IllegalState", {}, "A flow can only be executed once.");
            }
        },

        /**
         * @param {*...} arguments
         */
        resolve: function() {
            if (this.isResolving()) {
                this.throwBug(Throwables.bug("DuplicateFlow", {}, "Cannot resolve flow. Flow is already resolving."));
            }
            if (this.hasErrored()) {
                this.throwBug(Throwables.bug("DuplicateFlow", {}, "Cannot resolve flow. Flow has already errored out."));
            }
            if (this.hasCompleted()) {
                this.throwBug(Throwables.bug("DuplicateFlow", {}, "Cannot resolve flow. Flow has already completed."));
            }
            var args = ArgUtil.toArray(arguments);
            this.resolveFlow(args);
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
                    _this.callback.apply(undefined, [null].concat(args));
                //}), 0);
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
         * @param {Array.<*>} flowArgs
         */
        executeFlow: function(flowArgs) {
            this.flowArgs = flowArgs;
            this.executed = true;
        },

        /**
         * @protected
         * @param {Array.<*>} args
         */
        resolveFlow: function(args) {
            var _this       = this;
            this.resolving  = true;
            var resolver    = Resolvers.resolveValues([this], args);
            resolver.resolve(function(values) {
                _this.resolving = false;
                _this.completeFlow(values);
            }, function(reasons) {
                _this.resolving = false;
                _this.errorFlow(Throwables.parallelException("ResolveException", {}, "Exceptions occurred during resolution of Flow", reasons));
            });
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
