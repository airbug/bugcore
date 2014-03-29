/**
 * Map info
 * 1) Supports null values but not undefined values. Undefined values are used to indicate something doesn't exist.
 * 2) Any value can be used as a key including null but not undefined.
 * 3) There can only be one instance of a value in this map. If a value is added again under another key, then we
 *      remove the old key/value pair before adding the new key/value mapping.
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('BidiMap')

//@Require('Class')
//@Require('Collection')
//@Require('HashTable')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Collection  = bugpack.require('Collection');
var HashTable   = bugpack.require('HashTable');
var Map         = bugpack.require('Map');
var Obj         = bugpack.require('Obj');
var TypeUtil    = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BidiMap = Class.extend(Obj, {

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
         * @type {HashTable}
         */
        this.keyValueHashTable = new HashTable();

        /**
         * @private
         * @type {HashTable}
         */
        this.valueKeyHashTable = new HashTable();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {number}
     */
    getCount: function() {
        return this.keyValueHashTable.getCount();
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {BidiMap}
     */
    clone: function() {
        var cloneMap = new BidiMap();
        cloneMap.putAll(this);
        return cloneMap;
    },


    //-------------------------------------------------------------------------------
    // Class methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    clear: function() {
        this.keyValueHashTable = new HashTable();
        this.valueKeyHashTable = new HashTable();
    },

    /**
     * @param {*} key
     * @return {boolean}
     */
    containsKey: function(key) {
        return this.keyValueHashTable.containsKey(key);
    },

    /**
     * @param {*} value
     * @return {boolean}
     */
    containsValue: function(value) {
        return this.valueKeyHashTable.containsKey(value);
    },

    /**
     * @param {function(*)} func
     */
    forEach: function(func) {
        this.keyValueHashTable.forEach(func);
    },

    /**
     * @param {string} value
     * @return {(*|undefined)}
     */
    getKey: function(value) {
        return this.valueKeyHashTable.get(value);
    },

    /**
     * @param {*} key
     * @return {(*|undefined)} Returns undefined if no value is found.
     */
    getValue: function(key) {
        return this.keyValueHashTable.get(key);
    },

    /**
     * @return {Array<*>}
     */
    getKeyArray: function() {
        return this.keyValueHashTable.getKeyArray();
    },

    /**
     * @return {Collection}
     */
    getKeyCollection: function() {
        var keyCollection = new Collection();
        this.valueKeyHashTable.forEach(function(key) {
            keyCollection.add(key);
        });
        return keyCollection;
    },

    /**
     * @return {Array<*>}
     */
    getValueArray: function() {
        return this.keyValueHashTable.getValueArray();
    },

    /**
     * @return {Collection}
     */
    getValueCollection: function() {
        var valueCollection = new Collection();
        this.keyValueHashTable.forEach(function(value) {
            valueCollection.add(value);
        });
        return valueCollection;
    },

    /**
     * @return {boolean}
     */
    isEmpty: function() {
        return this.keyValueHashTable.isEmpty();
    },

    /**
     * @param {*} key
     * @param {*} value
     * @return {*}
     */
    put: function(key, value) {
        var currentKey = this.valueKeyHashTable.put(value, key);
        if (currentKey && !Obj.equals(currentKey, key)) {
            this.keyValueHashTable.remove(currentKey);
        }
        return this.keyValueHashTable.put(key, value);
    },

    /**
     * @param {(Map|DualMap)} map
     */
    putAll: function(map) {
        if (Class.doesExtend(map, Map)) {
            var keys = map.getKeyArray();
            keys.forEach(function(key) {
                var value = map.get(key);
                this.put(key, value);
            });
        } else if (Class.doesExtend(map, DualMap)) {
            var keys = map.getKeyArray();
            keys.forEach(function(key) {
                var value = map.getValue(key);
                this.put(key, value);
            });
        }
    },

    /**
     * @param {*} key
     * @return {*}
     */
    removeByKey: function(key) {
        var value = this.keyValueHashTable.remove(key);
        if (!TypeUtil.isUndefined(value)) {
            this.valueKeyHashTable.remove(value);
        }
        return value;
    },

    /**
     * @param {*} value
     * @return {*}
     */
    removeByValue: function(value) {
        var key = this.valueKeyHashTable.remove(value);
        if (!TypeUtil.isUndefined(key)) {
            this.keyValueHashTable.remove(key);
        }
        return key;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('BidiMap', BidiMap);
