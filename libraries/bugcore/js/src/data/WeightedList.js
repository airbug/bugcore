/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('WeightedList')

//@Require('ArgumentBug')
//@Require('Class')
//@Require('Collection')
//@Require('Exception')
//@Require('IArrayable')
//@Require('ICollection')
//@Require('List')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('WeightedListIterator')
//@Require('WeightedListNode')


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
    var List                    = bugpack.require('List');
    var Obj                     = bugpack.require('Obj');
    var TypeUtil                = bugpack.require('TypeUtil');
    var WeightedListIterator    = bugpack.require('WeightedListIterator');
    var WeightedListNode        = bugpack.require('WeightedListNode');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {List.<I>}
     * @template I
     */
    var WeightedList = Class.extend(List, {

        _name: "WeightedList",


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
            this.totalWeight = 0;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {number}
         */
        getTotalWeight: function() {
            return this.totalWeight;
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {WeightedList}
         */
        clone: function() {
            var cloneList = new WeightedList();
            cloneList.addAll(this);
            return cloneList;
        },


        //-------------------------------------------------------------------------------
        // Collection Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} value
         * @param {number} weight
         */
        add: function(value, weight) {
            weight = TypeUtil.isNumber(weight) ? weight : 1;
            var weightedListNode = new WeightedListNode(value, weight);
            this.totalWeight += weight;
            this._super(weightedListNode);
        },

        /**
         * @param {(IArrayable.<I> | Array.<I>)} items
         */
        addAll: function(items) {
            /** @type {(ICollection.<*> | Array.<*>)} */
            var collection = null;
            if ((Class.doesImplement(items, IArrayable) && !Class.doesImplement(items, ICollection))) {
                collection = new Collection(items);
            } else {
                collection = /** @type {(ICollection.<*> | Array.<*>)} */(items);
            }
            var _this = this;
            if (Class.doesImplement(collection, ICollection)) {
                if (Class.doesExtend(collection, WeightedList)) {
                    /** @type {WeightedList} */
                    var weightedList = /** @type {WeightedList} */(collection);
                    for (var i = 0, size = weightedList.getItemReflectArray().getLength(); i < size; i++) {
                        this.add(weightedList.getItemReflectArray().getAt(i).getValue(), weightedList.getItemReflectArray().getAt(i).getWeight());
                    }
                } else {
                    collection.forEach(function(value) {
                        _this.add(value, 1);
                    });
                }
            } else {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "items", items, "parameter must either implement IArrayable or be an Array");
            }
        },

        /**
         * @param {*} value
         * @return {boolean}
         */
        contains: function(value) {
            var weightedListNode = new WeightedListNode(value, 1);
            return this.getHashStore().contains(weightedListNode);
        },

        /**
         * @param {*} value
         * @return {number}
         */
        countValue: function(value) {
            var weightedListNode = new WeightedListNode(value, 1);
            return this.getHashStore().countValue(weightedListNode);
        },

        /**
         * @param {*} value
         * @return {boolean}
         */
        remove: function(value) {
            var index = this.indexOfFirst(value);
            if (index > -1) {
                var firstValue = this.getItemReflectArray().getAt(index);
                this.totalWeight -= firstValue.getWeight();
                this.removeAt(index);
                return true;
            }
            return false;
        },


        //-------------------------------------------------------------------------------
        // List Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {number} index
         * @param {*} value
         * @param {number} weight
         */
        addAt: function(index, value, weight) {

            // NOTE BRN: The index can be less than OR EQUAL TO the count. If equal to the count, we are adding values to
            // the very end of the list.

            if (index <= this.getCount()) {
                var weightedListNode = new WeightedListNode(value, weight);
                this.getHashStore().add(weightedListNode);
                this.count++;
                this.getItemReflectArray().splice(index, 0, weightedListNode);
                this.totalWeight += weight;
            } else {
                throw new Exception("IndexOutOfBounds", {}, "index was out of bounds");
            }
        },

        /**
         * @param {number} index
         * @param {(IArrayable.<I> | Array.<I>)} items
         * @param {number} weight
         */
        addAllAt: function(index, items, weight) {
            var _this       = this;
            /** @type {(ICollection.<*> | Array.<*>)} */
            var collection  = null;
            if ((Class.doesImplement(items, IArrayable) && !Class.doesImplement(items, ICollection))) {
                collection = new Collection(items);
            } else {
                collection = /** @type {(ICollection.<*> | Array.<*>)} */(items);
            }
            if (Class.doesImplement(collection, ICollection) || TypeUtil.isArray(collection)) {
                var insertingIndex = index;

                if (Class.doesExtend(collection, WeightedList)) {
                    /** @type {WeightedList} */
                    var weightedList = /** @type {WeightedList} */(collection);
                    for (var i = 0, size = weightedList.getItemReflectArray().getLength(); i < size; i++) {
                        this.addAt(insertingIndex, weightedList.getItemReflectArray().getAt(i).getValue(), weightedList.getItemReflectArray().getAt(i).getWeight());

                        // NOTE BRN: We increment the inserting index so that the collection is inserted in the correct order.

                        insertingIndex++;
                    }
                } else {
                    collection.forEach(function(value) {
                        _this.addAt(insertingIndex, value, weight);

                        // NOTE BRN: We increment the inserting index so that the collection is inserted in the correct order.

                        insertingIndex++;
                    });
                }
            } else {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "items", items, "parameter must either implement IArrayable or be an Array");
            }
        },

        /**
         * @param {number} index
         * @return {*}
         */
        getAt: function(index) {
            if (index < this.getCount()) {
                return this.getItemReflectArray().getAt(index).getValue();
            } else {
                throw new Exception("IndexOutOfBounds", {}, "Index out of bounds");
            }
        },

        /**
         * @param {*} value
         * @return {number}
         */
        indexOfFirst: function(value) {
            for (var i = 0, size = this.getItemReflectArray().getLength(); i < size; i++) {
                if (Obj.equals(this.getItemReflectArray().getAt(i).getValue(), value)) {
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
            for (var size = this.getItemReflectArray().getLength(), i = size - 1; i >= 0; i--) {
                if (Obj.equals(this.getItemReflectArray().getAt(i).getValue(), value)) {
                    return i;
                }
            }
            return -1;
        },

        /**
         * @override
         * @return {IIndexValueIterator.<V>}
         */
        iterator: function() {
            return new WeightedListIterator(this);
        },

        /**
         * @param {number} index
         * @return {*} The removed value
         */
        removeAt: function(index) {
            if (index < this.getCount()) {
                var weightedListNode = this.getItemReflectArray().getAt(index);
                var result = this.getHashStore().remove(weightedListNode);
                if (result) {
                    this.count--;
                    this.totalWeight -= weightedListNode.getWeight();
                    this.getItemReflectArray().splice(index, 1);
                }
                return weightedListNode.getValue();
            } else {
                throw new Exception("IndexOutOfBounds", {}, "Index out of bounds");
            }
        },

        /**
         * @param {number} index
         * @param {*} value
         * @param {number} weight
         */
        set: function(index, value, weight) {
            this.removeAt(index);
            this.addAt(index, value, weight);
        },

        /**
         * @override
         * @return {Array.<I>} Array is in the same order as the list
         */
        toArray: function() {
            var itemArray = [];
            for (var i = 0, size = this.getItemReflectArray().getLength(); i < size; i++) {
                itemArray.push(this.getItemReflectArray().getAt(i).getValue());
            }
            return itemArray;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {number} weight
         * @return {*}
         */
        getAtWeight: function(weight) {
            if (weight <= this.getTotalWeight()) {
                var currentWeight = 0;
                for (var i = 0, size = this.getItemReflectArray().getLength(); i < size; i++) {
                    var weightedListNode = this.getItemReflectArray().getAt(i);
                    currentWeight += weightedListNode.getWeight();
                    if (currentWeight >= weight) {
                        return weightedListNode.getValue();
                    }
                }
            } else {
                throw new Exception("WeightOutOfBounds", {}, "Weight out of bounds");
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('WeightedList', WeightedList);
});
