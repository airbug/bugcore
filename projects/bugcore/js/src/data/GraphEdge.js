//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('GraphEdge')

//@Require('Class')
//@Require('GraphNode')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
var GraphNode = bugpack.require('GraphNode');
var Obj =       bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var GraphEdge = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(fromNode, toNode) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {GraphNode}
         */
        this.fromNode = fromNode;

        /**
         * @private
         * @type {GraphNode}
         */
        this.toNode = toNode;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {GraphNode}
     */
    getFromNode: function() {
        return this.fromNode;
    },

    /**
     * @return {GraphNode}
     */
    getToNode: function() {
        return this.toNode;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, GraphEdge)) {
            return (Obj.equals(value.getFromNode(), this.getFromNode()) && Obj.equals(value.getToNode(), this.getToNode()));
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[GraphEdge]" + Obj.hashCode(this.fromNode) + "_" + Obj.hashCode(this.toNode));
        }
        return this._hashCode;
    },

    /**
     * @return {string}
     */
    toString: function() {
        var output = "";
        output += "{\n";

        output += "}\n";
        return output;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('GraphEdge', GraphEdge);
