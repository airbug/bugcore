//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('List')

//@Require('ArgumentBug')
//@Require('Bug')
//@Require('Class')
//@Require('Collection')
//@Require('ICollection')
//@Require('IList')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgumentBug     = bugpack.require('ArgumentBug');
var Bug             = bugpack.require('Bug');
var Class           = bugpack.require('Class');
var Collection      = bugpack.require('Collection');
var ICollection     = bugpack.require('ICollection');
var IList           = bugpack.require('IList');
var Obj             = bugpack.require('Obj');
var TypeUtil        = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Collection}
 * @implements {IList.<C>}
 * @template C
 */
var List = Class.extend(Collection, {

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

        if (items) {
            this.addAll(items);
        }
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @return {Array} Array is in the same order as the list
     */
    getValueArray: function() {
        return Obj.clone(this.valueArray);
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean=} deep
     * @return {List.<C>}
     */
    clone: function(deep) {
        var cloneList = new List();
        if(deep){
            this.forEach(function(item){
                cloneList.add(Obj.clone(item, true));
            });
        } else {
            cloneList.addAll(this);
        }
        return cloneList;
    },


    //-------------------------------------------------------------------------------
    // Extended Collection Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {C} value
     * @return {boolean}
     */
    add: function(value) {
        this._super(value);
        this.valueArray.push(value);
        return true;
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
     * @param {function(*, number)} func
     */
    forEach: function(func) {
        for (var i = 0, size = this.valueArray.length; i < size; i++) {
            func(this.valueArray[i], i);
        }
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


    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {number} index
     * @param {C} value
     */
    addAt: function(index, value) {

        // NOTE BRN: The index can be less than OR EQUAL TO the count. If equal to the count, we are adding values to
        // the very end of the list.

        if (index <= this.getCount()) {
            this.hashStore.addValue(value);
            this.valueArray.splice(index, 0, value);
        } else {
            throw new Bug("IndexOutOfBounds", {}, "index was out of bounds");
        }
    },

    /**
     * @param {number} index
     * @param {(ICollection.<C> | Array.<*>)} items
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
     * @return {C}
     */
    getAt: function(index) {
        if (index < this.getCount()) {
            return this.valueArray[index];
        } else {
            throw new Bug("IndexOutOfBounds", {}, "index was out of bounds");
        }
    },

    /**
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
     * @param {*} value
     * @return {number}
     */
    indexOfLast: function(value) {
        for (var size = this.valueArray.length, i = size - 1; i >= 0; i--) {
            if (Obj.equals(this.valueArray[i], value)) {
                return i;
            }
        }
        return -1;
    },

    /**
     * @param {function()} function
     * @param {{*}} context
     * @return {List}
     * destructive
     */
    map: function(fn, context) {
        var _this       = this;
        var newArray    = this.valueArray.map(fn, context);
        this.clear();
        this.valueArray = newArray;
        this.valueArray.forEach(function(value){
            _this.hashStore.addValue(value);
        });
        return this;
    },

    /**
     * @return {C} The removed value
     */
    pop: function() {
        var lastIndex = this.valueArray.length - 1;
        return this.removeAt(lastIndex);
    },

    /**
     * @param {C} value
     */
    prepend: function(value) {
        this.addAt(0, value);
    },

    /**
     * @param {C} value
     */
    push: function(value) {
        this.add(value);
    },

    /**
     * @param {number} index
     * @return {C} The removed value
     */
    removeAt: function(index) {
        var value = this.getAt(index);
        var result = this.getHashStore().removeValue(value);
        if (result) {
            this.valueArray.splice(index, 1);
        }
        return value;
    },

    /**
     * @param {number} index
     * @param {C} value
     */
    set: function(index, value) {
        var previousValue = this.removeAt(index);
        this.addAt(index, value);
        return previousValue;
    },

    /**
     * @return {C} The removed value
     */
    shift: function() {
        return this.removeAt(0);
    },

    /**
     * @param {number} fromIndex
     * @param {number} toIndex
     * @return {List.<C>}
     */
    subList: function(fromIndex, toIndex) {
        if (!TypeUtil.isNumber(toIndex)) {
            toIndex = this.getCount();
        }
        if (fromIndex < 0 || fromIndex > toIndex || toIndex > this.getCount()) {
            throw new Bug("IndexOutOfBounds", {}, "index was out of bounds");
        }
        var subList = new List();
        for (var i = fromIndex; i < toIndex; i++) {
            subList.add(this.getAt(i));
        }
        return subList;
    },

    /**
     * @param {C} value
     */
    unshift: function(value){
        this.addAt(0, value);
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(List, IList);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('List', List);
