/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IIndexValueIterable')

//@Require('IIterable')
//@Require('Interface')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var IIterable   = bugpack.require('IIterable');
    var Interface   = bugpack.require('Interface');


    //-------------------------------------------------------------------------------
    // Declare Interface
    //-------------------------------------------------------------------------------

    /**
     * @interface
     * @extends {IIterable.<V>}
     * @template V
     */
    var IIndexValueIterable = Interface.extend(IIterable, {

        _name: "IIterableIndex",


        //-------------------------------------------------------------------------------
        // Interface Methods
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @param {function(V, number)} func
         */
        forEach: function(func) {},

        /**
         * @param {function(number, V)} func
         */
        forIn: function(func) {},

        /**
         * @override
         * @return {IIndexValueIterator.<V>}
         */
        iterator: function() {}
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('IIndexValueIterable', IIndexValueIterable);
});
