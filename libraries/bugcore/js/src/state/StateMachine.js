/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('StateMachine')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Exception')
//@Require('Set')
//@Require('StateEvent')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var EventDispatcher     = bugpack.require('EventDispatcher');
    var Exception           = bugpack.require('Exception');
    var Set                 = bugpack.require('Set');
    var StateEvent          = bugpack.require('StateEvent');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     */
    var StateMachine = Class.extend(EventDispatcher, /** @lends {StateMachine.prototype} */{

        _name: "StateMachine",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {{
         *      states: Array.<string>,
         *      initialState: string
         * }} stateMachineConfig
         */
        _constructor: function(stateMachineConfig) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Set.<string>}
             */
            this.availableStateSet  = new Set(stateMachineConfig.states);

            /**
             * @private
             * @type {string}
             */
            this.currentState       = stateMachineConfig.initialState;

            /**
             * @private
             * @type {string}
             */
            this.movingToState      = stateMachineConfig.initialState;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Set.<string>}
         */
        getAvailableStateSet: function() {
            return this.availableStateSet;
        },

        /**
         * @return {string}
         */
        getCurrentState: function() {
            return this.currentState;
        },

        /**
         * @return {string}
         */
        getMovingToState: function() {
            return this.movingToState;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} state
         */
        changeState: function(state) {
            if (!this.availableStateSet.contains(state)) {
                throw new Exception("StateDoesNotExist", {}, "state '" + state + "' does not exist in the StateMachine");
            }
            if (this.currentState !== state) {
                var previousState = this.currentState;
                this.dispatchStateChanged(previousState);
                this.currentState = state;
            }
        },

        /**
         * @param {string} state
         * @return {boolean}
         */
        isState: function(state) {
            return this.currentState === state;
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {string} previousState
         */
        dispatchStateChanged: function(previousState) {
            this.dispatchEvent(new StateEvent(StateEvent.EventTypes.STATE_CHANGED, previousState, this.currentState));
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('StateMachine', StateMachine);
});
