/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ArrayIterator')

//@Require('Array')
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

    var Array                   = bugpack.require('Array');
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
    var ArrayIterator = Class.extend(Obj, {

        _name: "ArrayIterator",


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
            this.array      = [];

            /**
             * @private
             * @type {number}
             */
            this.index      = -1;
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<V>} array
         */
        init: function(array) {
            this._super();
            var _this = this;
            if (TypeUtil.isArray(array)) {
                this.array = array;
            }
            Array.observe(this.array, function(changes) {
                changes.forEach(function(change) {
                    if (change.removed && change.removed.length > 0) {
                        _this.handleIndexesRemoved(change.index, change.removed.length);
                    }
                    if (change.addedCount > 0) {
                        _this.handleIndexesAdded(change.index, change.addedCount);
                    }
                });
            }, ["splice"]);
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

        /**
         * @return {number}
         */
        getIndex: function() {
            return this.index;
        },


        //-------------------------------------------------------------------------------
        // IIndexValueIterator Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        hasNext: function() {
            return (this.index < (this.array.length - 1));
        },

        /**
         * @return {V}
         */
        next: function() {
            var index = this.nextIndex();
            return this.array[index];
        },

        /**
         * @return {number}
         */
        nextIndex: function() {
            if (this.hasNext()) {
                this.index++;
                return this.index;
            } else {
                throw new Exception("NoSuchElement", {}, "End of iteration reached.");
            }
        },

        /**
         * @return {{
         *      index: number
         *      value: V
         * }}
         */
        nextIndexValuePair: function() {
            var index = this.nextIndex();
            var value = this.array[index];
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
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {number} index
         * @param {number} addedCount
         */
        handleIndexesAdded: function(index, addedCount) {
            if (index <= this.index) {
                this.index += addedCount;
            }
        },

        /**
         * @private
         * @param {number} index
         * @param {number} removedCount
         */
        handleIndexesRemoved: function(index, removedCount) {
            if (index <= this.index) {
                var newIndex = this.index - removedCount;
                if (newIndex < index) {
                    newIndex = index - 1;
                }
                this.index = newIndex;
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(ArrayIterator, IIndexValueIterator);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ArrayIterator', ArrayIterator);
});
