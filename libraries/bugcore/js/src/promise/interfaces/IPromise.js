/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IPromise')

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
     */
    var IPromise = Interface.declare({

        _name: "IPromise",


        //-------------------------------------------------------------------------------
        // Interface Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(...):*=} catchFunction
         * @return {Promise}
         */
        'catch': function(catchFunction) {},

        /**
         * @param {function():*=} finallyFunction
         * @return {Promise}
         */
        'finally': function(finallyFunction) {},

        /**
         * @param {function(...):*=} fulfilledFunction
         * @param {function(...):*=} rejectedFunction
         * @return {Promise}
         */
        then: function(fulfilledFunction, rejectedFunction) {}
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('IPromise', IPromise);
});
