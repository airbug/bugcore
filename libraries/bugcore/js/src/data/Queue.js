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
//@Require('NotifyingArray')
//@Require('NotifyingArrayIterator')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Collection              = bugpack.require('Collection');
    var Exception               = bugpack.require('Exception');
    var IIndexValueIterable     = bugpack.require('IIndexValueIterable');
    var NotifyingArray          = bugpack.require('NotifyingArray');
    var NotifyingArrayIterator  = bugpack.require('NotifyingArrayIterator');
    var Obj                     = bugpack.require('Obj');


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

        _name: 'Queue',


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
             * @type {NotifyingArray.<I>}
             */
            this.itemNotifyingArray = new NotifyingArray([]);
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

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
            this.itemNotifyingArray.push(item);
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
            return Obj.clone(this.itemNotifyingArray.getArray());
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
            return new NotifyingArrayIterator(this.itemNotifyingArray);
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
                throw new Exception('QueueEmpty', {}, 'Queue is empty');
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
                return this.itemNotifyingArray.getAt(index);
            } else {
                throw new Exception('IndexOutOfBounds', {}, 'Index out of bounds');
            }
        },

        /**
         * @private
         * @param {*} value
         * @return {number}
         */
        indexOfFirst: function(value) {
            for (var i = 0, size = this.itemNotifyingArray.getLength(); i < size; i++) {
                if (Obj.equals(this.itemNotifyingArray.getAt(i), value)) {
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
                this.itemNotifyingArray.splice(index, 1);
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
