//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('EventQueryListener')

//@Require('Class')
//@Require('EventListener')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var EventListener       = bugpack.require('EventListener');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {EventListener}
 */
var EventQueryListener = Class.extend(EventListener, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

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
