/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IKeyValueIterable')

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
     * @template K, V
     */
    var IKeyValueIterable = Interface.extend(IIterable, {

        _name: "IKeyValueIterable",


        //-------------------------------------------------------------------------------
        // Interface Methods
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @param {function(V, K)} func
         */
        forEach: function(func) {},

        /**
         * @param {function(K, V)} func
         */
        forIn: function(func) {},

        /**
         * @override
         * @return {IKeyValueIterator.<K, V>}
         */
        iterator: function() {}
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('IKeyValueIterable', IKeyValueIterable);
});
