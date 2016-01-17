/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IKeyValueIterator')

//@Require('IIterator')
//@Require('Interface')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var IIterator   = bugpack.require('IIterator');
    var Interface   = bugpack.require('Interface');


    //-------------------------------------------------------------------------------
    // Declare Interface
    //-------------------------------------------------------------------------------

    /**
     * @interface
     * @extends {IIterator.<V>}
     * @template K, V
     */
    var IKeyValueIterator = Interface.extend(IIterator, {

        _name: "IKeyValueIterator",


        //-------------------------------------------------------------------------------
        // Interface Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        hasNext: function() {},

        /**
         * @return {K}
         */
        nextKey: function() {},

        /**
         * @return {{
         *      key: K
         *      value: V
         * }}
         */
        nextKeyValuePair: function() {},

        /**
         * @return {V}
         */
        nextValue: function() {}
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('IKeyValueIterator', IKeyValueIterator);
});
