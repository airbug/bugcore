/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Array')

//@Require('ArrayIterator')
//@Require('Class')
//@Require('Exception')
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

    var ArrayIterator   = bugpack.require('ArrayIterator');
    var Class           = bugpack.require('Class');
    var Exception       = bugpack.require('Exception');
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
     * @implements {IIterable.<I>}
     * @implements {IStreamable.<I>}
     * @template I
     */
    var Array = Class.extend(Obj, /** @lends {Array.prototype} */{

        _name: "Array",


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
            this.array  = null;
        },

        /**
         * @private
         * @param {(ICollection.<I> | Array.<I>)=} items
         */
        _initializer: function(items) {

            this._super();

            if (TypeUtil.isArray(items)) {
                this.array = items;
            } else if (Class.doesImplement(items, ICollection)){
                this.array = items.getValueArray();
            } else {
                throw new Exception("IllegalArgument", {}, "'items' must either be an Array or implement ICollection");
            }
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Array.<*>}
         */
        getArray: function() {
            return this.array;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {I} item
         */
        add: function(item) {
            this.array.push(item);
        },

        /**
         * @param {(Array.<I> | IIterable.<I>)} items
         */
        addAll: function(items) {
            var _this = this;
            items.forEach(function(item) {
                _this.add(item);
            });
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
         * @param {function(I, number)} func
         */
        forEach: function(func) {
            this.array.forEach(func);
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
            return new ArrayIterator(this);
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
         * @return {Array.<I>}
         */
        clone: function(deep) {
            var cloneArray = new Array();
            if (deep) {
                this.forEach(function(item) {
                    cloneArray.add(Obj.clone(item, true));
                });
            } else {
                cloneArray.addAll(this);
            }
            return cloneArray;
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(Array, IIterable);
    Class.implement(Array, IStreamable);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Array', Array);
});
