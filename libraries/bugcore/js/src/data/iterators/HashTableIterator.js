/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('HashTableIterator')

//@Require('Class')
//@Require('Exception')
//@Require('IKeyValueIterator')
//@Require('Obj')
//@Require('ReflectArrayIterator')
//@Require('ReflectObjectIterator')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Exception               = bugpack.require('Exception');
    var IKeyValueIterator       = bugpack.require('IKeyValueIterator');
    var Obj                     = bugpack.require('Obj');
    var ReflectArrayIterator    = bugpack.require('ReflectArrayIterator');
    var ReflectObjectIterator   = bugpack.require('ReflectObjectIterator');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IKeyValueIterator.<K, V>}
     * @template K, V
     */
    var HashTableIterator = Class.extend(Obj, {

        _name: "HashTableIterator",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {HashTable.<K, V>} hashTable
         */
        _constructor: function(hashTable) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {HashTable.<K, V>}
             */
            this.hashTable                              = hashTable;

            /**
             * @private
             * @type {ReflectObjectIterator.<HashTableNode.<K, V>>}
             */
            this.hashTableNodeReflectObjectIterator     = new ReflectObjectIterator(this.hashTable.getHashTableNodeReflectObject());

            /**
             * @private
             * @type {ReflectArrayIterator.<K>}
             */
            this.hashTableKeyReflectArrayIterator       = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {HashTable.<K, V>}
         */
        getHashTable: function() {
            return this.hashTable;
        },

        /**
         * @return {ReflectObjectIterator.<HashTableNode.<K, V>>}
         */
        getHashTableNodeReflectObjectIterator: function() {
            return this.hashTableNodeReflectObjectIterator;
        },

        /**
         * @return {ReflectArrayIterator.<K>}
         */
        getHashTableKeyReflectArrayIterator: function() {
            return this.hashTableKeyReflectArrayIterator;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        hasNext: function() {
            if (this.hashTableNodeReflectObjectIterator.hasNext()) {
                return true;
            }
            if (this.hashTableKeyReflectArrayIterator) {
                return this.hashTableKeyReflectArrayIterator.hasNext()
            }
            return false;
        },

        /**
         * @return {V}
         */
        next: function() {
            var key = this.nextKey();
            return this.hashTable.get(key);
        },

        /**
         * @return {K}
         */
        nextKey: function() {
            if (!this.hashTableKeyReflectArrayIterator) {
                var hashTableNode = this.hashTableNodeReflectObjectIterator.next();
                this.hashTableKeyReflectArrayIterator = new ReflectArrayIterator(hashTableNode.getKeyReflectArray());
                return this.hashTableKeyReflectArrayIterator.next();
            } else {
                if (!this.hashTableKeyReflectArrayIterator.hasNext()) {
                    this.hashTableKeyReflectArrayIterator = null;
                    return this.nextKey();
                } else {
                    return this.hashTableKeyReflectArrayIterator.next();
                }
            }
        },

        /**
         * @return {{
         *      key: K,
         *      value: V
         * }}
         */
        nextKeyValuePair: function() {
            var key     = this.nextKey();
            var value   = this.hashTable.get(key);
            return {
                key: key,
                value: value
            };
        },

        /**
         * @return {V}
         */
        nextValue: function() {
            return this.next();
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(HashTableIterator, IKeyValueIterator);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('HashTableIterator', HashTableIterator);
});
