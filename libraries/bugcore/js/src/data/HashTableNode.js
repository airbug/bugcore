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
//@Require('NotifyingArray')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Obj             = bugpack.require('Obj');
    var NotifyingArray    = bugpack.require('NotifyingArray');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @template K, V
     */
    var HashTableNode = Class.extend(Obj, {

        _name: 'HashTableNode',


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
             * @type {NotifyingArray.<K>}
             */
            this.keyNotifyingArray    = new NotifyingArray([]);

            /**
             * @private
             * @type {NotifyingArray.<V>}
             */
            this.valueNotifyingArray  = new NotifyingArray([]);
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
         * @return {NotifyingArray.<K>}
         */
        getKeyNotifyingArray: function() {
            return this.keyNotifyingArray;
        },

        /**
         * @return {NotifyingArray.<V>}
         */
        getValueNotifyingArray: function() {
            return this.valueNotifyingArray;
        },


        //-------------------------------------------------------------------------------
        // Object Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        toString: function() {
            var output = '{';
            output += '  count:' + this.getCount() + ',\n';
            output += '  keyArray:[\n';
            this.keyNotifyingArray.forEach(function(value) {
                output += value.toString() + ',';
            });
            output += '  ]';
            output += '  valueArray:[\n';
            this.valueNotifyingArray.forEach(function(value) {
                output += value.toString() + ',';
            });
            output += '  ]';
            output += '}';
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
            for (var i = 0, size = this.keyNotifyingArray.getLength(); i < size; i++) {
                var hashTableKey = this.keyNotifyingArray.getAt(i);
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
            for (var i = 0, size = this.valueNotifyingArray.getLength(); i < size; i++) {
                var hashTableValue = this.valueNotifyingArray.getAt(i);
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
            for (var i = 0, size = this.keyNotifyingArray.getLength(); i < size; i++) {
                var hashTableKey = this.keyNotifyingArray.getAt(i);
                if (Obj.equals(key, hashTableKey)) {
                    return this.valueNotifyingArray.getAt(i);
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
            for (var i = 0, size = this.keyNotifyingArray.getLength(); i < size; i++) {
                var hashTableKey = this.keyNotifyingArray.getAt(i);
                if (Obj.equals(key, hashTableKey)) {
                    var previousValue = this.valueNotifyingArray.getAt(i);
                    this.valueNotifyingArray.setAt(i, value);
                    return previousValue;
                }
            }

            //NOTE BRN: If we make it to here it means we did not find a hash table entry that already exists for this key.

            this.keyNotifyingArray.push(key);
            this.valueNotifyingArray.push(value);
            this.count++;
            return undefined;
        },

        /**
         * @param {*} key
         * @return {V}
         */
        remove: function(key) {
            for (var i = 0, size = this.keyNotifyingArray.getLength(); i < size; i++) {
                var hashTableKey = this.keyNotifyingArray.getAt(i);
                if (Obj.equals(key, hashTableKey)) {
                    var removedValue = this.valueNotifyingArray.getAt(i);
                    this.keyNotifyingArray.splice(i, 1);
                    this.valueNotifyingArray.splice(i, 1);
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
