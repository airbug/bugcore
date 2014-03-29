//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('WeightedList')

//@Require('Class')
//@Require('Collection')
//@Require('List')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('WeightedListNode')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =             bugpack.require('Class');
var Collection =        bugpack.require('Collection');
var List =              bugpack.require('List');
var Obj =               bugpack.require('Obj');
var TypeUtil =          bugpack.require('TypeUtil');
var WeightedListNode =  bugpack.require('WeightedListNode');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var WeightedList = Class.extend(List, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
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
    // Object Implementation
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
    // Extended Collection Methods
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
                for (var i = 0, size = collection.valueArray.length; i < size; i++) {
                    this.add(collection.valueArray[i].getValue(), collection.valueArray[i].getWeight());
                }
            } else {
                collection.forEach(function(value) {
                    _this.add(value, 1);
                });
            }
        } else {
            throw new Error("collection must be an instance of Collection");
        }
    },

    /**
     *
     */
    clear: function() {
        this._super();
        this.totalWeight = 0;
    },

    /**
     * @param {*} value
     * @return {boolean}
     */
    contains: function(value) {
        var weightedListNode = new WeightedListNode(value, 1);
        return this.hashStore.hasValue(weightedListNode);
    },

    /**
     * @override
     * @param {function(*)} func
     */
    forEach: function(func) {
        for (var i = 0, size = this.valueArray.length; i < size; i++) {
            func(this.valueArray[i].getValue());
        }
    },

    /**
     * @override
     * @return {Array} Array is in the same order as the list
     */
    getValueArray: function() {
        var valueArray = [];
        for (var i = 0, size = this.valueArray.length; i < size; i++) {
            valueArray.push(this.valueArray[i].getValue());
        }
        return valueArray;
    },

    /**
     * @param {*} value
     * @return {number}
     */
    getValueCount: function(value) {
        var weightedListNode = new WeightedListNode(value, 1);
        return this.hashStore.getValueCount(weightedListNode);
    },

    /**
     * @param {*} value
     * @return {boolean}
     */
    remove: function(value) {
        var index = this.indexOfFirst(value);
        if (index > -1) {
            var firstValue = this.valueArray[index];
            this.totalWeight -= firstValue.getWeight();
            this.removeAt(index);
            return true;
        }
        return false;
    },


    //-------------------------------------------------------------------------------
    // Extended List Methods
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
            this.hashStore.addValue(weightedListNode);
            this.count++;
            this.valueArray.splice(index, 0, weightedListNode);
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
                for (var i = 0, size = collection.valueArray.length; i < size; i++) {
                    this.addAt(insertingIndex, collection.valueArray[i].getValue(), collection.valueArray[i].getWeight());

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
            return this.valueArray[index].getValue();
        } else {
            throw new Error("Index out of bounds");
        }
    },

    /**
     * @param {*} value
     * @return {number}
     */
    indexOfFirst: function(value) {
        for (var i = 0, size = this.valueArray.length; i < size; i++) {
            if (Obj.equals(this.valueArray[i].getValue(), value)) {
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
        for (var size = this.valueArray.length, i = size - 1; i >= 0; i--) {
            if (Obj.equals(this.valueArray[i].getValue(), value)) {
                return i;
            }
        }
        return -1;
    },

    /**
     * @param {number} index
     * @return {*} The removed value
     */
    removeAt: function(index) {
        if (index < this.getCount()) {
            var weightedListNode = this.valueArray[index];
            var result = this.hashStore.removeValue(weightedListNode);
            if (result) {
                this.count--;
                this.totalWeight -= weightedListNode.getWeight();
                this.valueArray.splice(index, 1);
            }
            return weightedListNode.getValue();
        } else {
            throw new Error("Index out of bounds");
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


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {number} weight
     * @return {*}
     */
    getAtWeight: function(weight) {
        if (weight <= this.getTotalWeight()) {
            var currentWeight = 0;
            for (var i = 0, size = this.valueArray.length; i < size; i++) {
                var weightedListNode = this.valueArray[i];
                currentWeight += weightedListNode.getWeight();
                if (currentWeight >= weight) {
                    return weightedListNode.getValue();
                }
            }
        } else {
            throw new Error("Weight out of bounds");
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('WeightedList', WeightedList);
