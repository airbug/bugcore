/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('WeightedListIterator')

//@Require('ArrayIterator')
//@Require('Class')
//@Require('Exception')
//@Require('IIndexValueIterator')
//@Require('Obj')
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
    var IIndexValueIterator     = bugpack.require('IIndexValueIterator');
    var Obj                     = bugpack.require('Obj');
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
             * @type {ArrayIterator.<V>}
             */
            this.arrayIterator      = null;

            /**
             * @private
             * @type {WeightedList.<V>}
             */
            this.weightedList       = null;
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {WeightedList.<V>} weightedList
         */
        init: function(weightedList) {
            this._super();
            this.weightedList = weightedList;
            this.arrayIterator = new ArrayIterator(this.getWeightedList().getItemArray());
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {ArrayIterator.<V>}
         */
        getArrayIterator: function() {
            return this.arrayIterator;
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
            return this.arrayIterator.hasNext();
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
            return this.arrayIterator.nextIndex();
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
