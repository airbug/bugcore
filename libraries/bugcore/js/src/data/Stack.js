/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Stack')

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
     * @extends {Collection}
     * @template I
     */
    var Stack = Class.extend(Collection, {

        _name: "Stack",


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
         * @return {ReflectArray.<I>} Array is in the same order as the queue
         */
        getItemReflectArray: function() {
            return this.itemReflectArray;
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean=} deep
         * @return {Stack}
         */
        clone: function(deep) {
            var cloneStack = new Stack();
            if (deep) {
                this.forEach(function(item){
                    cloneStack.add(Obj.clone(item, true));
                });
            } else {
                cloneStack.addAll(this);
            }
            return cloneStack;
        },


        //-------------------------------------------------------------------------------
        // Collection Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {I} value
         * @return {boolean}
         */
        add: function(value) {
            this._super(value);
            this.itemReflectArray.push(value);
            return true;
        },

        /**
         * Removes the FIRST occurrence of value from the stack
         * @param {*} value
         * @return {boolean}
         */
        remove: function(value) {
            if (this.contains(value)) {
                var index = this.indexOfLast(value);
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
        pop: function() {
            var lastIndex = this.getCount() - 1;
            if (lastIndex > -1) {
                return this.removeAt(lastIndex);
            } else {
                throw new Exception("StackEmpty", {}, "No elements left to pop");
            }
        },

        /**
         * @param {I} item
         */
        push: function(item) {
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
        indexOfLast: function(value) {
            for (var i = this.itemReflectArray.getLength() - 1; i >= 0; i--) {
                if (Obj.equals(this.itemReflectArray.getAt(i), value)) {
                    return i;
                }
            }
            return -1;
        },

        /**
         * @private
         * @param {number} index
         * @return {I} The removed item
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

    Class.implement(Stack, IIndexValueIterable);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Stack', Stack);
});
