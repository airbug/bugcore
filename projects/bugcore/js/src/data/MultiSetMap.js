/**
 * Map info
 * 1) Supports null values but not undefined values. Undefined values are used to indicate something doesn't exist.
 * 2) Any value can be used as a key including null but not undefined.
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('MultiSetMap')

//@Require('Class')
//@Require('MultiMap')
//@Require('Set')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var MultiMap    = bugpack.require('MultiMap');
var Set         = bugpack.require('Set');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MultiSetMap = Class.extend(MultiMap, {

    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    clone: function() {
        var cloneMultiSetMap = new MultiSetMap();
        cloneMultiSetMap.putAll(this);
        return cloneMultiSetMap;
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
        var valueSet = this.hashTable.get(key);
        if (!valueSet) {
            valueSet = new Set();
            this.hashTable.put(key, valueSet);
        }
        var result = valueSet.add(value);
        if (result) {
            return value;
        }
        return undefined;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('MultiSetMap', MultiSetMap);
