//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('EventDispatcher')

//@Require('Class')
//@Require('EventReceiver')
//@Require('IEventDispatcher')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var EventReceiver       = bugpack.require('EventReceiver');
    var IEventDispatcher    = bugpack.require('IEventDispatcher');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventReceiver}
     * @implements {IEventDispatcher}
     */
    var EventDispatcher = Class.extend(EventReceiver, {

        _name: "EventDispatcher",


        //-------------------------------------------------------------------------------
        // IEventDispatcher Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {Event} event
         * @param {?boolean=} bubbles
         */
        dispatchEvent: function(event, bubbles) {
            if (bubbles === undefined) {
                bubbles = true;
            }
            event.setBubbles(bubbles);
            event.setTarget(this.getTarget());
            this.propagateEvent(event);
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(EventDispatcher, IEventDispatcher);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('EventDispatcher', EventDispatcher);
});
