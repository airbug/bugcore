/**
 * Map info
 * 1) Supports null values but not undefined values. Undefined values are used to indicate something doesn't exist.
 * 2) Any value can be used as a key including null but not undefined.
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('DualMultiSetMap')

//@Require('Class')
//@Require('DualMultiMap')
//@Require('Set')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var DualMultiMap    = bugpack.require('DualMultiMap');
var Set             = bugpack.require('Set');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @extends {DualMultiMap}
 */
var DualMultiSetMap = Class.extend(DualMultiMap, {

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
     * @return {DualMultiSetMap}
     */
    clone: function() {
        var cloneDualMultiSetMap = new DualMultiSetMap();
        cloneDualMultiSetMap.putAll(this);
        return cloneDualMultiSetMap;
    },


    //-------------------------------------------------------------------------------
    // Class methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} key
     * @param {*} value
     * @return {*}
     */
    put: function(key, value) {
        var valueCollection = this.keyValueHashTable.get(key);
        if (!valueCollection) {
            valueCollection = new Set();
            this.keyValueHashTable.put(key, valueCollection);
        }
        var result = valueCollection.add(value);
        if (result) {
            var keyCollection = this.valueKeyCollectionHashTable.get(value);
            if (!keyCollection) {
                keyCollection = new Set();
                this.valueKeyCollectionHashTable.put(value, keyCollection);
            }
            keyCollection.add(key);
            return value;
        }
        return undefined;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('DualMultiSetMap', DualMultiSetMap);
