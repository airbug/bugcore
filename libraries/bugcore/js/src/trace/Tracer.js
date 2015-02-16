/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
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
//@Require('Tree')
//@Require('TreeNode')


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
    var Tree            = bugpack.require('Tree');
    var TreeNode        = bugpack.require('TreeNode');


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
             * @type {Tree}
             */
            this.traceTree      = new Tree(new TreeNode(new Trace("", "ROOT_NODE")));

            /**
             * @private
             * @type {TreeNode}
             */
            this.currentNode    = null;
        },


        //-------------------------------------------------------------------------------
        // Initializer
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        _initializer: function() {
            this.currentNode = this.traceTree.getRootNode();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {TreeNode}
         */
        getCurrentNode: function() {
            return this.currentNode;
        },

        /**
         * @param {TreeNode} currentNode
         */
        setCurrentNode: function(currentNode) {
            this.currentNode = currentNode;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Throwable} error
         * @return {Throwable}
         */
        $error: function(error) {
            if (this.enabled) {
                if (!error.bugTraced) {
                    error.bugTraced = true;
                    if (!error.stack) {
                        error.stack = StackTraceUtil.generateStackTrace();
                    }

                    var nodeStack       = this.generateNodeStack(this.currentNode);
                    var currentStack    = error.stack + "\n" + nodeStack;
                    error.stack = currentStack;
                }
            }
            return error;
        },

        /**
         * @param {string} name
         */
        $name: function(name) {
            var currentNode = this.currentNode;
            if (currentNode) {
                var trace   = currentNode.getValue();
                trace.setName(name);
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
                var newNode = this.addTraceNode(stack);

                if (callback.aCallback) {
                    throw new Error("This callback has already been wrapped in a trace");
                }
                var newCallback = function() {
                    newCallback.aCallback = true;
                    var args = ArgUtil.toArray(arguments);
                    _this.currentNode = newNode;
                    callback.apply(null, args);

                    //NOTE BRN: If one async thread ends and a new one starts that we have not wrapped in our own trace callback
                    //we do not want any new nodes that the thread creates to attach to the previous current node (since they
                    //are unrelated). So, we reset the current node to the root node after the completion of every callback.

                    _this.currentNode = _this.traceTree.getRootNode();
                    _this.checkTraceNodeForRemoval(newNode);
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
                var newNode = this.addTraceNode(stack);

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
                    _this.currentNode = newNode;
                    callback.apply(null, args);
                    _this.currentNode = _this.traceTree.getRootNode();
                    _this.checkTraceNodeForRemoval(newNode);
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
         * @param {TreeNode} traceNode
         * @return {string}
         */
        generateNodeStack: function(traceNode) {
            var nodeStack   = [];
            var currentNode = traceNode;
            while (!Obj.equals(currentNode, this.traceTree.getRootNode())) {
                var trace   = currentNode.getValue();
                var stack   = trace.getStack();
                var stackParts = stack.split("\n");
                nodeStack.push("-------- Async Break ---------");
                nodeStack = nodeStack.concat(stackParts);
                currentNode = currentNode.getParentNode();
            }
            return nodeStack.join("\n");
        },

        /**
         * @param {string} name
         * @return {string}
         */
        getNamedStack: function(name) {
            var firstNamedNode = this.traceTree.findFirst(function(trace) {
                return (trace.getName() === name);
            });

            if (firstNamedNode) {
                var currentNode = null;
                var nextNode    = firstNamedNode;
                while (nextNode) {
                    currentNode = nextNode;
                    nextNode    = null;
                    if (currentNode.getChildNodes().getCount() > 0) {
                        var childNodes = currentNode.getChildNodes();
                        for (var i = childNodes.getCount() - 1; i >= 0; i--) {
                            var childNode = childNodes.getAt(i);
                            if (childNode.getValue().getName() === name) {
                                nextNode = childNode;
                                break;
                            }
                        }
                    }
                }
                return this.generateNodeStack(currentNode);
            } else {
                return "";
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param stack
         * @return {*}
         */
        addTraceNode: function(stack) {
            var trace   = new Trace(stack);
            var newNode = new TreeNode(trace);
            trace.setName(this.currentNode.getValue().getName());
            this.currentNode.addChildNode(newNode);
            return newNode;
        },

        /**
         * @private
         */
        checkTraceNodeForRemoval: function(node) {
            //console.log("check trace node - numberChildren:" + node.numberChildNodes() + " Obj.equals(node, this.traceTree.getRootNode()):" + Obj.equals(node, this.traceTree.getRootNode()) + " value:" + node.getValue());
            if (node.numberChildNodes() === 0 && !Obj.equals(node, this.traceTree.getRootNode())) {

                //console.log("removing trace node - value:" + node.getValue());
                if (node.removed) {
                    throw new Error("Trying to remove the same node TWICE!");
                }
                var parentNode = node.getParentNode();
                parentNode.removeChildNode(node);
                node.removed = true;

                this.checkTraceNodeForRemoval(parentNode);
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
        "getNamedStack"
    ]);


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('Tracer', Tracer);
});
