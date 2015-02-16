/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Observation')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Observation = Class.extend(Obj, {

        _name: "Observation",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Change} change
         * @param {string} observationPath
         */
        _constructor: function(change, observationPath) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Change}
             */
            this.change                 = change;

            /**
             * @private
             * @type {IObservable}
             */
            this.changingObservable     = null;

            /**
             * @private
             * @type {string}
             */
            this.observationPath        = observationPath;

            /**
             * @private
             * @type {IObservable}
             */
            this.reportingObservable    = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Change}
         */
        getChange: function() {
            return this.change;
        },

        /**
         * @return {IObservable}
         */
        getChangingObservable: function() {
            return this.changingObservable;
        },

        /**
         * @param {IObservable} changingObservable
         */
        setChangingObservable: function(changingObservable) {
            this.changingObservable = changingObservable;
        },

        /**
         * @return {string}
         */
        getObservationPath: function() {
            return this.observationPath;
        },

        /**
         * @param {string} observationPath
         */
        setObservationPath: function(observationPath) {
            this.observationPath = observationPath;
        },

        /**
         * @return {IObservable}
         */
        getReportingObservable: function() {
            return this.reportingObservable;
        },

        /**
         * @param {IObservable} reportingObservable
         */
        setReportingObservable: function(reportingObservable) {
            this.reportingObservable = reportingObservable;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getChangeType: function() {
            return this.change.getChangeType();
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean=} deep
         * @return {Observation}
         */
        clone: function(deep) {
            var change = this.getChange();
            if (deep) {
                change = Obj.clone(change, deep);
            }
            return new Observation(change, this.getObservationPath());
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Observation', Observation);
});
