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
//@Require('IIndexValueIterable')
//@Require('Obj')
//@Require('ReflectArray')
//@Require('ReflectArrayIterator')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Collection              = bugpack.require('Collection');
    var Exception               = bugpack.require('Exception');
    var IIndexValueIterable     = bugpack.require('IIndexValueIterable');
    var Obj                     = bugpack.require('Obj');
    var ReflectArray            = bugpack.require('ReflectArray');
    var ReflectArrayIterator    = bugpack.require('ReflectArrayIterator');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Collection.<I>}
     * @implements {IIndexValueIterable.<I>}
     * @template I
     */
    var Queue = Class.extend(Collection, {

        _name: "Queue",


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
             * @type {ReflectArray.<I>}
             */
            this.itemReflectArray = new ReflectArray([]);
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {ReflectArray.<I>}
         */
        getItemReflectArray: function() {
            return this.itemReflectArray;
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Queue.<I>}
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
         * @param {I} item
         */
        add: function(item) {
            this._super(item);
            this.itemReflectArray.push(item);
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

        /**
         * @override
         * @return {Array.<I>}
         */
        toArray: function() {
            return Obj.clone(this.itemReflectArray.getArray());
        },


        //-------------------------------------------------------------------------------
        // IIndexValueIterable Implementation
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @param {function(I, number)} func
         */
        forEach: function(func) {
            var iterator = this.iterator();
            while (iterator.hasNext()) {
                var indexValuePair = iterator.nextIndexValuePair();
                func(indexValuePair.value, indexValuePair.index);
            }
        },

        /**
         * @param {function(number, I)} func
         */
        forIn: function(func) {
            var iterator = this.iterator();
            while (iterator.hasNext()) {
                var indexValuePair = iterator.nextIndexValuePair();
                func(indexValuePair.index, indexValuePair.value);
            }
        },

        /**
         * @override
         * @return {IIndexValueIterator.<I>}
         */
        iterator: function() {
            return new ReflectArrayIterator(this.itemReflectArray);
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {I}
         */
        dequeue: function() {
            if (this.getCount() > 0) {
                return this.removeAt(0);
            } else {
                throw new Exception("QueueEmpty", {}, "Queue is empty");
            }
        },

        /**
         * @param {I} item
         */
        enqueue: function(item) {
            this.add(item);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {number} index
         * @return {I}
         */
        getAt: function(index) {
            if (index < this.getCount()) {
                return this.itemReflectArray.getAt(index);
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
            for (var i = 0, size = this.itemReflectArray.getLength(); i < size; i++) {
                if (Obj.equals(this.itemReflectArray.getAt(i), value)) {
                    return i;
                }
            }
            return -1;
        },

        /**
         * @private
         * @param {number} index
         * @return {I} The removed value
         */
        removeAt: function(index) {
            var value = this.getAt(index);
            var result = this.getHashStore().remove(value);
            if (result) {
                this.itemReflectArray.splice(index, 1);
            }
            return value;
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(Queue, IIndexValueIterable);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Queue', Queue);
});
