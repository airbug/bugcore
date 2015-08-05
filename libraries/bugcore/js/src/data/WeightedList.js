/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('WeightedList')

//@Require('Class')
//@Require('Collection')
//@Require('Exception')
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

    var Class                   = bugpack.require('Class');
    var Collection              = bugpack.require('Collection');
    var Exception               = bugpack.require('Exception');
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
     * @extends {List}
     */
    var WeightedList = Class.extend(List, {

        _name: "WeightedList",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {(Collection.<*> | Array.<*>)} items
         */
        _constructor: function(items) {

            this._super(items);


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
         * @param {Collection} collection
         */
        addAll: function(collection) {
            var _this = this;
            if (Class.doesExtend(collection, Collection)) {
                if (Class.doesExtend(collection, WeightedList)) {
                    for (var i = 0, size = collection.getItemArray().length; i < size; i++) {
                        this.add(collection.getItemArray()[i].getValue(), collection.getItemArray()[i].getWeight());
                    }
                } else {
                    collection.forEach(function(value) {
                        _this.add(value, 1);
                    });
                }
            } else {
                throw new Exception("collection must be an instance of Collection");
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
                var firstValue = this.getItemArray()[index];
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
                this.getItemArray().splice(index, 0, weightedListNode);
                this.totalWeight += weight;
            } else {
                throw new Error("Index out of bounds");
            }
        },

        /**
         * @param {number} index
         * @param {Collection} collection
         * @param {number} weight
         */
        addAllAt: function(index, collection, weight) {
            if (Class.doesExtend(collection, Collection)) {
                var insertingIndex = index;
                var _this = this;

                if (Class.doesExtend(collection, WeightedList)) {
                    for (var i = 0, size = collection.getItemArray().length; i < size; i++) {
                        this.addAt(insertingIndex, collection.getItemArray()[i].getValue(), collection.getItemArray()[i].getWeight());

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
                throw new Error("collection must be an instance of Collection");
            }
        },

        /**
         * @param {number} index
         * @return {*}
         */
        getAt: function(index) {
            if (index < this.getCount()) {
                return this.getItemArray()[index].getValue();
            } else {
                throw new Exception("IndexOutOfBounds", {}, "Index out of bounds");
            }
        },

        /**
         * @param {*} value
         * @return {number}
         */
        indexOfFirst: function(value) {
            for (var i = 0, size = this.getItemArray().length; i < size; i++) {
                if (Obj.equals(this.getItemArray()[i].getValue(), value)) {
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
            for (var size = this.getItemArray().length, i = size - 1; i >= 0; i--) {
                if (Obj.equals(this.getItemArray()[i].getValue(), value)) {
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
                var weightedListNode = this.getItemArray()[index];
                var result = this.getHashStore().remove(weightedListNode);
                if (result) {
                    this.count--;
                    this.totalWeight -= weightedListNode.getWeight();
                    this.getItemArray().splice(index, 1);
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
            for (var i = 0, size = this.getItemArray().length; i < size; i++) {
                itemArray.push(this.getItemArray()[i].getValue());
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
                for (var i = 0, size = this.getItemArray().length; i < size; i++) {
                    var weightedListNode = this.getItemArray()[i];
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
