/**
 * Map info
 * 1) Supports null values but not undefined values. Undefined values are used to indicate something doesn't exist.
 * 2) Any value can be used as a key including null but not undefined.
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('MultiMap')

//@Require('Class')
//@Require('Collection')
//@Require('IMap')
//@Require('IMultiMap')
//@Require('Map')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Collection  = bugpack.require('Collection');
var IMap        = bugpack.require('IMap');
var IMultiMap   = bugpack.require('IMultiMap');
var Map         = bugpack.require('Map');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Map.<K, V>}
 * @implements {IMultiMap.<K, V>}
 * @template K, V
 */
var MultiMap = Class.extend(Map, /** @lends {MultiMap.prototype} */{

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {number}
     */
    getKeyCount: function() {
        return this.getCount();
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean=} deep
     * @return {MultiMap.<K, V>}
     */
    clone: function(deep) {
        var cloneMultiMap = new MultiMap();
        cloneMultiMap.putAll(this);
        return cloneMultiMap;
    },


    //-------------------------------------------------------------------------------
    // Class methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    containsValue: function(value) {
        var valueArray = this.getHashTable().getValueArray();
        for (var i = 0, size = valueArray.length; i < size; i++) {
            var valueCollection = valueArray[i];
            if (valueCollection.contains(value)) {
                return true;
            }
        }
        return false;
    },

    /**
     * @param {function(ICollection.<V>, K)} func
     */
    forEachCollection: function(func) {
        this.getHashTable().forEach(func);
    },

    /**
     * @param {function(V, K)} func
     */
    forEachValue: function(func) {
        this.getHashTable().forEach(function(valueCollection) {
            valueCollection.forEach(func);
        });
    },

    /**
     * @override
     * @param {*} key
     * @return {ICollection.<V>}
     */
    get: function(key) {
        return this.getHashTable().get(key);
    },

    /**
     * @return {ICollection.<K>}
     */
    getKeyCollection: function() {
        var keyCollection = new Collection();
        this.getHashTable().getKeyArray().forEach(function(key) {
            keyCollection.add(key);
        });
        return keyCollection;
    },

    /**
     * @return {Array.<V>}
     */
    getValueArray: function() {
        var valueArray = [];
        this.getHashTable().forEach(function(valueSet) {
            valueArray = valueArray.concat(valueSet.getValueArray());
        });
        return valueArray;
    },

    /**
     * @return {ICollection.<V>}
     */
    getValueCollection: function() {
        var valueCollection = new Collection();
        this.getHashTable().forEach(function(valueSet) {
            valueCollection.addAll(valueSet);
        });
        return valueCollection;
    },

    /**
     * @param {K} key
     * @param {V} value
     * @return {V}
     */
    put: function(key, value) {
        var valueCollection = this.getHashTable().get(key);
        if (!valueCollection) {
            valueCollection = new Collection();
            this.getHashTable().put(key, valueCollection);
        }
        valueCollection.add(value);
        return value;
    },

    /**
     * @param {IMap.<K, V>} map
     */
    putAll: function(map) {
        var _this = this;
        if (Class.doesImplement(map, IMap)) {
            map.getKeyArray().forEach(function(key) {
                var value = map.get(key);
                _this.put(key, value);
            });
        } else if (Class.doesImplement(map, IMultiMap)) {
            map.getKeyArray().forEach(function(key) {
                var valueCollection = map.get(key);
                valueCollection.forEach(function(value) {
                    _this.put(key, value);
                });
            });
        }
    },

    /**
     * Removes all values under the key
     * @param {*} key
     * @return {ICollection.<V>}
     */
    remove: function(key) {
        return this.getHashTable().remove(key);
    },

    /**
     * Removes a specific value associated with the key
     * @param {*} key
     * @param {*} value
     * @return {boolean}
     */
    removeKeyValuePair: function(key, value) {
        var result = false;
        var valueCollection = this.getHashTable().get(key);
        if (valueCollection) {
            result = valueCollection.remove(value);
            if (result && valueCollection.isEmpty()) {
                this.getHashTable().remove(valueCollection);
            }
        }
        return result;
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(MultiMap, IMultiMap);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('MultiMap', MultiMap);
