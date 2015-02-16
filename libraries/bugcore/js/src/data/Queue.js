/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Queue')

//@Require('Class')
//@Require('Collection')
//@Require('Exception')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Collection  = bugpack.require('Collection');
    var Exception   = bugpack.require('Exception');
    var Obj         = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Collection}
     */
    var Queue = Class.extend(Collection, {

        _name: "Queue",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {(Collection.<*> | Array.<*>)} items
         */
        _constructor: function(items) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Array.<*>}
             */
            this.valueArray = [];
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @return {Array} Array is in the same order as the queue
         */
        getValueArray: function() {
            var valueArray = [];
            for (var i = 0, size = this.valueArray.length; i < size; i++) {
                valueArray.push(this.valueArray[i]);
            }
            return valueArray;
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Queue}
         */
        clone: function() {
            var cloneQueue = new Queue();
            cloneQueue.addAll(this);
            return cloneQueue;
        },


        //-------------------------------------------------------------------------------
        // Collection Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} value
         */
        add: function(value) {
            this._super(value);
            this.valueArray.push(value);
        },

        /**
         *
         */
        clear: function() {
            this._super();
            this.valueArray = [];
        },

        /**
         * @override
         * @param {function(*)} func
         */
        forEach: function(func) {
            for (var i = 0, size = this.valueArray.length; i < size; i++) {
                func(this.valueArray[i]);
            }
        },

        /**
         * Removes the FIRST occurrence of value from the queue
         * @override
         * @param {*} value
         * @return {boolean}
         */
        remove: function(value) {
            if (this.contains(value)) {
                var index = this.indexOfFirst(value);
                this.removeAt(index);
                return true;
            }
            return false;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {*}
         */
        dequeue: function() {
            if (this.getCount() > 0) {
                return this.removeAt(0);
            } else {
                throw new Exception("QueueEmpty", {}, "Queue is empty");
            }
        },

        /**
         * @param {*} value
         */
        enqueue: function(value) {
            this.add(value);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {number} index
         * @return {*}
         */
        getAt: function(index) {
            if (index < this.getCount()) {
                return this.valueArray[index];
            } else {
                throw new Exception("IndexOutOfBounds", {}, "Index out of bounds");
            }
        },

        /**
         * @private
         * @param {*} value
         * @return {number}
         */
        indexOfFirst: function(value) {
            for (var i = 0, size = this.valueArray.length; i < size; i++) {
                if (Obj.equals(this.valueArray[i], value)) {
                    return i;
                }
            }
            return -1;
        },

        /**
         * @private
         * @param {number} index
         * @return {*} The removed value
         */
        removeAt: function(index) {
            var value = this.getAt(index);
            var result = this.getHashStore().removeValue(value);
            if (result) {
                this.valueArray.splice(index, 1);
            }
            return value;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Queue', Queue);
});
