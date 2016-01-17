/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('List')

//@Require('ArgumentBug')
//@Require('Class')
//@Require('Collection')
//@Require('Exception')
//@Require('IArrayable')
//@Require('ICollection')
//@Require('IIndexValueIterable')
//@Require('IList')
//@Require('Obj')
//@Require('ReflectArray')
//@Require('ReflectArrayIterator')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgumentBug             = bugpack.require('ArgumentBug');
    var Class                   = bugpack.require('Class');
    var Collection              = bugpack.require('Collection');
    var Exception               = bugpack.require('Exception');
    var IArrayable              = bugpack.require('IArrayable');
    var ICollection             = bugpack.require('ICollection');
    var IIndexValueIterable     = bugpack.require('IIndexValueIterable');
    var IList                   = bugpack.require('IList');
    var Obj                     = bugpack.require('Obj');
    var ReflectArray            = bugpack.require('ReflectArray');
    var ReflectArrayIterator    = bugpack.require('ReflectArrayIterator');
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
             * @type {ReflectArray.<I>}
             */
            this.itemReflectArray = new ReflectArray([]);
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {ReflectArray.<I>} Array is in the same order as the list
         */
        getItemReflectArray: function() {
            return this.itemReflectArray;
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
            this.itemReflectArray.push(item);
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
         * @return {IIndexValueIterator.<V>}
         */
        iterator: function() {
            return new ReflectArrayIterator(this.itemReflectArray);
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
                this.itemReflectArray.splice(index, 0, item);
            } else {
                throw new Exception("IndexOutOfBounds", {}, "index was out of bounds");
            }
        },

        /**
         * @param {number} index
         * @param {(IArrayable.<I> | Array.<*>)} items
         */
        addAllAt: function(index, items) {
            /** @type {(ICollection.<*> | Array.<*>)} */
            var collection = null;
            if ((Class.doesImplement(items, IArrayable) && !Class.doesImplement(items, ICollection))) {
                collection = new Collection(items);
            } else {
                collection = /** @type {(ICollection.<*> | Array.<*>)} */(items);
            }
            if (Class.doesImplement(collection, ICollection) || TypeUtil.isArray(collection)) {
                var insertingIndex = index;
                var _this = this;
                collection.forEach(function(value) {
                    _this.addAt(insertingIndex, value);

                    // NOTE BRN: We increment the inserting index so that the collection is inserted in the correct order.

                    insertingIndex++;
                });
            } else {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "items", items, "parameter must either implement IArrayable or be an Array");
            }
        },

        /**
         * @param {number} index
         * @return {I}
         */
        getAt: function(index) {
            if (index < this.getCount()) {
                return this.itemReflectArray.getAt(index);
            } else {
                throw new Exception("IndexOutOfBounds", {}, "index was out of bounds");
            }
        },

        /**
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
         * @param {*} value
         * @return {number}
         */
        indexOfLast: function(value) {
            for (var size = this.itemReflectArray.getLength(), i = size - 1; i >= 0; i--) {
                if (Obj.equals(this.itemReflectArray.getAt(i), value)) {
                    return i;
                }
            }
            return -1;
        },

        /**
         * @return {I} The removed item
         */
        pop: function() {
            var lastIndex = this.itemReflectArray.getLength() - 1;
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
                this.itemReflectArray.splice(index, 1);
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
