/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IList')

//@Require('ICollection')
//@Require('Interface')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ICollection     = bugpack.require('ICollection');
    var Interface       = bugpack.require('Interface');


    //-------------------------------------------------------------------------------
    // Declare Interface
    //-------------------------------------------------------------------------------

    /**
     * @interface
     * @extends {ICollection.<I>}
     * @template I
     */
    var IList = Interface.extend(ICollection, {

        _name: "IList",


        //-------------------------------------------------------------------------------
        // Interface Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {number} index
         * @param {I} item
         */
        addAt: function(index, item) {},

        /**
         * @param {number} index
         * @param {(ICollection.<I> | Array.<I>)} items
         */
        addAllAt: function(index, items) {},

        /**
         * @param {number} index
         * @return {I}
         */
        getAt: function(index) {},

        /**
         * @param {*} value
         * @return {number}
         */
        indexOfFirst: function(value) {},

        /**
         * @param {*} value
         * @return {number}
         */
        indexOfLast: function(value) {},

        /**
         * @return {I} The removed value
         */
        pop: function() {},

        /**
         * @param {I} value
         */
        prepend: function(value) {},

        /**
         * @param {I} value
         */
        push: function(value) {},

        /**
         * @param {number} index
         * @return {I} The removed item
         */
        removeAt: function(index) {},

        /**
         * @param {number} index
         * @param {I} item
         */
        set: function(index, item) {},

        /**
         * @return {I} The removed value
         */
        shift: function() {},

        /**
         * @param {number} fromIndex
         * @param {number} toIndex
         * @return {IList.<I>}
         */
        subList: function(fromIndex, toIndex) {},

        /**
         * @param {I} item
         */
        unshift: function(item) {}
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('IList', IList);
});
