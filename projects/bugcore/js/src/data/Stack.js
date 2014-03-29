//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Stack')

//@Require('Class')
//@Require('Collection')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =         bugpack.require('Class');
var Collection =    bugpack.require('Collection');
var Obj =           bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Stack = Class.extend(Collection, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {(Collection.<*> | Array.<*>)} items
     */
    _constructor: function(items) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Array.<*>}
         */
        this.valueArray = [];

        if (items) {
            this.addAll(items);
        }
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @return {Array} Array is in the same order as the queue
     */
    getValueArray: function() {
        var valueArray = [];
        for (var i = 0, size = this.valueArray.length; i < size; i++) {
            valueArray.push(this.valueArray[i]);
        }
        return valueArray;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Queue}
     */
    clone: function() {
        var cloneStack = new Stack();
        cloneStack.addAll(this);
        return cloneStack;
    },


    //-------------------------------------------------------------------------------
    // Extended Collection Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     */
    add: function(value) {
        this._super(value);
        this.valueArray.push(value);
    },

    /**
     * @override
     * @param {function(*)} func
     */
    forEach: function(func) {
        for (var i = 0, size = this.valueArray.length; i < size; i++) {
            func(this.valueArray[i]);
        }
    },

    /**
     * Removes the FIRST occurrence of value from the queue
     * @param {*} value
     * @return {boolean}
     */
    remove: function(value) {
        if (this.contains(value)) {
            var index = this.indexOfLast(value);
            this.removeAt(index);
            return true;
        }
        return false;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    pop: function() {
        var lastIndex = this.getCount() - 1;
        if (lastIndex > -1) {
            return this.removeAt(lastIndex);
        } else {
            throw new Error("No elements left to pop");
        }
    },

    /**
     * @param {*} value
     */
    push: function(value) {
        this.add(value);
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {number} index
     * @return {*}
     */
    getAt: function(index) {
        if (index < this.getCount()) {
            return this.valueArray[index];
        } else {
            throw new Error("Index out of bounds");
        }
    },

    /**
     * @private
     * @param {*} value
     * @return {number}
     */
    indexOfLast: function(value) {
        for (var i = this.valueArray.length - 1; i >= 0; i--) {
            if (Obj.equals(this.valueArray[i], value)) {
                return i;
            }
        }
        return -1;
    },

    /**
     * @private
     * @param {number} index
     * @return {*} The removed value
     */
    removeAt: function(index) {
        var value = this.getAt(index);
        var result = this.hashStore.removeValue(value);
        if (result) {
            this.count--;
            this.valueArray.splice(index, 1);
        }
        return value;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Stack', Stack);
