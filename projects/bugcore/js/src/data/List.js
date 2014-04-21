//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('List')

//@Require('ArgumentBug')
//@Require('Class')
//@Require('Collection')
//@Require('Exception')
//@Require('ICollection')
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

    var ArgumentBug     = bugpack.require('ArgumentBug');
    var Class           = bugpack.require('Class');
    var Collection      = bugpack.require('Collection');
    var Exception       = bugpack.require('Exception');
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
            this.valueArray.push(item);
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
         * @param {function(I, number)} func
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
         * @param {I} item
         */
        addAt: function(index, item) {

            // NOTE BRN: The index can be less than OR EQUAL TO the count. If equal to the count, we are adding values to
            // the very end of the list.

            if (index <= this.getCount()) {
                this.getHashStore().addValue(item);
                this.valueArray.splice(index, 0, item);
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
                return this.valueArray[index];
            } else {
                throw new Exception("IndexOutOfBounds", {}, "index was out of bounds");
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
         * @override
         * @param {function(I):*} fn
         * @param {*} context
         * @return {List.<*>}
         */
        map: function(fn, context) {
            var newArray    = this.getValueArray().map(fn, context);
            return new List(newArray);
        },

        /**
         * @return {I} The removed item
         */
        pop: function() {
            var lastIndex = this.valueArray.length - 1;
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
            var result = this.getHashStore().removeValue(value);
            if (result) {
                this.valueArray.splice(index, 1);
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

    Class.implement(List, IList);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('List', List);
});
