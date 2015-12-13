/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('NotifyingArrayIterator')

//@Require('Class')
//@Require('Exception')
//@Require('IIndexValueIterator')
//@Require('Obj')
//@Require('NotifyingArray')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Exception               = bugpack.require('Exception');
    var IIndexValueIterator     = bugpack.require('IIndexValueIterator');
    var Obj                     = bugpack.require('Obj');
    var NotifyingArray          = bugpack.require('NotifyingArray');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IIndexValueIterator.<V>}
     * @template V
     */
    var NotifyingArrayIterator = Class.extend(Obj, {

        _name: 'NotifyingArrayIterator',


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
             * @type {number}
             */
            this.index              = -1;

            /**
             * @private
             * @type {NotifyingArray.<V>}
             */
            this.reflectArray       = new NotifyingArray([]);
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {NotifyingArray.<V>} reflectArray
         * @return {NotifyingArrayIterator}
         */
        init: function(reflectArray) {
            var _this = this._super();
            if (_this) {
                if (Class.doesExtend(reflectArray, NotifyingArray)) {
                    this.reflectArray = reflectArray;
                }
                this.reflectArray.observe(function (changes) {
                    changes.forEach(function (change) {
                        if (change.removed && change.removed.length > 0) {
                            _this.handleIndexesRemoved(change.index, change.removed.length);
                        }
                        if (change.addedCount > 0) {
                            _this.handleIndexesAdded(change.index, change.addedCount);
                        }
                    });
                }, ['splice']);
            }
            return this;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {number}
         */
        getIndex: function() {
            return this.index;
        },

        /**
         * @return {NotifyingArray.<V>}
         */
        getNotifyingArray: function() {
            return this.reflectArray;
        },


        //-------------------------------------------------------------------------------
        // IIndexValueIterator Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        hasNext: function() {
            return (this.index < (this.reflectArray.getLength() - 1));
        },

        /**
         * @return {V}
         */
        next: function() {
            var index = this.nextIndex();
            return this.reflectArray.getAt(index);
        },

        /**
         * @return {number}
         */
        nextIndex: function() {
            if (this.hasNext()) {
                this.index++;
                return this.index;
            } else {
                throw new Exception('NoSuchElement', {}, 'End of iteration reached.');
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
            var value = this.reflectArray.getAt(index);
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

    Class.implement(NotifyingArrayIterator, IIndexValueIterator);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('NotifyingArrayIterator', NotifyingArrayIterator);
});
