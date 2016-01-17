/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Tracer')

//@Require('ArgUtil')
//@Require('Class')
//@Require('Obj')
//@Require('Proxy')
//@Require('StackTraceUtil')
//@Require('StringUtil')
//@Require('Trace')
//@Require('TraceTree')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgUtil         = bugpack.require('ArgUtil');
    var Class           = bugpack.require('Class');
    var Obj             = bugpack.require('Obj');
    var Proxy           = bugpack.require('Proxy');
    var StackTraceUtil  = bugpack.require('StackTraceUtil');
    var StringUtil      = bugpack.require('StringUtil');
    var Trace           = bugpack.require('Trace');
    var TraceTree       = bugpack.require('TraceTree');
    var TypeUtil        = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Tracer = Class.extend(Obj, {

        _name: "Tracer",


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
             * @type {boolean}
             */
            this.enabled        = false;

            /**
             * @private
             * @type {TraceTree}
             */
            this.traceTree      = new TraceTree();

            /**
             * @private
             * @type {Trace}
             */
            this.currentTrace   = null;
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Tracer}
         */
        init: function() {
            var _this = this._super();
            if (_this) {
                _this.currentTrace = new Trace("", "ROOT_TRACE");
                _this.traceTree.setRootTrace(_this.currentTrace);
            }
            return _this;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Trace}
         */
        getCurrentTrace: function() {
            return this.currentTrace;
        },

        /**
         * @param {Trace} currentTrace
         */
        setCurrentTrace: function(currentTrace) {
            this.currentTrace = currentTrace;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Throwable | Error} error
         * @return {Throwable | Error}
         */
        $error: function(error) {
            if (this.enabled) {
                if (TypeUtil.isObject(error) && !error.bugTraced) {
                    error.bugTraced = true;
                    if (!error.stack) {
                        error.stack = StackTraceUtil.generateStackTrace();
                    }
                    var traceStack      = this.generateTraceStack(this.currentTrace);
                    error.stack         = error.stack + "\n" + traceStack;
                }
            }
            return error;
        },

        /**
         * @param {string} name
         */
        $name: function(name) {
            if (this.currentTrace) {
                this.currentTrace.setName(name);
            }
        },

        /**
         * @param {function(...):*} callback
         * @return {function}
         */
        $trace: function(callback) {
            if (this.enabled) {
                var _this = this;
                var stack = StackTraceUtil.generateStackTrace();
                var trace = this.addTraceStack(stack);

                if (callback.aCallback) {
                    throw new Error("This callback has already been wrapped in a trace");
                }
                var newCallback = function() {
                    newCallback.aCallback = true;
                    var args = ArgUtil.toArray(arguments);
                    _this.currentTrace = trace;
                    callback.apply(null, args);

                    //NOTE BRN: If one async thread ends and a new one starts that we have not wrapped in our own trace callback
                    //we do not want any new traces that the thread creates to attach to the previous current trace (since they
                    //are unrelated). So, we reset the current trace to the root trace after the completion of every callback.

                    _this.currentTrace = _this.traceTree.getRootTrace();
                    _this.checkTraceForRemoval(trace);
                };
                return newCallback;
            } else {
                return callback;
            }
        },

        /**
         * @param {function(Error, ...)} callback
         * @return {function}
         */
        $traceWithError: function(callback) {
            if (this.enabled) {
                var _this = this;
                var stack = StackTraceUtil.generateStackTrace();
                var trace = this.addTraceStack(stack);

                if (callback.aCallback) {
                    throw new Error("This callback has already been wrapped in a trace");
                }

                var newCallback = function() {
                    newCallback.aCallback = true;
                    var args = ArgUtil.toArray(arguments);
                    var error = args[0];

                    if (error) {
                        args[0] = _this.$error(error);
                    }
                    _this.currentTrace = trace;
                    callback.apply(null, args);
                    _this.currentTrace = _this.traceTree.getRootTrace();
                    _this.checkTraceForRemoval(trace);
                };
                return newCallback;
            } else {
                return callback;
            }
        },

        /**
         *
         */
        enable: function() {
            this.enabled = true;
        },

        /**
         * @param {string} name
         * @return {string}
         */
        generateNamedTraceStack: function(name) {
            var firstNamedTrace = this.traceTree.findFirstTrace(function(trace) {
                return (trace.getName() === name);
            });

            if (firstNamedTrace) {
                var currentTrace    = null;
                var nextTrace       = firstNamedTrace;
                while (nextTrace) {
                    currentTrace = nextTrace;
                    nextTrace    = null;
                    if (currentTrace.numberChildTraces() > 0) {
                        var childTraces = currentTrace.getChildTraces();
                        for (var i = childTraces.length - 1; i >= 0; i--) {
                            var childTrace = childTraces[i];
                            if (childTrace.getName() === name) {
                                nextTrace = childTrace;
                                break;
                            }
                        }
                    }
                }
                return this.generateTraceStack(currentTrace);
            } else {
                return "";
            }
        },

        /**
         * @param {Trace} trace
         * @return {string}
         */
        generateTraceStack: function(trace) {
            var traceStack   = [];
            var currentTrace = trace;
            while (!Obj.equals(currentTrace, this.traceTree.getRootTrace())) {
                var stack   = trace.getStack();
                var stackParts = stack.split("\n");
                traceStack.push("-------- Async Break ---------");
                traceStack = traceStack.concat(stackParts);
                currentTrace = currentTrace.getParentTrace();
            }
            return traceStack.join("\n");
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {string} stack
         * @return {*}
         */
        addTraceStack: function(stack) {
            var trace   = new Trace(stack);
            trace.setName(this.currentTrace.getName());
            this.currentTrace.addChildTrace(trace);
            return trace;
        },

        /**
         * @private
         * @param {Trace} trace
         */
        checkTraceForRemoval: function(trace) {
            //console.log("check trace - numberChildren:" + node.numberChildTraces() + " Obj.equals(trace, this.traceTree.getRootTrace()):" + Obj.equals(trace, this.traceTree.getRootTrace()) + " trace:" + trace);
            if (trace.numberChildTraces() === 0 && !Obj.equals(trace, this.traceTree.getRootTrace())) {

                //TEST
                //console.log("removing trace - trace:" + trace);
                if (trace.removed) {
                    throw new Error("Trying to remove the same trace TWICE!");
                }
                var parentTrace = trace.getParentTrace();
                parentTrace.removeChildTrace(trace);
                trace.removed = true;

                this.checkTraceForRemoval(parentTrace);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Private Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @private
     * @type {Tracer}
     */
    Tracer.instance = null;


    //-------------------------------------------------------------------------------
    // Public Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @return {Tracer}
     */
    Tracer.getInstance = function() {
        if (Tracer.instance === null) {
            Tracer.instance = new Tracer();
        }
        return Tracer.instance;
    };

    Proxy.proxy(Tracer, Proxy.method(Tracer.getInstance), [
        "$error",
        "$name",
        "$trace",
        "$traceWithError",
        "enable",
        "generateNamedTraceStack"
    ]);


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('Tracer', Tracer);
});
