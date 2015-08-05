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
            this.count      = 0;

            /**
             * @private
             * @type {Array.<K>}
             */
            this.keyArray   = [];

            /**
             * @private
             * @type {Array.<V>}
             */
            this.valueArray = [];
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
        getKeyArray: function() {
            return this.keyArray;
        },

        /**
         * @return {Array.<V>}
         */
        getValueArray: function() {
            return this.valueArray;
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
            output += "  keyArray:[\n";
            this.keyArray.forEach(function(value) {
                output += value.toString() + ",";
            });
            output += "  ]";
            output += "  valueArray:[\n";
            this.valueArray.forEach(function(value) {
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
            for (var i = 0, size = this.keyArray.length; i < size; i++) {
                var hashTableKey = this.keyArray[i];
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
            for (var i = 0, size = this.valueArray.length; i < size; i++) {
                var hashTableValue = this.valueArray[i];
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
            for (var i = 0, size = this.keyArray.length; i < size; i++) {
                var hashTableKey = this.keyArray[i];
                if (Obj.equals(key, hashTableKey)) {
                    return this.valueArray[i];
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
            for (var i = 0, size = this.keyArray.length; i < size; i++) {
                var hashTableKey = this.keyArray[i];
                if (Obj.equals(key, hashTableKey)) {
                    var previousValue = this.valueArray[i];
                    this.valueArray[i] = value;
                    return previousValue;
                }
            }

            //NOTE BRN: If we make it to here it means we did not find a hash table entry that already exists for this key.

            this.keyArray.push(key);
            this.valueArray.push(value);
            this.count++;
            return undefined;
        },

        /**
         * @param {*} key
         * @return {V}
         */
        remove: function(key) {
            for (var i = 0, size = this.keyArray.length; i < size; i++) {
                var hashTableKey = this.keyArray[i];
                if (Obj.equals(key, hashTableKey)) {
                    var removedValue = this.valueArray[i];
                    this.keyArray.splice(i, 1);
                    this.valueArray.splice(i, 1);
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
