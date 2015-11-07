/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('WeightedListIterator')

//@Require('Class')
//@Require('Exception')
//@Require('IIndexValueIterator')
//@Require('Obj')
//@Require('ReflectArrayIterator')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Exception               = bugpack.require('Exception');
    var IIndexValueIterator     = bugpack.require('IIndexValueIterator');
    var Obj                     = bugpack.require('Obj');
    var ReflectArrayIterator    = bugpack.require('ReflectArrayIterator');
    var TypeUtil                = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IIndexValueIterator.<V>}
     * @template V
     */
    var WeightedListIterator = Class.extend(Obj, {

        _name: "WeightedListIterator",


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
             * @type {ReflectArrayIterator.<V>}
             */
            this.reflectArrayIterator   = null;

            /**
             * @private
             * @type {WeightedList.<V>}
             */
            this.weightedList           = null;
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {WeightedList.<V>} weightedList
         */
        init: function(weightedList) {
            var _this = this._super();
            if (_this) {
                this.weightedList = weightedList;
                this.reflectArrayIterator = new ReflectArrayIterator(this.getWeightedList().getItemReflectArray());
            }
            return _this;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {ReflectArrayIterator.<V>}
         */
        getReflectArrayIterator: function() {
            return this.reflectArrayIterator;
        },

        /**
         * @return {WeightedList.<V>}
         */
        getWeightedList: function() {
            return this.weightedList;
        },


        //-------------------------------------------------------------------------------
        // IIndexValueIterator Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        hasNext: function() {
            return this.reflectArrayIterator.hasNext();
        },

        /**
         * @return {V}
         */
        next: function() {
            var index = this.nextIndex();
            return this.weightedList.getAt(index).getValue();
        },

        /**
         * @return {number}
         */
        nextIndex: function() {
            return this.reflectArrayIterator.nextIndex();
        },

        /**
         * @return {{
         *      index: number
         *      value: V
         * }}
         */
        nextIndexValuePair: function() {
            var index = this.nextIndex();
            var value = this.weightedList.getAt(index);
            return {
                index: index,
                value: value
            };
        },

        /**
         * @return {V}
         */
        nextValue: function() {
            return this.next();
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(WeightedListIterator, IIndexValueIterator);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('WeightedListIterator', WeightedListIterator);
});
