/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('HashTableNode')

//@Require('Class')
//@Require('Obj')
//@Require('ReflectArray')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Obj             = bugpack.require('Obj');
    var ReflectArray    = bugpack.require('ReflectArray');


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
            this.count              = 0;

            /**
             * @private
             * @type {ReflectArray.<K>}
             */
            this.keyReflectArray    = new ReflectArray([]);

            /**
             * @private
             * @type {ReflectArray.<V>}
             */
            this.valueReflectArray  = new ReflectArray([]);
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
         * @return {ReflectArray.<K>}
         */
        getKeyReflectArray: function() {
            return this.keyReflectArray;
        },

        /**
         * @return {ReflectArray.<V>}
         */
        getValueReflectArray: function() {
            return this.valueReflectArray;
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
            this.keyReflectArray.forEach(function(value) {
                output += value.toString() + ",";
            });
            output += "  ]";
            output += "  valueArray:[\n";
            this.valueReflectArray.forEach(function(value) {
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
            for (var i = 0, size = this.keyReflectArray.getLength(); i < size; i++) {
                var hashTableKey = this.keyReflectArray.getAt(i);
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
            for (var i = 0, size = this.valueReflectArray.getLength(); i < size; i++) {
                var hashTableValue = this.valueReflectArray.getAt(i);
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
            for (var i = 0, size = this.keyReflectArray.getLength(); i < size; i++) {
                var hashTableKey = this.keyReflectArray.getAt(i);
                if (Obj.equals(key, hashTableKey)) {
                    return this.valueReflectArray.getAt(i);
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
            for (var i = 0, size = this.keyReflectArray.getLength(); i < size; i++) {
                var hashTableKey = this.keyReflectArray.getAt(i);
                if (Obj.equals(key, hashTableKey)) {
                    var previousValue = this.valueReflectArray.getAt(i);
                    this.valueReflectArray.setAt(i, value);
                    return previousValue;
                }
            }

            //NOTE BRN: If we make it to here it means we did not find a hash table entry that already exists for this key.

            this.keyReflectArray.push(key);
            this.valueReflectArray.push(value);
            this.count++;
            return undefined;
        },

        /**
         * @param {*} key
         * @return {V}
         */
        remove: function(key) {
            for (var i = 0, size = this.keyReflectArray.getLength(); i < size; i++) {
                var hashTableKey = this.keyReflectArray.getAt(i);
                if (Obj.equals(key, hashTableKey)) {
                    var removedValue = this.valueReflectArray.getAt(i);
                    this.keyReflectArray.splice(i, 1);
                    this.valueReflectArray.splice(i, 1);
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
