/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ICollection')

//@Require('Interface')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Interface   = bugpack.require('Interface');


    //-------------------------------------------------------------------------------
    // Declare Interface
    //-------------------------------------------------------------------------------

    /**
     * @interface
     * @template I
     */
    var ICollection = Interface.declare({

        _name: "ICollection",


        //-------------------------------------------------------------------------------
        // Interface Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {I} item
         * @return {boolean}
         */
        add: function(item) {},

        /**
         * @param {(ICollection.<I> | Array.<I>)} items
         */
        addAll: function(items) {},

        /**
         *
         */
        clear: function() {},

        /**
         * @param {*} value
         * @return {boolean}
         */
        contains: function(value) {},

        /**
         * Multiple elements are ignored in this function.
         * e.g. Collection[0,1] containsAll Collection[0,1,1,1] is true
         * If you want to check for exact equality, use the equals function.
         * Empty collections are always contained by another collection
         * e.g. Collection[0,1] containsAll Collection[] is true
         * @param {(ICollection.<*> | Array.<*>)} values
         * @return {boolean}
         */
        containsAll: function(values) {},

        /**
         * @param {(ICollection.<*> | Array.<*>)} values
         * @return {boolean}
         */
        containsEqual: function(values) {},

        /**
         * @return {number}
         */
        getCount: function() {},

        /**
         * @return {Array.<I>}
         */
        getValueArray: function() {},

        /**
         * @param {*} value
         * @return {number}
         */
        getValueCount: function(value) {},

        /**
         * @return {boolean}
         */
        isEmpty: function() {},

        /**
         * @param {*} value
         * @return {boolean}
         */
        remove: function(value) {},

        /**
         * @param {(ICollection.<*> | Array.<*>)} values
         */
        removeAll: function(values) {}
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ICollection', ICollection);
});
