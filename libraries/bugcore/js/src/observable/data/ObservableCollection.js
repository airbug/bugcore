/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ObservableCollection')

//@Require('AddChange')
//@Require('ArgumentBug')
//@Require('Class')
//@Require('ClearChange')
//@Require('Collection')
//@Require('IArrayable')
//@Require('ICollection')
//@Require('IIterable')
//@Require('Obj')
//@Require('Observable')
//@Require('RemoveChange')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var AddChange       = bugpack.require('AddChange');
    var ArgumentBug     = bugpack.require('ArgumentBug');
    var Class           = bugpack.require('Class');
    var ClearChange     = bugpack.require('ClearChange');
    var Collection      = bugpack.require('Collection');
    var IArrayable      = bugpack.require('IArrayable');
    var ICollection     = bugpack.require('ICollection');
    var IIterable       = bugpack.require('IIterable');
    var Obj             = bugpack.require('Obj');
    var Observable      = bugpack.require('Observable');
    var RemoveChange    = bugpack.require('RemoveChange');
    var TypeUtil        = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Observable}
     * @implements {ICollection.<I>}
     * @template I
     */
    var ObservableCollection = Class.extend(Observable, /** @lends {ObservableCollection.prototype} */{

        _name: 'ObservableCollection',


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {(ICollection.<I> | Array.<I>)} items
         */
        _constructor: function(items) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Collection.<I>}
             */
            this.observed = this.factoryObserved(items);
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Collection.<I>}
         */
        getObserved: function() {
            return this.observed;
        },


        //-------------------------------------------------------------------------------
        // IArrayable Implementation
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @return (Array.<I>)
         */
        toArray: function() {
            return this.observed.toArray();
        },


        //-------------------------------------------------------------------------------
        // ICollection Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {I} value
         * @return {boolean}
         */
        add: function(value) {
            var result = this.observed.add(value);
            if (result) {
                this.notifyObservers(new AddChange(value));
            }
            return result;
        },

        /**
         * @param {(ICollection.<I> | Array.<I>)} items
         */
        addAll: function(items) {
            if (Class.doesImplement(items, ICollection) || TypeUtil.isArray(items)) {
                var _this = this;
                items.forEach(function(value) {
                    _this.add(value);
                });
            } else {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, 'items', items, 'parameter must implement ICollection or be an Array');
            }
        },

        /**
         *
         */
        clear: function() {
            this.observed.clear();
            this.notifyObservers(new ClearChange());
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
         * @return {number}
         */
        getCount: function() {
            return this.observed.getCount();
        },

        /**
         * @param {*} value
         * @return {number}
         */
        countValue: function(value) {
            return this.observed.countValue(value);
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
                this.notifyObservers(new RemoveChange(value));
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
                throw new ArgumentBug(ArgumentBug.ILLEGAL, 'items', items, 'parameter must implement ICollection or be an Array');
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
            this.observed.forEach(func);
        },

        /**
         * NOTE BRN: If a value is modified in one iteration and then visited at a later time, its value in the loop is
         * its value at that later time. A value that is deleted before it has been visited will not be visited later.
         * Values added to the Collection over which iteration is occurring may either be visited or omitted from iteration.
         *
         * @return {IIterator.<I>}
         */
        iterator: function() {
            return this.observed.iterator();
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean} deep
         * @return {ObservableCollection.<I>}
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
         * @param {(ICollection.<I> | Array.<I>)=} items
         * @return {Collection.<I>}
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
});
