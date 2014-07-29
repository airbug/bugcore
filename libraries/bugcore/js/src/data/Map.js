/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Map')

//@Require('Class')
//@Require('Collection')
//@Require('HashTable')
//@Require('IMap')
//@Require('IObjectable')
//@Require('Obj')
//@Require('ObjectUtil')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Collection      = bugpack.require('Collection');
    var HashTable       = bugpack.require('HashTable');
    var IMap            = bugpack.require('IMap');
    var IObjectable     = bugpack.require('IObjectable');
    var Obj             = bugpack.require('Obj');
    var ObjectUtil      = bugpack.require('ObjectUtil');
    var TypeUtil        = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * Map info
     * 1) Supports null values but not undefined values. Undefined values are used to indicate something doesn't exist.
     * 2) Any value can be used as a key including null but not undefined.
     *
     * @class
     * @extends {Obj}
     * @implements {IMap.<K, V>}
     * @implements {IObjectable}
     * @template K, V
     */
    var Map = Class.extend(Obj, /** @lends {Map.prototype} */ {

        _name: "Map",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {(IMap.<K, V> | Object.<K, V>)} map
         */
        _constructor: function(map) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {HashTable}
             */
            this.hashTable = new HashTable();

            if (map) {
                this.putAll(map);
            }
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {HashTable}
         */
        getHashTable: function() {
            return this.hashTable;
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean=} deep
         * @return {Map.<K, V>}
         */
        clone: function(deep) {
            var cloneMap = new Map();
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
            this.hashTable = new HashTable();
        },

        /**
         * @param {*} key
         * @return {boolean}
         */
        containsKey: function(key) {
            return this.hashTable.containsKey(key);
        },

        /**
         * @param {*} value
         * @return {boolean}
         */
        containsValue: function(value) {
            return this.hashTable.containsValue(value);
        },

        /**
         * @param {function(V, K)} func
         */
        forEach: function(func) {
            this.hashTable.forEach(func);
        },

        /**
         * @param {*} key
         * @return {V} Returns undefined if no value is found.
         */
        get: function(key) {
            return this.hashTable.get(key);
        },

        /**
         * @return {number}
         */
        getCount: function() {
            return this.hashTable.getCount();
        },

        /**
         * @return {Array.<K>}
         */
        getKeyArray: function() {
            return this.hashTable.getKeyArray();
        },

        /**
         * @return {ICollection.<K>}
         */
        getKeyCollection: function() {
            var keyCollection = new Collection();
            this.hashTable.getKeyArray().forEach(function(key) {
                keyCollection.add(key);
            });
            return keyCollection;
        },

        /**
         * @return {Array.<V>}
         */
        getValueArray: function() {
            return this.hashTable.getValueArray();
        },

        /**
         * @return {ICollection.<V>}
         */
        getValueCollection: function() {
            var valueCollection = new Collection();
            this.hashTable.forEach(function(value) {
                valueCollection.add(value);
            });
            return valueCollection;
        },

        /**
         * @return {boolean}
         */
        isEmpty: function() {
            return this.hashTable.isEmpty();
        },

        /**
         * @param {K} key
         * @param {V} value
         * @return {V}
         */
        put: function(key, value) {
            return this.hashTable.put(key, value);
        },

        /**
         * @param {(IMap.<K, V> | Object.<K, V>)} map
         */
        putAll: function(map) {
            var _this = this;
            if (Class.doesImplement(map, IMap)) {
                var keys = map.getKeyArray();
                keys.forEach(function(key) {
                    var value = map.get(key);
                    _this.put(key, value);
                });
            } else if (TypeUtil.isObject(map)) {
                ObjectUtil.forIn(map, function(key, value) {
                    _this.put(key, value);
                });
            }
        },

        /**
         * @param {*} key
         * @return {V}
         */
        remove: function(key) {
            return this.hashTable.remove(key);
        },


        //-------------------------------------------------------------------------------
        // IObjectable Implementation
        //-------------------------------------------------------------------------------

        /**
         * @returns {Object}
         */
        toObject: function() {
            var _this   = this;
            var object  = {};
            var keys    = this.getKeyArray();
            keys.forEach(function(key){
                var stringKey = key;
                if (!TypeUtil.isString(key) && TypeUtil.isObject(key) && TypeUtil.isFunction(key.toString)) {
                    stringKey = key.toString(); //NOTE: These keys may not be unique.
                }
                object[stringKey] = _this.get(key);
            });
            return object;
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(Map, IMap);
    Class.implement(Map, IObjectable);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Map', Map);
});