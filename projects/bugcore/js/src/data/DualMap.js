/**
 * Map info
 * 1) Supports null values but not undefined values. Undefined values are used to indicate something doesn't exist.
 * 2) Any value can be used as a key including null but not undefined.
 * 3) Unlinke the BidiMap, this map can have multiple entries for the same value. When looking up by value, a Collection
 *      of keys will be returned
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('DualMap')

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

var DualMap = Class.extend(Obj, {

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
        this.keyValueHashTable              = new HashTable();

        /**
         * @private
         * @type {HashTable}
         */
        this.valueKeyCollectionHashTable    = new HashTable();
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
     * @return {DualMap.<*, *>}
     */
    clone: function() {
        var cloneDualMap = new DualMap();
        cloneDualMap.putAll(this);
        return cloneDualMap;
    },


    //-------------------------------------------------------------------------------
    // Class methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    clear: function() {
        this.keyValueHashTable              = new HashTable();
        this.valueKeyCollectionHashTable    = new HashTable();
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
        return this.valueKeyCollectionHashTable.containsKey(value);
    },

    /**
     * @param {function(*)} func
     */
    forEach: function(func) {
        this.keyValueHashTable.forEach(func);
    },

    /**
     * @param {*} value
     * @return {Collection.<*>}
     */
    getKeys: function(value) {
        return this.valueKeyCollectionHashTable.get(value);
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
     * @return {Collection.<*>}
     */
    getKeyCollection: function() {
        return new Collection(this.keyValueHashTable.getKeyArray());
    },

    /**
     * @return {Array.<*>}
     */
    getValueArray: function() {
        return this.keyValueHashTable.getValueArray();
    },

    /**
     * @return {Collection.<*>}
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
        var previousValue = undefined;
        if (this.containsKey(key)) {
            previousValue = this.removeByKey(key);
        }
        this.keyValueHashTable.put(key, value);
        var keyCollection = this.valueKeyCollectionHashTable.get(value);
        if (!keyCollection) {
            keyCollection = new Collection();
            this.valueKeyCollectionHashTable.put(value, keyCollection);
        }
        keyCollection.add(key);
        return previousValue;
    },

    /**
     * @param {(Map.<*, *>|DualMap.<*, *>)} map
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
            var keyCollection = this.valueKeyCollectionHashTable.get(value);
            keyCollection.remove(key);
            if (keyCollection.isEmpty()) {
                this.valueKeyCollectionHashTable.remove(value);
            }
        }
        return value;
    },

    /**
     * @param {*} value
     * @return {*} Returns a Collection of the keys that this value was removed from
     */
    removeByValue: function(value) {
        var _this = this;
        var keyCollection = this.valueKeyCollectionHashTable.get(value);
        if (!TypeUtil.isUndefined(keyCollection)) {
            keyCollection.forEach(function(key) {
                _this.removeByKey(key);
            });
        }
        return keyCollection;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('DualMap', DualMap);
