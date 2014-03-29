//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('HashTableNode')

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

var HashTableNode = Class.extend(Obj, {

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
         * @type {Array<*>}
         */
        this.hashTableKeyArray = [];

        /**
         * @private
         * @type {Array<*>}
         */
        this.hashTableValueArray = [];
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


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    toString: function() {
        var output = "{";
        output += "  count:" + this.getCount() + ",\n";
        output += "  hashTableKeyArray:[\n";
        this.hashTableKeyArray.forEach(function(value) {
            output += value.toString() + ",";
        });
        output += "  ]";
        output += "  hashTableValueArray:[\n";
        this.hashTableValueArray.forEach(function(value) {
            output += value.toString() + ",";
        });
        output += "  ]";
        output += "}";
        return output;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} key
     * @return {boolean}
     */
    containsKey: function(key) {
        for (var i = 0, size = this.hashTableKeyArray.length; i < size; i++) {
            var hashTableKey = this.hashTableKeyArray[i];
            if (Obj.equals(key, hashTableKey)) {
                return true;
            }
        }
        return false;
    },

    /**
     * @param {*} value
     * @return {boolean}
     */
    containsValue: function(value) {
        for (var i = 0, size = this.hashTableValueArray.length; i < size; i++) {
            var hashTableValue = this.hashTableValueArray[i];
            if (Obj.equals(value, hashTableValue)) {
                return true;
            }
        }
        return false;
    },

    /**
     * @param {*} key
     * @return {*}
     */
    get: function(key) {
        for (var i = 0, size = this.hashTableKeyArray.length; i < size; i++) {
            var hashTableKey = this.hashTableKeyArray[i];
            if (Obj.equals(key, hashTableKey)) {
                return this.hashTableValueArray[i];
            }
        }
        return undefined;
    },

    /**
     * @return {Array<*>}
     */
    getKeyArray: function() {
        return this.hashTableKeyArray;
    },

    /**
     * @return {Array<*>}
     */
    getValueArray: function() {
        return this.hashTableValueArray;
    },

    /**
     * @param {*} key
     * @param {*} value
     * @return {*}
     */
    put: function(key, value) {
        for (var i = 0, size = this.hashTableKeyArray.length; i < size; i++) {
            var hashTableKey = this.hashTableKeyArray[i];
            if (Obj.equals(key, hashTableKey)) {
                var previousValue = this.hashTableValueArray[i];
                this.hashTableValueArray[i] = value;
                return previousValue;
            }
        }

        //NOTE BRN: If we make it to here it means we did not find a hash table entry that already exists for this key.

        this.hashTableKeyArray.push(key);
        this.hashTableValueArray.push(value);
        this.count++;
        return undefined;
    },

    /**
     * @param {*} key
     * @return {*}
     */
    remove: function(key) {
        for (var i = 0, size = this.hashTableKeyArray.length; i < size; i++) {
            var hashTableKey = this.hashTableKeyArray[i];
            if (Obj.equals(key, hashTableKey)) {
                var removedValue = this.hashTableValueArray[i];
                this.hashTableKeyArray.splice(i, 1);
                this.hashTableValueArray.splice(i, 1);
                this.count--;
                return removedValue;
            }
        }
        return undefined;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('HashTableNode', HashTableNode);
