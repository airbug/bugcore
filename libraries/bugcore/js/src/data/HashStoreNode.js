/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('HashStoreNode')

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
     * @template I
     */
    var HashStoreNode = Class.extend(Obj, {

        _name: 'HashStoreNode',


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
             * @type {NotifyingArray.<I>}
             */
            this.itemNotifyingArray   = new NotifyingArray([]);
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
         * @return {NotifyingArray.<I>}
         */
        getItemNotifyingArray: function() {
            return this.itemNotifyingArray;
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} value
         * @return {boolean}
         */
        equals: function(value) {
            if (Class.doesExtend(value, HashStoreNode)) {
                if (this.getCount() === value.getCount()) {
                    for (var i = 0, size = this.itemNotifyingArray.getLength(); i < size; i++) {
                        var itemArrayValue = this.itemNotifyingArray.getAt(i);
                        if (!value.containsValue(itemArrayValue)) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            return false;
        },

        /**
         * @return {string}
         */
        toString: function() {
            var output = '{';
            output += '  count:' + this.getCount() + ',\n';
            output += '  values:[\n';
            this.itemNotifyingArray.forEach(function(item) {
                output += item + ',';
            });
            output += '  ]';
            output += '}';
            return output;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {I} item
         */
        add: function(item) {
            this.itemNotifyingArray.push(item);
            this.count++;
        },

        /**
         * @param {*} item
         */
        contains: function(item) {
            for (var i = 0, size = this.itemNotifyingArray.getLength(); i < size; i++) {
                var itemArrayValue = this.itemNotifyingArray.getAt(i);
                if (Obj.equals(item, itemArrayValue)) {
                    return true;
                }
            }
            return false;
        },

        /**
         * @param {*} value
         * @return {number}
         */
        countValue: function(value) {
            var count = 0;
            for (var i = 0, size = this.itemNotifyingArray.getLength(); i < size; i++) {
                var itemArrayValue = this.itemNotifyingArray.getAt(i);
                if (Obj.equals(value, itemArrayValue)) {
                    count++;
                }
            }
            return count;
        },

        /**
         * @param {*} item
         * @return {boolean}
         */
        remove: function(item) {
            for (var i = 0, size = this.itemNotifyingArray.getLength(); i < size; i++) {
                var itemArrayValue = this.itemNotifyingArray.getAt(i);
                if (Obj.equals(item, itemArrayValue)) {
                    this.itemNotifyingArray.splice(i, 1);
                    this.count--;
                    return true;
                }
            }
            return false;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('HashStoreNode', HashStoreNode);
});
