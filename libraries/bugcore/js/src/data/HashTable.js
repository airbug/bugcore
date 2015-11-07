/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('HashTable')

//@Require('Class')
//@Require('Exception')
//@Require('HashTableIterator')
//@Require('HashTableNode')
//@Require('IKeyValueIterable')
//@Require('Obj')
//@Require('ReflectObject')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Exception           = bugpack.require('Exception');
    var HashTableIterator   = bugpack.require('HashTableIterator');
    var HashTableNode       = bugpack.require('HashTableNode');
    var IKeyValueIterable   = bugpack.require('IKeyValueIterable');
    var Obj                 = bugpack.require('Obj');
    var ReflectObject       = bugpack.require('ReflectObject');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IKeyValueIterable.<K, V>}
     * @template K, V
     */
    var HashTable = Class.extend(Obj, {

        _name: "HashTable",


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
             * @type {number}
             */
            this.count                          = 0;

            /**
             * @private
             * @type {ReflectObject.<HashTableNode.<K, V>>}
             */
            this.hashTableNodeReflectObject     = new ReflectObject({});
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {number}
         */
        getCount: function() {
            return this.count;
        },

        /**
         * @return {ReflectObject.<string, HashTableNode.<K, V>>}
         */
        getHashTableNodeReflectObject: function() {
            return this.hashTableNodeReflectObject;
        },


        //-------------------------------------------------------------------------------
        // IKeyValueIterable Implementation
        //-------------------------------------------------------------------------------

        /**
         * NOTE BRN: If a value in the HashTable is modified in one iteration and then visited at a later time, its value in the loop is
         * its value at that later time. A value that is deleted before it has been visited will not be visited later.
         * Values added to the HashTable over which iteration is occurring may either be visited or omitted from iteration.
         *
         * @param {function(V, K)} func
         */
        forEach: function(func) {
            var iterator = this.iterator();
            while (iterator.hasNext()) {
                var nextKey = iterator.nextKey();
                var nextValue = this.get(nextKey);
                func(nextValue, nextKey);
            }
        },

        /**
         * NOTE BRN: If a value in the HashTable is modified in one iteration and then visited at a later time, its value in the loop is
         * its value at that later time. A value that is deleted before it has been visited will not be visited later.
         * Values added to the HashTable over which iteration is occurring may either be visited or omitted from iteration.
         *
         * @param {function(K, V)} func
         */
        forIn: function(func) {
            var iterator = this.iterator();
            while (iterator.hasNext()) {
                var nextKey = iterator.nextKey();
                var nextValue = this.get(nextKey);
                func(nextKey, nextValue);
            }
        },

        /**
         * NOTE BRN: If a value is modified in one iteration and then visited at a later time, its value in the loop is
         * its value at that later time. A value that is deleted before it has been visited will not be visited later.
         * Values added to the Collection over which iteration is occurring may either be visited or omitted from iteration.
         *
         * @return {IKeyValueIterator.<K, V>}
         */
        iterator: function() {
            return new HashTableIterator(this);
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        clear: function() {
            var _this = this;
            this.forIn(function(key) {
                _this.remove(key);
            });
        },

        /**
         * @param {*} key
         * @return {boolean}
         */
        containsKey: function(key) {
            var keyHashCode = Obj.hashCode(key).toString();
            var hashTableNode = this.hashTableNodeReflectObject.getProperty(keyHashCode);
            if (hashTableNode) {
                return hashTableNode.containsKey(key);
            }
            return false;
        },

        /**
         * @param {*} value
         * @return {boolean}
         */
        containsValue: function(value) {
            var valueFound = false;
            try {
                this.hashTableNodeReflectObject.forIn(function(keyHashCode, hashTableNode) {
                    if (hashTableNode.containsValue(value)) {
                        valueFound = true;
                        throw new Exception("BreakException");
                    }
                });
            } catch(e) {
                if (!Class.doesExtend(e, Exception) || e.getType() !== "BreakException") {
                    throw e;
                }
            }
            return valueFound;
        },

        /**
         * @param {K} key
         * @return {V}
         */
        get: function(key) {
            var keyHashCode = Obj.hashCode(key).toString();
            var hashTableNode = this.hashTableNodeReflectObject.getProperty(keyHashCode);
            if (hashTableNode) {
                return hashTableNode.get(key);
            }
            return undefined;
        },

        /**
         * @return {boolean}
         */
        isEmpty: function() {
            return (this.count === 0);
        },

        /**
         * @param {K} key
         * @param {V} value
         * @return {V} Returns undefined if no value already existed at this key
         */
        put: function(key, value) {
            var keyHashCode = Obj.hashCode(key).toString();
            var hashTableNode = this.hashTableNodeReflectObject.getProperty(keyHashCode);
            if (!hashTableNode) {
                hashTableNode = new HashTableNode();
                this.hashTableNodeReflectObject.setProperty(keyHashCode, hashTableNode);
            }
            var returnValue = hashTableNode.put(key, value);
            if (returnValue === undefined) {
                this.count++;
            }
            return returnValue;
        },

        /**
         * @param {*} key
         * @return {V} Returns undefined if no value already existed at this key
         */
        remove: function(key) {
            var keyHashCode     = Obj.hashCode(key).toString();
            var hashTableNode   = this.hashTableNodeReflectObject.getProperty(keyHashCode);
            var returnValue     = undefined;
            if (hashTableNode) {
                returnValue = hashTableNode.remove(key);
                if (returnValue !== undefined) {
                    this.count--;
                    if (hashTableNode.getCount() === 0) {
                        this.hashTableNodeReflectObject.deleteProperty(keyHashCode);
                    }
                }
            }
            return returnValue;
        },

        /**
         * @return {Array.<K>}
         */
        toKeyArray: function() {
            var keysArray = [];
            this.hashTableNodeReflectObject.forIn(function(keyHashCode, hashTableNode) {
                keysArray = keysArray.concat(hashTableNode.getKeyReflectArray().getArray());
            });
            return keysArray;
        },

        /**
         * @return {Array.<V>}
         */
        toValueArray: function() {
            var valuesArray = [];
            this.hashTableNodeReflectObject.forIn(function(keyHashCode, hashTableNode) {
                valuesArray = valuesArray.concat(hashTableNode.getValueReflectArray().getArray());
            });
            return valuesArray;
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(HashTable, IKeyValueIterable);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('HashTable', HashTable);
});
