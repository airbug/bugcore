/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
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

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Interface   = bugpack.require('Interface');


    //-------------------------------------------------------------------------------
    // Declare Interface
    //-------------------------------------------------------------------------------

    /*eslint-disable no-unused-vars */
    /**
     * @interface
     * @template I
     */
    var ISupplier = Interface.declare({

        _name: 'ISupplier',


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
    /*eslint-enable no-unused-vars */


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ISupplier', ISupplier);
});
