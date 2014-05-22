/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Observer')

//@Require('ArgumentBug')
//@Require('Class')
//@Require('Obj')
//@Require('ObjectPathMatcher')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgumentBug         = bugpack.require('ArgumentBug');
    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var ObjectPathMatcher   = bugpack.require('ObjectPathMatcher');
    var TypeUtil            = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Observer = Class.extend(Obj, {

        _name: "Observer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} observationPathPattern
         * @param {function(Observation)} observerFunction
         * @param {Object=} observerContext
         */
        _constructor: function(observationPathPattern, observerFunction, observerContext) {

            this._super();

            if (!TypeUtil.isString(observationPathPattern)) {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "observationPathPattern", observationPathPattern, "parameter must be a string");
            }
            if (!TypeUtil.isFunction(observerFunction)) {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "observerFunction", observerFunction, "parameter must be a function");
            }

            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.observationPathPattern     = observationPathPattern;

            /**
             * @private
             * @type {ObjectPathMatcher}
             */
            this.objectPathMatcher          = new ObjectPathMatcher(this.observationPathPattern);

            /**
             * @private
             * @type {Object}
             */
            this.observerContext            = observerContext;

            /**
             * @private
             * @type {function(Observation)}
             */
            this.observerFunction           = observerFunction;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {ObjectPathMatcher}
         */
        getObjectPathMatcher: function() {
            return this.objectPathMatcher;
        },

        /**
         * @return {string}
         */
        getObservationPathPattern: function() {
            return this.observationPathPattern;
        },

        /**
         * @return {Object}
         */
        getObserverContext: function() {
            return this.observerContext;
        },

        /**
         * @return {function(Observation)}
         */
        getObserverFunction: function() {
            return this.observerFunction;
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @param {*} value
         * @return {boolean}
         */
        equals: function(value) {
            if (Class.doesExtend(value, Observer)) {
                return (Obj.equals(value.getObserverFunction(), this.getObserverFunction()) &&
                    Obj.equals(value.getObserverContext(), this.getObserverContext()) &&
                    Obj.equals(value.getObservationPathPattern(), this.getObservationPathPattern()));
            }
            return false;
        },

        /**
         * @override
         * @return {number}
         */
        hashCode: function() {
            if (!this._hashCode) {
                this._hashCode = Obj.hashCode("[Observer]" +
                    Obj.hashCode(this.getObserverFunction()) + "_" +
                    Obj.hashCode(this.getObserverContext()) + "_" +
                    Obj.hashCode(this.getObservationPathPattern()));
            }
            return this._hashCode;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} observationPath
         * @returns {boolean}
         */
        match: function(observationPath) {
            return this.objectPathMatcher.match(observationPath);
        },

        /**
         * @param {Observation} observation
         */
        observeObservation: function(observation) {
            this.getObserverFunction().call(this.getObserverContext(), observation);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Observer', Observer);
});
