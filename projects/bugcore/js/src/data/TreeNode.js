//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('TreeNode')

//@Require('Class')
//@Require('List')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class = bugpack.require('Class');
var List =  bugpack.require('List');
var Obj =   bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var TreeNode = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(value) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {List.<TreeNode>}
         */
        this.childNodes = null;

        /**
         * @private
         * @type {TreeNode}
         */
        this.parentNode = null;

        /**
         * @private
         * @type {*}
         */
        this.value = value;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {List.<TreeNode>}
     */
    getChildNodes: function() {
        if (!this.childNodes) {
            this.childNodes = new List();
        }
        return this.childNodes;
    },

    /**
     * @return {TreeNode}
     */
    getParentNode: function() {
        return this.parentNode
    },

    /**
     * @param {TreeNode} parentNode
     */
    setParentNode: function(parentNode) {
        this.parentNode = parentNode;
    },

    /**
     * @return {*}
     */
    getValue: function() {
        return this.value;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    toString: function() {
        var output = "[TreeNode] {\n";
        output += "\tchildren: [\n";
        var childOutput = "";
        this.getChildNodes().forEach(function(childNode) {
            childOutput += childNode.toString();
        });
        if (childOutput) {
            var childOutputParts = childOutput.split("\n");
            for (var i = 0, size = childOutputParts.length; i < size; i++) {
                var childOutputPart = childOutputParts[i];
                output += "\t\t" + childOutputPart + "\n";
            }
        }
        output += "\t]\n";
        output += "}\n";
        return output;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    addChildNode: function(childNode) {
        if (!this.childNodes) {
            this.childNodes = new List();
        }
        //TODO BRN: Make sure that the child node can't be added more than once.
        //TODO BRN: Check if the child node already has a parent. If it does then we should remove it from it's old parent and add it to this one.
        this.childNodes.add(childNode);
        childNode.setParentNode(this);
    },

    addChildNodeAt: function(index, childNode) {
        //TODO BRN (OIN)
    },

    // QUESTION: Should this search recursively?
    /**
     * @param {TreeNode} childNode
     * @return {boolean}
     */
    containsChildNode: function(childNode) {
        if (this.childNodes) {
            return this.childNodes.contains(childNode);
        }
        return false;
    },

    /**
     * @param {number} index
     */
    getChildNodeAt: function(index) {
        if (this.childNodes) {
            return this.childNodes.getAt(index);
        }
        throw new Error("Index out of bounds");
    },

    /**
     * @return {number}
     */
    numberChildNodes: function() {
        if (this.childNodes) {
            return this.childNodes.getCount();
        }
        return 0;
    },

    /**
     * @param {TreeNode} childNode
     * @return {Boolean}
     */
    removeChildNode: function(childNode) {
        if (this.containsChildNode(childNode)) {
            this.childNodes.remove(childNode);
            childNode.setParentNode(null);
            return true;
        }
        return false;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('TreeNode', TreeNode);
