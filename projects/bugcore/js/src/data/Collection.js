/**
 * Based on the google closure library.
 * http://closure-library.googlecode.com/svn/docs/interface_goog_structs_Collection.html
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
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


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
var Obj                 = bugpack.require('Obj');
var TypeUtil            = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 * @implements {IArrayable}
 * @implements {ICollection.<C>}
 * @implements {IIterable}
 * @template C
 */
var Collection = Class.extend(Obj, /** @lends {Collection.prototype} */{

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {(ICollection.<C> | Array.<C>)} items
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
     * @return (Array)
     */
    toArray: function() {
        return this.getValueArray();
    },


    //-------------------------------------------------------------------------------
    // ICollection Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {C} value
     * @return {boolean}
     */
    add: function(value) {
        this.hashStore.addValue(value);
        return true;
    },

    /**
     * @param {(ICollection.<C> | Array.<C>)} items
     */
    addAll: function(items) {
        if (Class.doesImplement(items, ICollection) || TypeUtil.isArray(items)) {
            var _this = this;
            items.forEach(function(value) {
                _this.add(value);
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
     * @param {(ICollection.<*> | Array.<*>)} items
     * @return {boolean}
     */
    containsAll: function(items) {
        if (Class.doesImplement(items, ICollection) || TypeUtil.isArray(items)) {
            var valueArray = items;
            if (Class.doesImplement(items, ICollection)) {
                valueArray = items.getValueArray();
            }
            for (var i = 0, size = valueArray.length; i < size; i++) {
                var value = valueArray[i];
                if (!this.contains(value)) {
                    return false;
                }
            }
            return true;
        } else {
            throw new ArgumentBug(ArgumentBug.ILLEGAL, "items", items, "parameter must implement ICollection or be an Array");
        }
    },

    /**
     * @param {(ICollection.<*> | Array.<*>)} items
     * @return {boolean}
     */
    containsEqual: function(items) {
        var collection = undefined;
        if (TypeUtil.isArray(items)) {
            collection = new Collection(items);
        } else {
            collection = items;
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
            throw new ArgumentBug(ArgumentBug.ILLEGAL, "items", items, "parameter must implement ICollection or be an Array");
        }
    },

    /**
     * NOTE BRN: If a value is modified in one iteration and then visited at a later time, its value in the loop is
     * its value at that later time. A value that is deleted before it has been visited will not be visited later.
     * Values added to the Collection over which iteration is occurring may either be visited or omitted from iteration.
     * In general it is best not to add, modify or remove values from the Collection during iteration, other than the
     * value currently being visited. There is no guarantee whether or not an added value will be visited, whether
     * a modified value (other than the current one) will be visited before or after it is modified, or whether a
     * deleted value will be visited before it is deleted.
     *
     * @param {function(*)} func
     */
    forEach: function(func) {
        this.hashStore.forEach(func);
    },

    /**
     * @return {number}
     */
    getCount: function() {
        return this.hashStore.getCount();
    },

    /**
     * @return {Array.<C>}
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
     * @param {*} value
     * @return {boolean}
     */
    remove: function(value) {
        return this.hashStore.removeValue(value);
    },

    /**
     * @param {(ICollection.<*> | Array.<*>)} items
     */
    removeAll: function(items) {
        if (Class.doesImplement(items, ICollection) || TypeUtil.isArray(items)) {
            var _this = this;
            items.forEach(function(value) {
                _this.remove(value);
            });
        } else {
            throw new ArgumentBug(ArgumentBug.ILLEGAL, "items", items, "parameter must implement ICollection or be an Array");
        }
    },

    /**
     * @param {(ICollection.<*> | Array.<*>)} items
     */
    retainAll: function(items) {
        if (TypeUtil.isArray(items)) {
            items = new Collection(items);
        }
        if (Class.doesImplement(items, ICollection)) {
            var _this = this;
            _this.forEach(function(value) {
                if (!items.contains(value)) {
                    _this.remove(value);
                }
            });
        } else {
            throw new ArgumentBug(ArgumentBug.ILLEGAL, "items", items, "parameter must implement ICollection or be an Array");
        }
    },


    //-------------------------------------------------------------------------------
    // IIterable Implementation
    //-------------------------------------------------------------------------------

    /**
     * NOTE BRN: Because of the way javascript works and the current lack of Iterator support across browsers. Iterators
     * create a snap shot of the values in the Collection before starting the iteration process. If a value is modified
     * in one iteration and then visited at a later time, its value in the loop is its value when the iteration was
     * started. A values that is deleted before it has been visited WILL be visited later.
     * Values added to the Collection over which iteration is occurring will be omitted from iteration.
     *
     * @return {IIterator}
     */
    iterator: function() {
        return new CollectionIterator(this);
    },


    //-------------------------------------------------------------------------------
    // Obj Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {Collection.<C>}
     */
    clone: function(deep) {
        var cloneCollection = new Collection();
        if (deep) {
            this.forEach(function(item){
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


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Collection', Collection);
