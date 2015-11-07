/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Collection')

//@Require('ArgumentBug')
//@Require('Class')
//@Require('HashStore')
//@Require('IArrayable')
//@Require('ICollection')
//@Require('IIterable')
//@Require('IStreamable')
//@Require('Obj')
//@Require('Stream')
//@Require('Suppliers')
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
    var HashStore       = bugpack.require('HashStore');
    var IArrayable      = bugpack.require('IArrayable');
    var ICollection     = bugpack.require('ICollection');
    var IIterable       = bugpack.require('IIterable');
    var IStreamable     = bugpack.require('IStreamable');
    var Obj             = bugpack.require('Obj');
    var Stream          = bugpack.require('Stream');
    var Suppliers       = bugpack.require('Suppliers');
    var TypeUtil        = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IArrayable}
     * @implements {ICollection.<I>}
     * @implements {IIterable.<I>}
     * @implements {IStreamable.<I>}
     * @template I
     */
    var Collection = Class.extend(Obj, /** @lends {Collection.prototype} */{

        _name: "Collection",


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
             * @type {HashStore}
             */
            this.hashStore = new HashStore();
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {(IArrayable.<I> | Array.<I>)=} items
         * @return {Collection.<I>}
         */
        init: function(items) {
            var _this = this._super();

            if (_this) {
                if (items) {
                    this.addAll(items);
                }
            }
            return _this;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {HashStore}
         */
        getHashStore: function() {
            return this.hashStore;
        },


        //-------------------------------------------------------------------------------
        // IArrayable Implementation
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @return (Array.<I>)
         */
        toArray: function() {
            return this.hashStore.toArray();
        },


        //-------------------------------------------------------------------------------
        // ICollection Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {I} item
         * @return {boolean}
         */
        add: function(item) {
            this.hashStore.add(item);
            return true;
        },

        /**
         * @param {(IArrayable.<I> | Array.<I>)} items
         */
        addAll: function(items) {
            if (Class.doesImplement(items, IArrayable) && !Class.doesImplement(items, ICollection)) {
                items = items.toArray();
            }
            if (Class.doesImplement(items, ICollection) || TypeUtil.isArray(items)) {
                var _this = this;
                items.forEach(function(item) {
                    _this.add(item);
                });
            } else {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "items", items, "parameter must implement ICollection or be an Array");
            }
        },

        /**
         *
         */
        clear: function() {
            this.removeAll(this);
        },

        /**
         * @param {*} value
         * @return {boolean}
         */
        contains: function(value) {
            return this.hashStore.contains(value);
        },

        /**
         * Multiple elements are ignored in this function.
         * e.g. Collection[0,1] containsAll Collection[0,1,1,1] is true
         * If you want to check for exact equality, use the equals function.
         * Empty collections are always contained by another collection
         * e.g. Collection[0,1] containsAll Collection[] is true
         * @param {(IArrayable.<*> | Array.<*>)} values
         * @return {boolean}
         */
        containsAll: function(values) {
            if (Class.doesImplement(values, IArrayable) || TypeUtil.isArray(values)) {
                var valueArray = values;
                if (Class.doesImplement(values, IArrayable)) {
                    valueArray = values.toArray();
                }
                for (var i = 0, size = valueArray.length; i < size; i++) {
                    var value = valueArray[i];
                    if (!this.contains(value)) {
                        return false;
                    }
                }
                return true;
            } else {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "values", values, "parameter must implement ICollection or be an Array");
            }
        },

        /**
         * @param {(ICollection.<*> | Array.<*>)} values
         * @return {boolean}
         */
        containsEqual: function(values) {
            var collection = undefined;
            if (TypeUtil.isArray(values) || (Class.doesImplement(values, IArrayable) && !Class.doesImplement(values, ICollection))) {
                collection = new Collection(values);
            } else {
                collection = values;
            }
            if (Class.doesImplement(collection, ICollection)) {
                if (collection.getCount() === this.getCount()) {
                    var collectionValueArray = this.toArray();
                    for (var i1 = 0, size1 = collectionValueArray.length; i1 < size1; i1++) {
                        var collectionValue = collectionValueArray[i1];
                        if (this.countValue(collectionValue) !== collection.countValue(collectionValue)) {
                            return false;
                        }
                    }
                    return true;
                }
                return false;
            } else {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "values", values, "parameter must implement IArrayable or be an Array");
            }
        },

        /**
         * @param {*} value
         * @return {number}
         */
        countValue: function(value) {
            return this.hashStore.countValue(value);
        },

        /**
         * @return {number}
         */
        getCount: function() {
            return this.hashStore.getCount();
        },

        /**
         * @return {boolean}
         */
        isEmpty: function() {
            return this.hashStore.isEmpty();
        },

        /**
         * @param {*} value
         * @return {boolean}
         */
        remove: function(value) {
            return this.hashStore.remove(value);
        },

        /**
         * @param {(IArrayable.<*> | Array.<*>)} values
         */
        removeAll: function(values) {
            /** @type {ICollection.<*> | Array.<*>} */
            var collection = null;
            if ((Class.doesImplement(values, IArrayable) && !Class.doesImplement(values, ICollection))) {
                collection = new Collection(values);
            } else {
                collection = /** @type {ICollection.<*>} */(values);
            }
            if (Class.doesImplement(collection, ICollection) || TypeUtil.isArray(collection)) {
                var _this = this;
                collection.forEach(function(value) {
                    _this.remove(value);
                });
            } else {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "values", values, "parameter must implement ICollection or be an Array");
            }
        },

        /**
         * @param {(IArrayable.<*> | Array.<*>)} values
         */
        retainAll: function(values) {
            /** @type {ICollection} */
            var collection = null;
            if (TypeUtil.isArray(values) || (Class.doesImplement(values, IArrayable) && !Class.doesImplement(values, ICollection))) {
                collection = new Collection(values);
            } else {
                collection = /** @type {ICollection} */(values);
            }
            if (Class.doesImplement(collection, ICollection)) {
                var _this = this;
                _this.forEach(function(value) {
                    if (!collection.contains(value)) {
                        _this.remove(value);
                    }
                });
            } else {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "values", values, "parameter must implement IArrayable or be an Array");
            }
        },


        //-------------------------------------------------------------------------------
        // IIterable Implementation
        //-------------------------------------------------------------------------------

        /**
         * NOTE BRN: If a value is modified in one iteration and then visited at a later time, its value in the loop is
         * its value at that later time. A value that is deleted before it has been visited will not be visited later.
         * Values added to the Collection over which iteration is occurring may either be visited or omitted from iteration.
         *
         * @param {function(I)} func
         */
        forEach: function(func) {
            this.hashStore.forEach(func);
        },

        /**
         * NOTE BRN: If a value is modified in one iteration and then visited at a later time, its value in the loop is
         * its value at that later time. A value that is deleted before it has been visited will not be visited later.
         * Values added to the Collection over which iteration is occurring may either be visited or omitted from iteration.
         *
         * @return {IIterator.<I>}
         */
        iterator: function() {
            return this.hashStore.iterator();
        },


        //-------------------------------------------------------------------------------
        // IStreamable Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {Stream.<I>}
         */
        stream: function() {
            return Stream.newStream(Suppliers.iterable(this));
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean=} deep
         * @return {Collection.<I>}
         */
        clone: function(deep) {
            var cloneCollection = new Collection();
            if (deep) {
                this.forEach(function(item) {
                    cloneCollection.add(Obj.clone(item, true));
                });
            } else {
                cloneCollection.addAll(this);
            }
            return cloneCollection;
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(Collection, ICollection);
    Class.implement(Collection, IIterable);
    Class.implement(Collection, IStreamable);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Collection', Collection);
});
