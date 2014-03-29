//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('HashStoreNode')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class = bugpack.require('Class');
var Obj =   bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var HashStoreNode = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {number}
         */
        this.count = 0;

        /**
         * @private
         * @type {Array.<*>}
         */
        this.valueArray = [];
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {number}
     */
    getCount: function() {
        return this.count;
    },

    /**
     * @param {*} value
     * @return {number}
     */
    getValueCount: function(value) {
        var count = 0;
        for (var i = 0, size = this.valueArray.length; i < size; i++) {
            var valueArrayValue = this.valueArray[i];
            if (Obj.equals(value, valueArrayValue)) {
                count++;
            }
        }
        return count;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, HashStoreNode)) {
            if (this.getCount() === value.getCount()) {
                for (var i = 0, size = this.valueArray.length; i < size; i++) {
                    var valueArrayValue = this.valueArray[i];
                    if (!value.containsValue(valueArrayValue)) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    },

    /**
     * @return {string}
     */
    toString: function() {
        var output = "{";
        output += "  count:" + this.getCount() + ",\n";
        output += "  values:[\n";
        this.valueArray.forEach(function(value) {
            output += value + ",";
        });
        output += "  ]";
        output += "}";
        return output;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     */
    addValue: function(value) {
        this.valueArray.push(value);
        this.count++;
    },

    /**
     * @param {*} value
     */
    containsValue: function(value) {
        for (var i = 0, size = this.valueArray.length; i < size; i++) {
            var valueArrayValue = this.valueArray[i];
            if (Obj.equals(value, valueArrayValue)) {
                return true;
            }
        }
        return false;
    },

    //countValues: function(value)

    /**
     * @return {Array<*>}
     */
    getValueArray: function() {
        return this.valueArray;
    },

    /**
     * @param {*} value
     * @return {boolean}
     */
    removeValue: function(value) {
        for (var i = 0, size = this.valueArray.length; i < size; i++) {
            var valueArrayValue = this.valueArray[i];
            if (Obj.equals(value, valueArrayValue)) {
                this.valueArray.splice(i, 1);
                this.count--;
                return true;
            }
        }
        return false;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('HashStoreNode', HashStoreNode);
