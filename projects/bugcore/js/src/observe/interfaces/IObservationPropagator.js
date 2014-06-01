/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IObservationPropagator')

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
    var IObservationPropagator = Interface.declare({

        _name: "IObservationPropagator",


        //-------------------------------------------------------------------------------
        // Interface Methods
        //-------------------------------------------------------------------------------
    
        /**
         * @param {IObservationPropagator} observationPropagator
         */
        addObservationPropagator: function(observationPropagator) {},
    
        /**
         * @param {Observation} observation
         */
        propagateObservation: function(observation) {},
    
        /**
         * @param {IObservationPropagator} observationPropagator
         */
        removeObservationPropagator: function(observationPropagator) {}
    });
    
    
    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------
    
    bugpack.export('IObservationPropagator', IObservationPropagator);
});
