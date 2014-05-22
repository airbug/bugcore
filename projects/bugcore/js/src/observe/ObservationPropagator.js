/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ObservationPropagator')

//@Require('Class')
//@Require('IObservationPropagator')
//@Require('List')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var IObservationPropagator      = bugpack.require('IObservationPropagator');
    var List                        = bugpack.require('List');
    var Obj                         = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @constructor
     * @extends {Obj}
     * @implements {IObservationPropagator}
     */
    var ObservationPropagator = Class.extend(Obj, {

        _name: "ObservationPropagator",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {List.<IObservationPropagator>}
             */
            this.observationPropagatorList  = new List();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @returns {List.<IObservationPropagator>}
         */
        getObservationPropagatorList: function() {
            return this.observationPropagatorList;
        },


        //-------------------------------------------------------------------------------
        // IObservationPropagator Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {IObservationPropagator} observationPropagator
         */
        addObservationPropagator: function(observationPropagator) {
            if (!this.observationPropagatorList.contains(observationPropagator)) {
                this.observationPropagatorList.add(observationPropagator);
            }
        },

        /**
         * @param {Change} change
         */
        propagateObservation: function(change) {
            this.observationPropagatorList.forEach(function(observationPropagator) {
                observationPropagator.propagateObservation(change);
            });
        },

        /**
         * @param {IObservationPropagator} observationPropagator
         */
        removeObservationPropagator: function(observationPropagator) {
            if (this.observationPropagatorList.contains(observationPropagator)) {
                this.observationPropagatorList.remove(observationPropagator);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(ObservationPropagator, IObservationPropagator);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ObservationPropagator', ObservationPropagator);
});
