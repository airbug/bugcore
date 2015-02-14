/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Graph')

//@Require('Class')
//@Require('Exception')
//@Require('GraphEdge')
//@Require('GraphNode')
//@Require('Map')
//@Require('Obj')
//@Require('Set')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Exception   = bugpack.require('Exception');
    var GraphEdge   = bugpack.require('GraphEdge');
    var GraphNode   = bugpack.require('GraphNode');
    var Map         = bugpack.require('Map');
    var Obj         = bugpack.require('Obj');
    var Set         = bugpack.require('Set');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * Rules for Graph
     * 1) Does not support multiple of the same Node. Each Node should be unique.
     * 2) Does not support multiple of the same Edge. Each Edge should be unique. A unique Edge is a unique fromNode and
     * toNode pair.
     *
     * @class
     * @extends {Obj}
     */
    var Graph = Class.extend(Obj, {

        _name: "Graph",


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
             * @type {Set.<GraphEdge>}
             */
            this.edgeSet                    = new Set();

            /**
             * @private
             * @type {Map.<GraphNode, Set.<GraphEdge>>}
             */
            this.fromNodeToEdgeSetMap       = new Map();

            /**
             * @private
             * @type {Set.<GraphNode>}
             */
            this.nodeSet                    = new Set();

            /**
             * @private
             * @type {Map.<GraphNode, Set.<GraphEdge>>}
             */
            this.toNodeToEdgeSetMap         = new Map();

            /**
             * @private
             * @type {Map.<*, GraphNode>}
             */
            this.valueToNodeMap             = new Map();
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        toString: function() {
            var output = "";
            return output;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} fromValue
         * @param {*} toValue
         * @return {boolean}
         */
        addEdgeFromValueToValue: function(fromValue, toValue) {
            var fromNode = this.getNode(fromValue);
            var toNode = this.getNode(toValue);
            if (!fromNode) {
                this.addNodeForValue(fromNode);
            }
            if (!toNode) {
                this.addNodeForValue(toNode);
            }
            var edge = new GraphEdge(fromNode, toNode);
            return this.addEdge(edge);
        },

        /**
         * @param {*} value
         * @return {boolean}
         */
        addNodeForValue: function(value) {
            var node = new GraphNode(value);
            return this.addNode(node);
        },

        /**
         * @param {*} fromValue
         * @param {*} toValue
         * @return {boolean}
         */
        containsEdgeFromValueToValue: function(fromValue, toValue) {
            if (this.containsNodeForValue(fromValue) && this.containsNodeForValue(toValue)) {
                var fromNode = this.getNode(fromValue);
                var toNode = this.getNode(toValue);
                var edgesFrom = this.getEdgesFrom(fromNode);
                var edge = new GraphEdge(fromNode, toNode);
                return edgesFrom.contains(edge);
            }
            return false;
        },

        /**
         * @param {*} value
         * @return {boolean}
         */
        containsNodeForValue: function(value) {
            var node = new GraphNode(value);
            return this.containsNode(node);
        },

        /**
         * @param {*} fromValue
         * @param {*} toValue
         * @return {boolean}
         */
        removeEdgeFromValueToValue: function(fromValue, toValue) {
            var fromNode = this.getNode(fromValue);
            var toNode = this.getNode(toValue);
            if (fromNode && toNode) {
                var edge = new GraphEdge(fromNode, toNode);
                return this.removeEdge(edge);
            }
            return false;
        },

        /**
         * @param {*} value
         * @return {boolean}
         */
        removeNodeForValue: function(value) {
            var node = this.getNode(value);
            if (node) {
                return this.removeNode(node);
            }
            return false;
        },

        /**
         * @param {(ICollection.<*> | Array.<*>)} values
         */
        removeNodesForValues: function(values) {
            var _this = this;
            values.forEach(function(value) {
                _this.removeNodeForValue(value);
            });
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {GraphEdge} edge
         * @return {boolean}
         */
        addEdge: function(edge) {
            if (!this.edgeSet.contains(edge)) {
                this.edgeSet.add(edge);
                var edgeFromSet = null;
                if (!this.containsEdgesFrom(edge.getFromNode())) {
                    edgeFromSet = new Set();
                    this.fromNodeToEdgeSetMap.put(edge.getFromNode(), edgeFromSet);
                } else {
                    edgeFromSet = this.getEdgesFrom(edge.getFromNode());
                }
                edgeFromSet.add(edge);
                var edgeToSet = null;
                if (!this.containsEdgesTo(edge.getToNode())) {
                    edgeToSet = new Set();
                    this.toNodeToEdgeSetMap.put(edge.getToNode(), edgeToSet);
                } else {
                    edgeToSet = this.getEdgesTo(edge.getToNode());
                }
                edgeToSet.add(edge);
                return true;
            }
            return false;
        },

        /**
         * @protected
         * @param {GraphNode} node
         * @return {boolean}
         */
        addNode: function(node) {
            if (!this.nodeSet.contains(node)) {
                this.nodeSet.add(node);
                this.valueToNodeMap.put(node.getValue(), node);
                return true;
            }
            return false;
        },

        /**
         * @protected
         * @param {GraphNode} fromNode
         * @return {boolean}
         */
        containsEdgesFrom: function(fromNode) {
            return this.fromNodeToEdgeSetMap.containsKey(fromNode);
        },

        /**
         * @protected
         * @param {GraphNode} toNode
         * @return {boolean}
         */
        containsEdgesTo: function(toNode) {
            return this.toNodeToEdgeSetMap.containsKey(toNode);
        },

        /**
         * @protected
         * @param {GraphNode} node
         * @return {boolean}
         */
        containsNode: function(node) {
            return this.valueToNodeMap.containsKey(node.getValue());
        },

        /**
         * @protected
         * @param {*} value
         * @return {GraphNode}
         */
        getNode: function(value) {
            return this.valueToNodeMap.get(value);
        },

        /**
         * @protected
         * @param {GraphNode} fromNode
         * @return {Set.<GraphEdge>}
         */
        getEdgesFrom: function(fromNode) {
            var edgeSet = this.fromNodeToEdgeSetMap.get(fromNode);
            if (!edgeSet) {
                edgeSet = new Set();
            }
            return edgeSet;
        },

        /**
         * @protected
         * @param {GraphNode} toNode
         * @return {Set.<GraphEdge>}
         */
        getEdgesTo: function(toNode) {
            var edgeSet = this.toNodeToEdgeSetMap.get(toNode);
            if (!edgeSet) {
                edgeSet = new Set();
            }
            return edgeSet;
        },

        /**
         * Get nodes that are connected by edges leading from the node parameter
         * @protected
         * @param {GraphNode} fromNode
         * @return {Set.<GraphNode>}
         */
        getNodesFrom: function(fromNode) {
            var nodesFromSet = new Set();
            var edgeFromSet = this.getEdgesFrom(fromNode);
            edgeFromSet.forEach(function(edge) {
                nodesFromSet.add(edge.getToNode());
            });
            return nodesFromSet;
        },

        /**
         * Get nodes that are connected by edges leading to the node parameter
         * @protected
         * @param {GraphNode} toNode
         * @return {Set.<GraphNode>}
         */
        getNodesTo: function(toNode) {
            var nodesToSet = new Set();
            var edgeToSet = this.getEdgesTo(toNode);
            if (edgeToSet) {
                edgeToSet.forEach(function(edge) {
                    nodesToSet.add(edge.getFromNode());
                });
            }
            return nodesToSet;
        },

        /**
         * @protected
         * @param {ICollection.<GraphEdge>} edges
         */
        removeAllEdges: function(edges) {
            var _this = this;
            edges.forEach(function(edge) {
                _this.removeEdge(edge);
            });
        },

        /**
         * @protected
         * @param {GraphEdge} edge
         * @return {boolean}
         */
        removeEdge: function(edge) {
            if (this.edgeSet.contains(edge)) {
                var edgeFromSet = this.getEdgesFrom(edge.getFromNode());
                edgeFromSet.remove(edge);
                if (edgeFromSet.getCount() === 0) {
                    this.fromNodeToEdgeSetMap.remove(edge.getFromNode());
                }
                var edgeToSet = this.getEdgesTo(edge.getToNode());
                edgeToSet.remove(edge);
                if (edgeToSet.getCount() === 0) {
                    this.toNodeToEdgeSetMap.remove(edge.getToNode());
                }
                this.edgeSet.remove(edge);
                return true;
            }
            return false;
        },

        /**
         * @protected
         * @param {ICollection.<GraphNode>} nodes
         */
        removeAllNodes: function(nodes) {
            var _this = this;
            nodes.forEach(function(node) {
                _this.removeNode(node);
            });
        },

        /**
         * @protected
         * @param {GraphNode} node
         * @return {boolean}
         */
        removeNode: function(node) {
            if (this.nodeSet.contains(node)) {
                var edgesFrom = this.getEdgesFrom(node).clone();
                this.removeAllEdges(edgesFrom);
                var edgesTo = this.getEdgesTo(node).clone();
                this.removeAllEdges(edgesTo);
                this.nodeSet.remove(node);
                this.valueToNodeMap.remove(node.getValue());
                return true;
            }
            return false;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Graph', Graph);
});
