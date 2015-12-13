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
//@Require('IKeyValueIterator')
//@Require('NotifyingArrayIterator')
//@Require('NotifyingObjectIterator')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var IKeyValueIterator           = bugpack.require('IKeyValueIterator');
    var NotifyingArrayIterator      = bugpack.require('NotifyingArrayIterator');
    var NotifyingObjectIterator     = bugpack.require('NotifyingObjectIterator');
    var Obj                         = bugpack.require('Obj');


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

        _name: 'HashTableIterator',


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
             * @type {NotifyingObjectIterator.<HashTableNode.<K, V>>}
             */
            this.hashTableNodeNotifyingObjectIterator     = new NotifyingObjectIterator(this.hashTable.getHashTableNodeNotifyingObject());

            /**
             * @private
             * @type {NotifyingArrayIterator.<K>}
             */
            this.hashTableKeyNotifyingArrayIterator       = null;
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
         * @return {NotifyingObjectIterator.<HashTableNode.<K, V>>}
         */
        getHashTableNodeNotifyingObjectIterator: function() {
            return this.hashTableNodeNotifyingObjectIterator;
        },

        /**
         * @return {NotifyingArrayIterator.<K>}
         */
        getHashTableKeyNotifyingArrayIterator: function() {
            return this.hashTableKeyNotifyingArrayIterator;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        hasNext: function() {
            if (this.hashTableNodeNotifyingObjectIterator.hasNext()) {
                return true;
            }
            if (this.hashTableKeyNotifyingArrayIterator) {
                return this.hashTableKeyNotifyingArrayIterator.hasNext();
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
            if (!this.hashTableKeyNotifyingArrayIterator) {
                var hashTableNode = this.hashTableNodeNotifyingObjectIterator.next();
                this.hashTableKeyNotifyingArrayIterator = new NotifyingArrayIterator(hashTableNode.getKeyNotifyingArray());
                return this.hashTableKeyNotifyingArrayIterator.next();
            } else {
                if (!this.hashTableKeyNotifyingArrayIterator.hasNext()) {
                    this.hashTableKeyNotifyingArrayIterator = null;
                    return this.nextKey();
                } else {
                    return this.hashTableKeyNotifyingArrayIterator.next();
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
