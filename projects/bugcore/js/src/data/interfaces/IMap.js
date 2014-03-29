//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IMap')

//@Require('Interface')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Interface           = bugpack.require('Interface');


//-------------------------------------------------------------------------------
// Declare Interface
//-------------------------------------------------------------------------------

/**
 * @interface
 * @template K, V
 */
var IMap = Interface.declare({

    //-------------------------------------------------------------------------------
    // Interface Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    clear: function() {},

    /**
     * @param {*} key
     * @return {boolean}
     */
    containsKey: function(key) {},

    /**
     * @param {*} value
     * @return {boolean}
     */
    containsValue: function(value) {},

    /**
     * @param {function(V, K)} func
     */
    forEach: function(func) {},

    /**
     * @param {*} key
     * @return {V}
     */
    get: function(key) {},

    /**
     * @return {number}
     */
    getCount: function() {},

    /**
     * @return {Array.<K>}
     */
    getKeyArray: function() {},

    /**
     * @return {ICollection.<K>}
     */
    getKeyCollection: function() {},

    /**
     * @return {Array.<V>}
     */
    getValueArray: function() {},

    /**
     * @return {ICollection.<V>}
     */
    getValueCollection: function() {},

    /**
     * @return {boolean}
     */
    isEmpty: function() {},

    /**
     * @param {K} key
     * @param {V} value
     * @return {V}
     */
    put: function(key, value) {},

    /**
     * @param {IMap.<K, V>} map
     */
    putAll: function(map) {},

    /**
     * @param {*} key
     * @return {V}
     */
    remove: function(key) {
        return this.hashTable.remove(key);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('IMap', IMap);
