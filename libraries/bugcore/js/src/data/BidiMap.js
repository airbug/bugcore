/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('BidiMap')

//@Require('Class')
//@Require('Collection')
//@Require('HashTable')
//@Require('IKeyValueIterable')
//@Require('Map')
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

    var Class               = bugpack.require('Class');
    var Collection          = bugpack.require('Collection');
    var HashTable           = bugpack.require('HashTable');
    var IKeyValueIterable   = bugpack.require('IKeyValueIterable');
    var Map                 = bugpack.require('Map');
    var Obj                 = bugpack.require('Obj');
    var ObjectUtil          = bugpack.require('ObjectUtil');
    var TypeUtil            = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * Map info
     * 1) Supports null values but not undefined values. Undefined values are used to indicate something doesn't exist.
     * 2) Any value can be used as a key including null but not undefined.
     * 3) There can only be one instance of a value in this map. If a value is added again under another key, then we
     *      remove the old key/value pair before adding the new key/value mapping.
     *
     * @class
     * @extends {Obj}
     * @implements {IKeyValueIterable.<K, V>}
     * @template K, V
     */
    var BidiMap = Class.extend(Obj, {

        _name: "BidiMap",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {(IKeyValueIterable.<K, V> | Object.<K, V>)} map
         */
        _constructor: function(map) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {HashTable.<K, V>}
             */
            this.keyValueHashTable = new HashTable();

            /**
             * @private
             * @type {HashTable.<V, K>}
             */
            this.valueKeyHashTable = new HashTable();

            if (map) {
                this.putAll(map);
            }
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {HashTable.<K, V>}
         */
        getKeyValueHashTable: function() {
            return this.keyValueHashTable;
        },

        /**
         * @return {HashTable.<V, K>}
         */
        getValueKeyHashTable: function() {
            return this.valueKeyHashTable;
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {BidiMap.<K, V>}
         */
        clone: function() {
            var cloneMap = new BidiMap();
            cloneMap.putAll(this);
            return cloneMap;
        },


        //-------------------------------------------------------------------------------
        // IKeyValueIterable Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {function(V, K)} func
         */
        forEach: function(func) {
            this.keyValueHashTable.forEach(func);
        },

        /**
         * @param {function(K, V)} func
         */
        forIn: function(func) {
            this.keyValueHashTable.forIn(func);
        },

        /**
         * @override
         * @return {IKeyValueIterator.<K, V>}
         */
        iterator: function() {
            return this.keyValueHashTable.iterator();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        clear: function() {
            this.keyValueHashTable.clear();
            this.valueKeyHashTable.clear()
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
         * @return {number}
         */
        getCount: function() {
            return this.keyValueHashTable.getCount();
        },

        /**
         * @param {*} value
         * @return {K}
         */
        getKey: function(value) {
            return this.valueKeyHashTable.get(value);
        },

        /**
         * @param {*} key
         * @return {V} Returns undefined if no value is found.
         */
        getValue: function(key) {
            return this.keyValueHashTable.get(key);
        },

        /**
         * @return {boolean}
         */
        isEmpty: function() {
            return this.keyValueHashTable.isEmpty();
        },

        /**
         * @param {K} key
         * @param {V} value
         * @return {V}
         */
        put: function(key, value) {
            var currentKey = this.valueKeyHashTable.put(value, key);
            if (currentKey && !Obj.equals(currentKey, key)) {
                this.keyValueHashTable.remove(currentKey);
            }
            return this.keyValueHashTable.put(key, value);
        },

        /**
         * @param {(IKeyValueIterable.<K, V> | Object.<K, V>)} map
         */
        putAll: function(map) {
            var _this = this;
            if (Class.doesImplement(map, IKeyValueIterable)) {
                map.forIn(function(key, value) {
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
        removeByKey: function(key) {
            var value = this.keyValueHashTable.remove(key);
            if (!TypeUtil.isUndefined(value)) {
                this.valueKeyHashTable.remove(value);
            }
            return value;
        },

        /**
         * @param {*} value
         * @return {K}
         */
        removeByValue: function(value) {
            var key = this.valueKeyHashTable.remove(value);
            if (!TypeUtil.isUndefined(key)) {
                this.keyValueHashTable.remove(key);
            }
            return key;
        },

        /**
         * @return {Array.<K>}
         */
        toKeyArray: function() {
            return this.keyValueHashTable.toKeyArray();
        },

        /**
         * @return {ICollection.<K>}
         */
        toKeyCollection: function() {
            var keyCollection = new Collection();
            this.valueKeyHashTable.forEach(function(key) {
                keyCollection.add(key);
            });
            return keyCollection;
        },

        /**
         * @return {Array.<V>}
         */
        toValueArray: function() {
            return this.keyValueHashTable.toValueArray();
        },

        /**
         * @return {ICollection.<V>}
         */
        toValueCollection: function() {
            var valueCollection = new Collection();
            this.keyValueHashTable.forEach(function(value) {
                valueCollection.add(value);
            });
            return valueCollection;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('BidiMap', BidiMap);
});
