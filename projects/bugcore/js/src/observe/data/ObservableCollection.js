//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ObservableCollection')

//@Require('AddChange')
//@Require('ArgumentBug')
//@Require('Class')
//@Require('ClearChange')
//@Require('Collection')
//@Require('CollectionIterator')
//@Require('IArrayable')
//@Require('ICollection')
//@Require('IIterable')
//@Require('Obj')
//@Require('Observable')
//@Require('Proxy')
//@Require('RemoveChange')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var AddChange                       = bugpack.require('AddChange');
var ArgumentBug                     = bugpack.require('ArgumentBug');
var Class                           = bugpack.require('Class');
var ClearChange                     = bugpack.require('ClearChange');
var Collection                      = bugpack.require('Collection');
var CollectionIterator              = bugpack.require('CollectionIterator');
var IArrayable                      = bugpack.require('IArrayable');
var ICollection                     = bugpack.require('ICollection');
var IIterable                       = bugpack.require('IIterable');
var Obj                             = bugpack.require('Obj');
var Observable                      = bugpack.require('Observable');
var Proxy                           = bugpack.require('Proxy');
var RemoveChange                    = bugpack.require('RemoveChange');
var TypeUtil                        = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Observable}
 * @implements {ICollection}
 */
var ObservableCollection = Class.extend(Observable, /** @lends {ObservableCollection.prototype} */{

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {(ICollection.<*> | Array.<*>)} items
     */
    _constructor: function(items) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ICollection}
         */
        this.observed = this.factoryObserved(items);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {ICollection}
     */
    getObserved: function() {
        return this.observed;
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
     * @param {*} value
     * @return {boolean}
     */
    add: function(value) {
        var result = this.observed.add(value);
        if (result) {
            this.notifyObservers(new AddChange("", value))
        }
        return result;
    },

    /**
     * @param {(ICollection.<*> | Array.<*>)} items
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
        this.observed.clear();
        this.notifyObservers(new ClearChange(""));
    },

    /**
     * @param {*} value
     * @return {boolean}
     */
    contains: function(value) {
        return this.observed.contains(value);
    },

    /**
     * @param {(ICollection.<*> | Array.<*>)} items
     * @return {boolean}
     */
    containsAll: function(items) {
        return this.observed.contains(items);
    },

    /**
     * @param {(ICollection.<*> | Array.<*>)} items
     * @return {boolean}
     */
    containsEqual: function(items) {
        return this.observed.containsEqual(items);
    },

    /**
     * @param {function(A)} func
     */
    forEach: function(func) {
        this.observed.forEach(func);
    },

    /**
     * @return {number}
     */
    getCount: function() {
        return this.observed.getCount();
    },

    /**
     * @return {Array.<*>}
     */
    getValueArray: function() {
        return this.observed.getValueArray();
    },

    /**
     * @param {*} value
     * @return {number}
     */
    getValueCount: function(value) {
        return this.observed.getValueCount(value);
    },

    /**
     * @return {boolean}
     */
    isEmpty: function() {
        return this.observed.isEmpty();
    },

    /**
     * @param {*} value
     * @return {boolean}
     */
    remove: function(value) {
        var result = this.observed.remove(value);
        if (result) {
            this.notifyObservers(new RemoveChange("", value));
        }
        return result;
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
     * @return {ObservableCollection.<C>}
     */
    clone: function(deep) {
        var cloneCollection = new ObservableCollection();
        if (deep) {
            this.forEach(function(item){
                cloneCollection.add(Obj.clone(item, deep));
            });
        } else {
            cloneCollection.addAll(this);
        }
        return cloneCollection;
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {(ICollection.<*> | Array.<*>)=} items
     */
    factoryObserved: function(items) {
        return new Collection(items);
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(ObservableCollection, IArrayable);
Class.implement(ObservableCollection, ICollection);
Class.implement(ObservableCollection, IIterable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('ObservableCollection', ObservableCollection);
