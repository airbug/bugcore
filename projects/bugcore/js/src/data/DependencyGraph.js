/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('DependencyGraph')

//@Require('Class')
//@Require('Graph')
//@Require('GraphEdge')
//@Require('GraphNode')
//@Require('List')
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

    var Class           = bugpack.require('Class');
    var Graph           = bugpack.require('Graph');
    var GraphEdge       = bugpack.require('GraphEdge');
    var GraphNode       = bugpack.require('GraphNode');
    var List            = bugpack.require('List');
    var Map             = bugpack.require('Map');
    var Obj             = bugpack.require('Obj');
    var Set             = bugpack.require('Set');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Graph}
     */
    var DependencyGraph = Class.extend(Graph, {

        _name: "DependencyGraph",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} ofValue
         * @param {*} onValue
         */
        addDependency: function(ofValue, onValue) {
            if (!this.containsNodeForValue(ofValue)) {
                this.addNodeForValue(ofValue);
            }
            if (!this.containsNodeForValue(onValue)) {
                this.addNodeForValue(onValue);
            }
            this.addEdgeFromValueToValue(ofValue, onValue);
        },

        /**
         * @return {List<*>}
         */
        getValuesInDependentOrder: function() {
            var _this = this;
            var processedNodeSet = new Set();
            var valuesInDependentOrderList = new List();
            this.nodeSet.forEach(function(graphNode) {
                _this.processDependentOrder(graphNode, processedNodeSet, valuesInDependentOrderList);
            });
            return valuesInDependentOrderList;
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {GraphNode} graphNode
         * @param {Set<GraphNode>} processedNodeSet
         * @param {List<*>} valuesInDependentOrderList
         */
        processDependentOrder: function(graphNode, processedNodeSet, valuesInDependentOrderList) {
            var currentNodePathSet = new Set();
            this.processDependentOrderRecursive(graphNode, processedNodeSet, valuesInDependentOrderList, currentNodePathSet);
        },

        /**
         * @private
         * @param {GraphNode} graphNode
         * @param {Set<GraphNode>} processedNodeSet
         * @param {List<*>} valuesInDependentOrderList
         * @param {Set<GraphNode>} currentNodePathSet
         */
        processDependentOrderRecursive: function(graphNode, processedNodeSet, valuesInDependentOrderList, currentNodePathSet) {

            var _this = this;
            // TODO BRN: We can find the chain of the circular dependency by trickling back out of the recursive stack.
            if (currentNodePathSet.contains(graphNode)) {
                throw new Error("Cannot compute dependency order. Circular reference found.");
            } else {
                currentNodePathSet.add(graphNode);
            }

            if (!processedNodeSet.contains(graphNode)) {
                var nodeFromSet = this.getNodesFrom(graphNode);
                nodeFromSet.forEach(function(nodeFrom) {
                    _this.processDependentOrderRecursive(nodeFrom, processedNodeSet, valuesInDependentOrderList, currentNodePathSet);
                });
                valuesInDependentOrderList.add(graphNode.getValue());
                processedNodeSet.add(graphNode);
            }

            // NOTE BRN: We remove this node from the visited node set. Otherwise we will think this is a circular
            // reference when A -> B, A -> C, B -> C since through A we have already visited C and then we

            currentNodePathSet.remove(graphNode);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('DependencyGraph', DependencyGraph);
});
