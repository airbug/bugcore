/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ISupplier')

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
    var ISupplier = Interface.declare({

        _name: "ISupplier",


        //-------------------------------------------------------------------------------
        // Interface Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {IConsumer.<I>} consumer
         */
        addConsumer: function(consumer) {},

        /**
         * @return {Supplier.Mode}
         */
        getMode: function() {},

        /**
         * @return {boolean}
         */
        isStarted: function() {},

        /**
         * @param {Supplier.Mode} mode
         */
        supply: function(mode) {}
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ISupplier', ISupplier);
});
