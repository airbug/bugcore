//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('EventQueryListener')

//@Require('Class')
//@Require('EventListener')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var EventListener       = bugpack.require('EventListener');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventListener}
     */
    var EventQueryListener = Class.extend(EventListener, {

        _name: "EventQueryListener",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(Event)} listenerFunction
         * @param {Object} listenerContext
         * @param {boolean} once
         * @param {EventQuery} eventQuery
         */
        _constructor: function(listenerFunction, listenerContext, once, eventQuery) {

            this._super(listenerFunction, listenerContext, once);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {EventQuery}
             */
            this.eventQuery     = eventQuery;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {EventQuery}
         */
        getEventQuery: function() {
            return this.eventQuery;
        },


        //-------------------------------------------------------------------------------
        // EventListener Methods
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @param {Event} event
         */
        hearEvent: function(event) {
            var result = this.eventQuery.run(event);
            if (result) {
                this.getListenerFunction().call(this.getListenerContext(), event);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('EventQueryListener', EventQueryListener);
});
