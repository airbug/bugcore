/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IEventReceiver')

//@Require('Interface')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Interface           = bugpack.require('Interface');


    //-------------------------------------------------------------------------------
    // Declare Interface
    //-------------------------------------------------------------------------------

    /**
     * @interface
     */
    var IEventReceiver = Interface.declare({

        _name: "IEventReceiver",


        //-------------------------------------------------------------------------------
        // Interface Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {IEventPropagator}
         */
        getParentPropagator: function() {},

        /**
         * @param {IEventPropagator} parentPropagator
         */
        setParentPropagator: function(parentPropagator) {},

        /**
         * @param {(string | Array.<string>)} eventTypes
         * @param {function(Event)=} listenerFunction
         * @param {(Object | boolean)=} listenerContext
         * @param {boolean=} once
         * @return {(undefined | EventQueryBuilder)}
         */
        addEventListener: function(eventTypes, listenerFunction, listenerContext, once) {},

        /**
         * @param {string} eventType
         * @param {function(Event)} listenerFunction
         * @param {Object=} listenerContext
         */
        hasEventListener: function(eventType, listenerFunction, listenerContext) {},

        /**
         *
         */
        removeAllListeners: function() {},

        /**
         * @param {string} eventType
         * @param {function(Event)} listenerFunction
         * @param {Object=} listenerContext
         */
        removeEventListener: function(eventType, listenerFunction, listenerContext) {}
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('IEventReceiver', IEventReceiver);
});
