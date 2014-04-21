//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IEventPropagator')

//@Require('Interface')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Interface = bugpack.require('Interface');


    //-------------------------------------------------------------------------------
    // Declare Interface
    //-------------------------------------------------------------------------------

    /**
     * @interface
     */
    var IEventPropagator = Interface.declare({

        _name: "IEventPropagator",


        //-------------------------------------------------------------------------------
        // Interface Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {IEventPropagator} eventPropagator
         */
        addEventPropagator: function(eventPropagator) {},

        /**
         * @param {Event} event
         */
        propagateEvent: function(event) {},

        /**
         * @param {IEventPropagator} eventPropagator
         */
        removeEventPropagator: function(eventPropagator) {}
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('IEventPropagator', IEventPropagator);
});
