//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ReferenceGraph')

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
    var ReferenceGraph = Class.extend(Graph, {

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
             * @type {Set.<*>}
             */
            this.unreferencedValueSet   = new Set();

            /**
             * @private
             * @type {Set.<*>}
             */
            this.rootValueSet           = new Set();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} rootValue
         */
        addRootValue: function(rootValue) {
            this.rootValueSet.add(rootValue);
            this.addValue(rootValue);
        },

        /**
         * @param {*} value
         * @return {boolean}
         */
        addValue: function(value) {
            var result = this.addNodeForValue(value);
            if (result) {
                if (!this.isRootValue(value)) {
                    this.addUnreferencedValue(value);
                }
            }
            return result;
        },

        /**
         * @param {*} fromValue
         * @param {*} toValue
         * @return {boolean}
         */
        addReference: function(fromValue, toValue) {
            var result = this.addEdgeFromValueToValue(fromValue, toValue);
            if (result) {
                this.removeUnreferencedValue(toValue);
            }
            return result;
        },

        /**
         * @return {ICollection.<*>}
         */
        getUnreferencedValues: function() {
            return this.unreferencedValueSet;
        },

        /**
         * @param {*} value
         * @return {boolean}
         */
        isRootValue: function(value) {
            return this.rootValueSet.contains(value);
        },

        /**
         * @param {*} value
         * @return {boolean}
         */
        removeValue: function(value) {
            var _this   = this;
            var node    = this.getNode(value);
            if (node) {
                var referencedNodes = this.getNodesFrom(node);
                this.removeNodeForValue(value);
                this.removeUnreferencedValue(value);
                this.rootValueSet.remove(value);
                referencedNodes.forEach(function(referencedNode) {
                    _this.runUnreferencedValueCheck(referencedNode.getValue());
                });
                return true;
            }
            return false;
        },

        /**
         * @param {(ICollection.<*> | Array.<*>)} values
         */
        removeValues: function(values) {
            var _this = this;
            values.forEach(function(value) {
                _this.removeValue(value);
            });
        },

        /**
         * @param {*} fromValue
         * @param {*} toValue
         */
        removeReference: function(fromValue, toValue) {
            var result = this.removeEdgeFromValueToValue(fromValue, toValue);
            if (result) {
                this.runUnreferencedValueCheck(toValue);
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {*} value
         */
        addUnreferencedValue: function(value) {
            if (this.containsNode(value)) {
                this.unreferencedValueSet.add(value);
            }
        },

        /**
         * @param {GraphNode} node
         * @returns {number}
         */
        getNodeReferenceCount: function(node) {
            var edgesTo = this.getEdgesTo(node);
            return edgesTo.getCount();
        },

        /**
         * @private
         * @param {*} value
         */
        removeUnreferencedValue: function(value) {
            this.unreferencedValueSet.remove(value);
        },

        /**
         * @private
         * @param {*} value
         */
        runUnreferencedValueCheck: function(value) {
            if (!this.isRootValue(value)) {
                var node = this.getNode(value);
                var referenceCount = this.getNodeReferenceCount(node);
                if (referenceCount === 0) {
                    this.addUnreferencedValue(node.getValue());
                }
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ReferenceGraph', ReferenceGraph);
});
