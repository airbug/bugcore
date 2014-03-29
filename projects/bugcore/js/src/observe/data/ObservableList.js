//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ObservableList')

//@Require('AddAtChange')
//@Require('Class')
//@Require('ICollection')
//@Require('IList')
//@Require('List')
//@Require('Obj')
//@Require('ObservableCollection')
//@Require('PrependChange')
//@Require('RemoveAtChange')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var AddAtChange                     = bugpack.require('AddAtChange');
var Class                           = bugpack.require('Class');
var ICollection                     = bugpack.require('ICollection');
var IList                           = bugpack.require('IList');
var List                            = bugpack.require('List');
var Obj                             = bugpack.require('Obj');
var ObservableCollection            = bugpack.require('ObservableCollection');
var PrependChange                   = bugpack.require('PrependChange');
var RemoveAtChange                  = bugpack.require('RemoveAtChange');
var TypeUtil                        = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {ObservableCollection}
 * @implements {IList}
 */
var ObservableList = Class.extend(ObservableCollection, /** @lends {ObservableList.prototype} */{

    //-------------------------------------------------------------------------------
    // Obj Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {ObservableList}
     */
    clone: function(deep) {
        var cloneList = new ObservableList();
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
    // ObservableCollection Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {C} value
     * @return {boolean}
     */
    add: function(value) {
        this.addAt(this.getCount(), value);
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
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {number} index
     */
    addAt: function(index, value) {
        this.getObserved().addAt(index, value);
        this.notifyObservers(new AddAtChange("", value, index))
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
            throw new Error("'items' must be implement ICollection or be an Array");
        }
    },

    /**
     * @param {number} index
     * @return {C}
     */
    getAt: function(index) {
        return this.getObserved().getAt(index);
    },

    /**
     * @param {*} value
     * @return {number}
     */
    indexOfFirst: function(value) {
        return this.getObserved().indexOfFirst(value);
    },

    /**
     * @param {*} value
     * @return {number}
     */
    indexOfLast: function(value) {
        return this.getObserved().indexOfLast(value);
    },

    /**
     * @return {C} The removed value
     */
    pop: function() {
        var lastIndex = this.valueArray.length - 1;
        return this.removeAt(lastIndex);
    },

    prepend: function(value) {
        this.getObserved().addAt(0, value);
        this.notifyObservers(new PrependChange("", value))
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
        var value = this.getObserved().removeAt(index);
        if (!TypeUtil.isUndefined(value)) {
            this.notifyObservers(new RemoveAtChange("", value. index));
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
     * @return {IList.<C>}
     */
    subList: function(fromIndex, toIndex) {
        return this.getObserved().subList(fromIndex, toIndex);
    },

    /**
     * @param {C} value
     */
    unshift: function(value){
        this.prepend(value);
    },

    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @protected
     * @param {(ICollection.<*> | Array.<*>)=} items
     */
    factoryObserved: function(items) {
        return new List(items);
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(ObservableList, IList);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('ObservableList', ObservableList);
