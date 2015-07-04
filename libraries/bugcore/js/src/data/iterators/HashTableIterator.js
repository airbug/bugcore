/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('HashTableIterator')

//@Require('ArrayIterator')
//@Require('Class')
//@Require('Exception')
//@Require('IKeyValueIterator')
//@Require('Obj')
//@Require('ObjectIterator')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArrayIterator           = bugpack.require('ArrayIterator');
    var Class                   = bugpack.require('Class');
    var Exception               = bugpack.require('Exception');
    var IKeyValueIterator       = bugpack.require('IKeyValueIterator');
    var Obj                     = bugpack.require('Obj');
    var ObjectIterator          = bugpack.require('ObjectIterator');


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
            this.hashTable                      = hashTable;

            /**
             * @private
             * @type {ObjectIterator.<HashTableNode.<K, V>>}
             */
            this.hashTableNodeObjectIterator    = new ObjectIterator(this.hashTable.getHashTableNodeObject());

            /**
             * @private
             * @type {ArrayIterator.<K>}
             */
            this.hashTableKeyArrayIterator      = null;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        hasNext: function() {
            if (this.hashTableNodeObjectIterator.hasNext()) {
                return true;
            }
            if (this.hashTableKeyArrayIterator) {
                return this.hashTableKeyArrayIterator.hasNext()
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
            if (!this.hashTableKeyArrayIterator) {
                var hashTableNodeObject = this.hashTableNodeObjectIterator.next();
                this.hashTableKeyArrayIterator = new ArrayIterator(hashTableNodeObject.getKeyArray());
                return this.hashTableKeyArrayIterator.next();
            } else {
                if (!this.hashTableKeyArrayIterator.hasNext()) {
                    this.hashTableKeyArrayIterator = null;
                    return this.next();
                } else {
                    return this.hashTableKeyArrayIterator.next();
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
            var value   = this.object[key];
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
