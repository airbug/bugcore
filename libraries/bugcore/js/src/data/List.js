/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('List')

//@Require('ArgumentBug')
//@Require('ArrayIterator')
//@Require('Class')
//@Require('Collection')
//@Require('Exception')
//@Require('ICollection')
//@Require('IIndexValueIterable')
//@Require('IList')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgumentBug             = bugpack.require('ArgumentBug');
    var ArrayIterator           = bugpack.require('ArrayIterator');
    var Class                   = bugpack.require('Class');
    var Collection              = bugpack.require('Collection');
    var Exception               = bugpack.require('Exception');
    var ICollection             = bugpack.require('ICollection');
    var IIndexValueIterable     = bugpack.require('IIndexValueIterable');
    var IList                   = bugpack.require('IList');
    var Obj                     = bugpack.require('Obj');
    var TypeUtil                = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Collection.<I>}
     * @implements {IIndexValueIterable.<I>}
     * @implements {IList.<I>}
     * @template I
     */
    var List = Class.extend(Collection, {

        _name: "List",


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
             * @type {Array.<I>}
             */
            this.itemArray = [];
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Array.<I>} Array is in the same order as the list
         */
        getItemArray: function() {
            return this.itemArray;
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean=} deep
         * @return {List.<I>}
         */
        clone: function(deep) {
            var cloneList = new List();
            if (deep) {
                this.forEach(function(item){
                    cloneList.add(Obj.clone(item, true));
                });
            } else {
                cloneList.addAll(this);
            }
            return cloneList;
        },


        //-------------------------------------------------------------------------------
        // Collection Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {I} item
         * @return {boolean}
         */
        add: function(item) {
            this._super(item);
            this.itemArray.push(item);
            return true;
        },

        /**
         * Removes the FIRST occurrence of value from the list
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
         * @return {Array.<>}
         */
        toArray: function() {
            return Obj.clone(this.itemArray);
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
         * @return {IIndexValueIterator.<V>}
         */
        iterator: function() {
            return new ArrayIterator(this.itemArray);
        },


        //-------------------------------------------------------------------------------
        // IList Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {number} index
         * @param {I} item
         */
        addAt: function(index, item) {

            // NOTE BRN: The index can be less than OR EQUAL TO the count. If equal to the count, we are adding values to
            // the very end of the list.

            if (index <= this.getCount()) {
                this.getHashStore().add(item);
                this.itemArray.splice(index, 0, item);
            } else {
                throw new Exception("IndexOutOfBounds", {}, "index was out of bounds");
            }
        },

        /**
         * @param {number} index
         * @param {(ICollection.<I> | Array.<*>)} items
         */
        addAllAt: function(index, items) {
            if (Class.doesImplement(items, ICollection) || TypeUtil.isArray(items)) {
                var insertingIndex = index;
                var _this = this;
                items.forEach(function(value) {
                    _this.addAt(insertingIndex, value);

                    // NOTE BRN: We increment the inserting index so that the collection is inserted in the correct order.

                    insertingIndex++;
                });
            } else {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "items", items, "parameter must either implement ICollection or be an Array");
            }
        },

        /**
         * @param {number} index
         * @return {I}
         */
        getAt: function(index) {
            if (index < this.getCount()) {
                return this.itemArray[index];
            } else {
                throw new Exception("IndexOutOfBounds", {}, "index was out of bounds");
            }
        },

        /**
         * @param {*} value
         * @return {number}
         */
        indexOfFirst: function(value) {
            for (var i = 0, size = this.itemArray.length; i < size; i++) {
                if (Obj.equals(this.itemArray[i], value)) {
                    return i;
                }
            }
            return -1;
        },

        /**
         * @param {*} value
         * @return {number}
         */
        indexOfLast: function(value) {
            for (var size = this.itemArray.length, i = size - 1; i >= 0; i--) {
                if (Obj.equals(this.itemArray[i], value)) {
                    return i;
                }
            }
            return -1;
        },

        /**
         * @return {I} The removed item
         */
        pop: function() {
            var lastIndex = this.itemArray.length - 1;
            return this.removeAt(lastIndex);
        },

        /**
         * @param {I} item
         */
        prepend: function(item) {
            this.addAt(0, item);
        },

        /**
         * @param {I} item
         */
        push: function(item) {
            this.add(item);
        },

        /**
         * @param {number} index
         * @return {I} The removed item
         */
        removeAt: function(index) {
            var value = this.getAt(index);
            var result = this.getHashStore().remove(value);
            if (result) {
                this.itemArray.splice(index, 1);
            }
            return value;
        },

        /**
         * @param {number} index
         * @param {I} item
         */
        set: function(index, item) {
            var previousItem = this.removeAt(index);
            this.addAt(index, item);
            return previousItem;
        },

        /**
         * @return {I} The removed item
         */
        shift: function() {
            return this.removeAt(0);
        },

        /**
         * @param {number} fromIndex
         * @param {number} toIndex
         * @return {List.<I>}
         */
        subList: function(fromIndex, toIndex) {
            if (!TypeUtil.isNumber(toIndex)) {
                toIndex = this.getCount();
            }
            if (fromIndex < 0 || fromIndex > toIndex || toIndex > this.getCount()) {
                throw new Exception("IndexOutOfBounds", {}, "index was out of bounds");
            }
            var subList = new List();
            for (var i = fromIndex; i < toIndex; i++) {
                subList.add(this.getAt(i));
            }
            return subList;
        },

        /**
         * @param {I} item
         */
        unshift: function(item){
            this.addAt(0, item);
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(List, IIndexValueIterable);
    Class.implement(List, IList);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('List', List);
});
