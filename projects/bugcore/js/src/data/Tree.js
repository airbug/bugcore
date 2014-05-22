/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Tree')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Obj         = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Tree = Class.extend(Obj, {

        _name: "Tree",


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
             * @type {TreeNode}
             */
            this.rootNode = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {TreeNode}
         */
        getRootNode: function() {
            return this.rootNode;
        },

        /**
         * @param {TreeNode} rootNode
         */
        setRootNode: function(rootNode) {
            this.rootNode = rootNode;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function()} func
         * @return {TreeNode}
         */
        findFirst: function(func) {
            var rootNode = this.getRootNode();
            if (rootNode) {
                return this.findRecursive(rootNode, func);
            } else {
                return null;
            }
        },

        /**
         * Performs a top down depth walk of the tree.
         * @param {function()} func
         */
        walk: function(func) {
            var rootNode = this.getRootNode();
            if (rootNode) {
                this.walkRecursive(rootNode, func);
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {TreeNode} node
         * @param {function(*)} func
         * @return {TreeNode}
         */
        findRecursive: function(node, func) {
            var result = func(node.getValue());
            if (result) {
                return node;
            } else {
                var childNodes = node.getChildNodes();
                for (var i = 0, size = childNodes.getCount(); i < size; i++) {
                    var childNode = childNodes.getAt(i);
                    var result = this.findRecursive(childNode, func);
                    if (result) {
                        return result;
                    }
                }
                return null;
            }
        },

        /**
         * @private
         * @param {TreeNode} node
         * @param {function(*)} func
         */
        walkRecursive: function(node, func) {
            func(node.getValue());
            var _this = this;
            node.getChildNodes().forEach(function(childNode) {
                _this.walkRecursive(childNode, func);
            });
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Tree', Tree);
});
