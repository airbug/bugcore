/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
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
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

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

    /**
     * Map info
     * 1) Supports null values but not undefined values. Undefined values are used to indicate something doesn't exist.
     * 2) Any value can be used as a key including null but not undefined.
     * 3) Unlinke the BidiMap, this map can have multiple entries for the same value. When looking up by value, a Collection
     *      of keys will be returned
     *
     * @class
     * @extends {Obj}
     */
    var DualMap = Class.extend(Obj, {

        _name: 'DualMap',


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
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
        // Obj Methods
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
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        clear: function() {
            this.keyValueHashTable.clear();
            this.valueKeyCollectionHashTable.clear();
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
            var keys = null;
            if (Class.doesExtend(map, Map)) {
                keys = map.toKeyArray();
                keys.forEach(function(key) {
                    var value = map.get(key);
                    this.put(key, value);
                });
            } else if (Class.doesExtend(map, DualMap)) {
                keys = map.toKeyArray();
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
        },

        /**
         * @return {Array<*>}
         */
        toKeyArray: function() {
            return this.keyValueHashTable.toKeyArray();
        },

        /**
         * @return {Collection.<*>}
         */
        toKeyCollection: function() {
            return new Collection(this.keyValueHashTable.toKeyArray());
        },

        /**
         * @return {Array.<*>}
         */
        toValueArray: function() {
            return this.keyValueHashTable.toValueArray();
        },

        /**
         * @return {Collection.<*>}
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

    bugpack.export('DualMap', DualMap);
});
