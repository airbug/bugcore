/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('HashTableNode')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @template K, V
     */
    var HashTableNode = Class.extend(Obj, {

        _name: "HashTableNode",


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
            this.count = 0;

            /**
             * @private
             * @type {Array.<K>}
             */
            this.hashTableKeyArray = [];

            /**
             * @private
             * @type {Array.<V>}
             */
            this.hashTableValueArray = [];
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
         * @return {Array.<K>}
         */
        getHashTableKeyArray: function() {
            return this.hashTableKeyArray;
        },

        /**
         * @return {Array.<V>}
         */
        getHashTableValueArray: function() {
            return this.hashTableValueArray;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Array.<K>}
         */
        getKeyArray: function() {
            return this.hashTableKeyArray;
        },

        /**
         * @return {Array.<V>}
         */
        getValueArray: function() {
            return this.hashTableValueArray;
        },


        //-------------------------------------------------------------------------------
        // Object Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        toString: function() {
            var output = "{";
            output += "  count:" + this.getCount() + ",\n";
            output += "  hashTableKeyArray:[\n";
            this.hashTableKeyArray.forEach(function(value) {
                output += value.toString() + ",";
            });
            output += "  ]";
            output += "  hashTableValueArray:[\n";
            this.hashTableValueArray.forEach(function(value) {
                output += value.toString() + ",";
            });
            output += "  ]";
            output += "}";
            return output;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} key
         * @return {boolean}
         */
        containsKey: function(key) {
            for (var i = 0, size = this.hashTableKeyArray.length; i < size; i++) {
                var hashTableKey = this.hashTableKeyArray[i];
                if (Obj.equals(key, hashTableKey)) {
                    return true;
                }
            }
            return false;
        },

        /**
         * @param {*} value
         * @return {boolean}
         */
        containsValue: function(value) {
            for (var i = 0, size = this.hashTableValueArray.length; i < size; i++) {
                var hashTableValue = this.hashTableValueArray[i];
                if (Obj.equals(value, hashTableValue)) {
                    return true;
                }
            }
            return false;
        },

        /**
         * @param {*} key
         * @return {V}
         */
        get: function(key) {
            for (var i = 0, size = this.hashTableKeyArray.length; i < size; i++) {
                var hashTableKey = this.hashTableKeyArray[i];
                if (Obj.equals(key, hashTableKey)) {
                    return this.hashTableValueArray[i];
                }
            }
            return undefined;
        },

        /**
         * @param {K} key
         * @param {V} value
         * @return {V}
         */
        put: function(key, value) {
            for (var i = 0, size = this.hashTableKeyArray.length; i < size; i++) {
                var hashTableKey = this.hashTableKeyArray[i];
                if (Obj.equals(key, hashTableKey)) {
                    var previousValue = this.hashTableValueArray[i];
                    this.hashTableValueArray[i] = value;
                    return previousValue;
                }
            }

            //NOTE BRN: If we make it to here it means we did not find a hash table entry that already exists for this key.

            this.hashTableKeyArray.push(key);
            this.hashTableValueArray.push(value);
            this.count++;
            return undefined;
        },

        /**
         * @param {*} key
         * @return {V}
         */
        remove: function(key) {
            for (var i = 0, size = this.hashTableKeyArray.length; i < size; i++) {
                var hashTableKey = this.hashTableKeyArray[i];
                if (Obj.equals(key, hashTableKey)) {
                    var removedValue = this.hashTableValueArray[i];
                    this.hashTableKeyArray.splice(i, 1);
                    this.hashTableValueArray.splice(i, 1);
                    this.count--;
                    return removedValue;
                }
            }
            return undefined;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('HashTableNode', HashTableNode);
});
