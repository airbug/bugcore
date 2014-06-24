/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IIterable')

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
    var IIterable = Interface.declare({

        _name: "IIterable",


        //-------------------------------------------------------------------------------
        // Interface Methods
        //-------------------------------------------------------------------------------

        /**
         * NOTE BRN: If a value is modified in one iteration and then visited at a later time, its value in the loop is
         * its value at that later time. A value that is deleted before it has been visited will not be visited later.
         * Values added to the Collection over which iteration is occurring may either be visited or omitted from iteration.
         * In general it is best not to add, modify or remove values from the Collection during iteration, other than the
         * value currently being visited. There is no guarantee whether or not an added value will be visited, whether
         * a modified value (other than the current one) will be visited before or after it is modified, or whether a
         * deleted value will be visited before it is deleted.
         *
         * @param {function(I)} func
         */
        forEach: function(func) {},

        /**
         * @return {IIterator.<I>}
         */
        iterator: function() {}
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('IIterable', IIterable);
});
