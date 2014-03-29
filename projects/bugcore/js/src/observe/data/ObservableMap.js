//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ObservableMap')

//@Require('Class')
//@Require('ClearChange')
//@Require('Collection')
//@Require('HashTable')
//@Require('IMap')
//@Require('IObjectable')
//@Require('Map')
//@Require('Obj')
//@Require('Observable')
//@Require('PutChange')
//@Require('RemoveChange')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var ClearChange     = bugpack.require('ClearChange');
var Collection      = bugpack.require('Collection');
var HashTable       = bugpack.require('HashTable');
var IMap            = bugpack.require('IMap');
var IObjectable     = bugpack.require('IObjectable');
var Map             = bugpack.require('Map');
var Obj             = bugpack.require('Obj');
var Observable      = bugpack.require('Observable');
var PutChange       = bugpack.require('PutChange');
var RemoveChange    = bugpack.require('RemoveChange');
var TypeUtil        = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ObservableMap = Class.extend(Observable, /** @lends {ObservableMap.prototype} */ {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {IMap.<*>} map
     */
    _constructor: function(map) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {IMap}
         */
        this.observed = this.factoryObserved(map);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {IMap}
     */
    getObserved: function() {
        return this.observed;
    },


    //-------------------------------------------------------------------------------
    // Obj Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean=} deep
     * @return {Map.<K, V>}
     */
    clone: function(deep) {
        var cloneMap = new ObservableMap();
        if (deep) {
            this.forEach(function(value, key) {
                cloneMap.put(Obj.clone(key, deep), Obj.clone(value, deep));
            });
        } else {
            cloneMap.putAll(this);
        }
        return cloneMap;
    },


    //-------------------------------------------------------------------------------
    // IMap Implementation
    //-------------------------------------------------------------------------------

    /**
     *
     */
    clear: function() {
        this.observed.clear();
        this.notifyObservers(new ClearChange(""));
    },

    /**
     * @param {*} key
     * @return {boolean}
     */
    containsKey: function(key) {
        return this.observed.containsKey(key);
    },

    /**
     * @param {*} value
     * @return {boolean}
     */
    containsValue: function(value) {
        return this.observed.containsValue(value);
    },

    /**
     * @param {function(V, K)} func
     */
    forEach: function(func) {
        this.observed.forEach(func);
    },

    /**
     * @param {*} key
     * @return {V} Returns undefined if no value is found.
     */
    get: function(key) {
        return this.observed.get(key);
    },

    /**
     * @return {number}
     */
    getCount: function() {
        return this.observed.getCount();
    },

    /**
     * @return {Array.<K>}
     */
    getKeyArray: function() {
        return this.observed.getKeyArray();
    },

    /**
     * @return {ICollection.<K>}
     */
    getKeyCollection: function() {
        return this.observed.getKeyCollection();
    },

    /**
     * @return {Array.<V>}
     */
    getValueArray: function() {
        return this.observed.getValueArray();
    },

    /**
     * @return {ICollection.<V>}
     */
    getValueCollection: function() {
        return this.observed.getValueCollection();
    },

    /**
     * @return {boolean}
     */
    isEmpty: function() {
        return this.observed.isEmpty();
    },

    /**
     * @param {K} key
     * @param {V} value
     * @return {V}
     */
    put: function(key, value) {
        var previousValue = this.observed.put(key, value);
        this.notifyObservers(new PutChange("", key, value, previousValue));
        return previousValue;
    },

    /**
     * @param {IMap.<K, V>} map
     */
    putAll: function(map) {
        var _this = this;
        if (Class.doesImplement(map, IMap)) {
            var keys = map.getKeyArray();
            keys.forEach(function(key) {
                var value = map.get(key);
                _this.put(key, value);
            });
        }
    },

    /**
     * @param {*} key
     * @return {V}
     */
    remove: function(key) {
        var result = this.observed.remove(key);
        if (!TypeUtil.isUndefined(result)) {
            this.notifyObservers(new RemoveChange("", result));
        }
        return result;
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @returns {Object}
     */
    toObject: function() {
        this.observed.toObject();
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {IMap=} map
     */
    factoryObserved: function(map) {
        return new Map(map);
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(ObservableMap, IMap);
Class.implement(ObservableMap, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('ObservableMap', ObservableMap);
