/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Arr')

//@Require('ArrayIterator')
//@Require('Class')
//@Require('Exception')
//@Require('ICollection')
//@Require('IIndexValueIterable')
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

    var ArrayIterator           = bugpack.require('ArrayIterator');
    var Class                   = bugpack.require('Class');
    var Exception               = bugpack.require('Exception');
    var ICollection             = bugpack.require('ICollection');
    var IIndexValueIterable     = bugpack.require('IIndexValueIterable');
    var IStreamable             = bugpack.require('IStreamable');
    var Obj                     = bugpack.require('Obj');
    var Stream                  = bugpack.require('Stream');
    var Suppliers               = bugpack.require('Suppliers');
    var TypeUtil                = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IIndexValueIterable.<V>}
     * @implements {IStreamable.<V>}
     * @template V
     */
    var Arr = Class.extend(Obj, /** @lends {Arr.prototype} */{

        _name: "Arr",


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
             * @type {Array.<V>}
             */
            this.array  = null;
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {(ICollection.<V> | Array.<V>)=} items
         * @return {Arr}
         */
        init: function(items) {

            this._super();

            if (TypeUtil.isArray(items)) {
                this.array = items;
            } else if (Class.doesImplement(items, ICollection)){
                this.array = items.getValueArray();
            } else {
                throw new Exception("IllegalArgument", {}, "'items' must either be an Array or implement ICollection");
            }
            return this;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Array.<V>}
         */
        getArray: function() {
            return this.array;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {V} item
         */
        add: function(item) {
            this.array.push(item);
        },

        /**
         * @param {(Array.<V> | IIterable.<V>)} items
         */
        addAll: function(items) {
            var _this = this;
            items.forEach(function(item) {
                _this.add(item);
            });
        },


        //-------------------------------------------------------------------------------
        // IIndexValueIterable Implementation
        //-------------------------------------------------------------------------------

        /**
         * NOTE BRN: If a value is modified in one iteration and then visited at a later time, its value in the loop is
         * its value at that later time. A value that is deleted before it has been visited will not be visited later.
         * Values added to the Collection over which iteration is occurring may either be visited or omitted from iteration.
         *
         * @param {function(V, number)} func
         */
        forEach: function(func) {
            var iterator = this.iterator();
            while (iterator.hasNext()) {
                var index = iterator.nextIndex();
                func(this.array[index], index);
            }
        },

        /**
         * NOTE BRN: If a value is modified in one iteration and then visited at a later time, its value in the loop is
         * its value at that later time. A value that is deleted before it has been visited will not be visited later.
         * Values added to the Collection over which iteration is occurring may either be visited or omitted from iteration.
         *
         * @param {function(number, V)} func
         */
        forIn: function(func) {
            var iterator = this.iterator();
            while (iterator.hasNext()) {
                var index = iterator.nextIndex();
                func(index, this.array[index]);
            }
        },

        /**
         * NOTE BRN: If a value is modified in one iteration and then visited at a later time, its value in the loop is
         * its value at that later time. A value that is deleted before it has been visited will not be visited later.
         * Values added to the Collection over which iteration is occurring may either be visited or omitted from iteration.
         *
         * @return {IIndexValueIterator.<V>}
         */
        iterator: function() {
            return new ArrayIterator(this.array);
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
         * @return {Arr.<I>}
         */
        clone: function(deep) {
            var cloneArr = new Arr();
            if (deep) {
                this.forEach(function(item) {
                    cloneArr.add(Obj.clone(item, true));
                });
            } else {
                cloneArr.addAll(this);
            }
            return cloneArr;
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(Arr, IIndexValueIterable);
    Class.implement(Arr, IStreamable);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Arr', Arr);
});
