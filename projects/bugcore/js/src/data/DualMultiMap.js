/**
 * Map info
 * 1) Supports null values but not undefined values. Undefined values are used to indicate something doesn't exist.
 * 2) Any value can be used as a key including null but not undefined.
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('DualMultiMap')

//@Require('Class')
//@Require('Collection')
//@Require('DualMap')
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
var DualMap     = bugpack.require('DualMap');
var TypeUtil    = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @extends {DualMap}
 */
var DualMultiMap = Class.extend(DualMap, {

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
     * @return {DualMultiMap}
     */
    clone: function() {
        var cloneDualMultiMap = new DualMultiMap();
        cloneDualMultiMap.putAll(this);
        return cloneDualMultiMap;
    },


    //-------------------------------------------------------------------------------
    // Class methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(*)} func
     */
    forEach: function(func) {
        this.keyValueHashTable.forEach(function(valueCollection) {
            valueCollection.forEach(func);
        });
    },

    /**
     * @param {*} key
     * @return {(Collection.<*> | undefined)} Returns undefined if no value is found.
     */
    getValue: function(key) {
        return this.keyValueHashTable.get(key);
    },

    /**
     * @param {*} key
     * @param {*} value
     * @return {*}
     */
    put: function(key, value) {
        var valueCollection = this.keyValueHashTable.get(key);
        if (!valueCollection) {
            valueCollection = new Collection();
            this.keyValueHashTable.put(key, valueCollection);
        }
        valueCollection.add(value);
        var keyCollection = this.valueKeyCollectionHashTable.get(value);
        if (!keyCollection) {
            keyCollection = new Collection();
            this.valueKeyCollectionHashTable.put(value, keyCollection);
        }
        keyCollection.add(key);
        return value;
    },

    /**
     * @param {*} key
     * @return {Collection.<*>} Returns a Collection of the values that were removed
     */
    removeByKey: function(key) {
        var _this = this;
        var valueCollection = this.keyValueHashTable.get(key);
        if (!TypeUtil.isUndefined(valueCollection)) {
            valueCollection.forEach(function(value) {
                _this.removeKeyValuePair(key, value);
            });
        }
        return valueCollection;
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
                _this.removeKeyValuePair(key, value);
            });
        }
        return keyCollection;
    },

    /**
     * Removes a specific value associated with the key
     * @param {*} key
     * @param {*} value
     * @return {boolean}
     */
    removeKeyValuePair: function(key, value) {
        var result = false;
        var valueCollection = this.keyValueHashTable.get(key);
        if (valueCollection) {
            result = valueCollection.remove(value);
            if (result) {
                if (valueCollection.isEmpty()) {
                    this.keyValueHashTable.remove(valueCollection);
                }
                var keyCollection = this.valueKeyCollectionHashTable.get(value);
                keyCollection.remove(key);
                if (keyCollection.isEmpty()) {
                    this.valueKeyCollectionHashTable.remove(keyCollection);
                }
            }
        }
        return result;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('DualMultiMap', DualMultiMap);
