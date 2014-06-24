/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Collection')

//@Require('ArgumentBug')
//@Require('Class')
//@Require('CollectionIterator')
//@Require('HashStore')
//@Require('IArrayable')
//@Require('ICollection')
//@Require('IIterable')
//@Require('IStreamable')
//@Require('IterableSupplier')
//@Require('Obj')
//@Require('Stream')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgumentBug         = bugpack.require('ArgumentBug');
    var Class               = bugpack.require('Class');
    var CollectionIterator  = bugpack.require('CollectionIterator');
    var HashStore           = bugpack.require('HashStore');
    var IArrayable          = bugpack.require('IArrayable');
    var ICollection         = bugpack.require('ICollection');
    var IIterable           = bugpack.require('IIterable');
    var IStreamable         = bugpack.require('IStreamable');
    var IterableSupplier    = bugpack.require('IterableSupplier');
    var Obj                 = bugpack.require('Obj');
    var Stream              = bugpack.require('Stream');
    var TypeUtil            = bugpack.require('TypeUtil');


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
         * @param {(ICollection.<I> | Array.<I>)=} items
         */
        _constructor: function(items) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {HashStore}
             */
            this.hashStore = new HashStore();


            //-------------------------------------------------------------------------------
            // Add Arguments to HashStore
            //-------------------------------------------------------------------------------

            if (items) {
                this.addAll(items);
            }
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
            return this.getValueArray();
        },


        //-------------------------------------------------------------------------------
        // ICollection Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {I} item
         * @return {boolean}
         */
        add: function(item) {
            this.hashStore.addValue(item);
            return true;
        },

        /**
         * @param {(ICollection.<I> | Array.<I>)} items
         */
        addAll: function(items) {
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
            this.hashStore = new HashStore();
        },

        /**
         * @param {*} value
         * @return {boolean}
         */
        contains: function(value) {
            return this.hashStore.hasValue(value);
        },

        /**
         * Multiple elements are ignored in this function.
         * e.g. Collection[0,1] containsAll Collection[0,1,1,1] is true
         * If you want to check for exact equality, use the equals function.
         * Empty collections are always contained by another collection
         * e.g. Collection[0,1] containsAll Collection[] is true
         * @param {(ICollection.<*> | Array.<*>)} values
         * @return {boolean}
         */
        containsAll: function(values) {
            if (Class.doesImplement(values, ICollection) || TypeUtil.isArray(values)) {
                var valueArray = values;
                if (Class.doesImplement(values, ICollection)) {
                    valueArray = values.getValueArray();
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
            if (TypeUtil.isArray(values)) {
                collection = new Collection(values);
            } else {
                collection = values;
            }
            if (Class.doesImplement(collection, ICollection)) {
                if (collection.getCount() === this.getCount()) {
                    var collectionValueArray = this.getValueArray();
                    for (var i1 = 0, size1 = collectionValueArray.length; i1 < size1; i1++) {
                        var collectionValue = collectionValueArray[i1];
                        if (this.getValueCount(collectionValue) !== collection.getValueCount(collectionValue)) {
                            return false;
                        }
                    }
                    return true;
                }
                return false;
            } else {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "values", values, "parameter must implement ICollection or be an Array");
            }
        },

        /**
         * @return {number}
         */
        getCount: function() {
            return this.hashStore.getCount();
        },

        /**
         * @return {Array.<I>}
         */
        getValueArray: function() {

            //NOTE BRN: The getValueArray method of HashStore already creates a new array

            return this.hashStore.getValueArray();
        },

        /**
         * @param {*} value
         * @return {number}
         */
        getValueCount: function(value) {
            return this.hashStore.getValueCount(value);
        },

        /**
         * @return {boolean}
         */
        isEmpty: function() {
            return this.hashStore.isEmpty();
        },

        /**
         * @param {function(I):*} fn
         * @param {*} context
         * @return {ICollection.<*>}
         */
        map: function(fn, context) {
            var newArray    = this.getValueArray().map(fn, context);
            return new Collection(newArray);
        },

        /**
         * @param {*} value
         * @return {boolean}
         */
        remove: function(value) {
            return this.hashStore.removeValue(value);
        },

        /**
         * @param {(ICollection.<*> | Array.<*>)} values
         */
        removeAll: function(values) {
            if (Class.doesImplement(values, ICollection) || TypeUtil.isArray(values)) {
                var _this = this;
                values.forEach(function(value) {
                    _this.remove(value);
                });
            } else {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "values", values, "parameter must implement ICollection or be an Array");
            }
        },

        /**
         * @param {(ICollection.<*> | Array.<*>)} values
         */
        retainAll: function(values) {
            if (TypeUtil.isArray(values)) {
                values = new Collection(values);
            }
            if (Class.doesImplement(values, ICollection)) {
                var _this = this;
                _this.forEach(function(value) {
                    if (!values.contains(value)) {
                        _this.remove(value);
                    }
                });
            } else {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "values", values, "parameter must implement ICollection or be an Array");
            }
        },


        //-------------------------------------------------------------------------------
        // IIterable Implementation
        //-------------------------------------------------------------------------------

        /**
         * NOTE BRN: If a value is modified in one iteration and then visited at a later time, its value in the loop is
         * its value at that later time. A value that is deleted before it has been visited will not be visited later.
         * Values added to the Collection over which iteration is occurring may either be visited or omitted from iteration.
         * In general it is best not to add, modify or remove values from the Collection during iteration, other than the
         * value currently being visited. There is no guarantee whether or not an added value will be visited, whether
         * a modified value (other than the current one) will be visited before or after it is modified, or whether a
         * deleted value will be visited before it is deleted.
         *
         * @param {function(I)} func
         */
        forEach: function(func) {
            this.hashStore.forEach(func);
        },

        /**
         * NOTE BRN: Because of the way javascript works and the current lack of Iterator support across browsers. Iterators
         * create a snap shot of the values in the Collection before starting the iteration process. If a value is modified
         * in one iteration and then visited at a later time, its value in the loop is its value when the iteration was
         * started. A value that is deleted before it has been visited WILL be visited later.
         * Values added to the Collection over which iteration is occurring will be omitted from iteration.
         *
         * @return {IIterator.<I>}
         */
        iterator: function() {
            return new CollectionIterator(this);
        },


        //-------------------------------------------------------------------------------
        // IStreamable Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {Stream.<I>}
         */
        stream: function() {
            return Stream.generate(new IterableSupplier(this));
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

    Class.implement(Collection, IArrayable);
    Class.implement(Collection, ICollection);
    Class.implement(Collection, IIterable);
    Class.implement(Collection, IStreamable);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Collection', Collection);
});
