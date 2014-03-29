//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('EventDispatcher')

//@Require('Class')
//@Require('EventReceiver')
//@Require('IEventDispatcher')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var EventReceiver       = bugpack.require('EventReceiver');
var IEventDispatcher    = bugpack.require('IEventDispatcher');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EventDispatcher = Class.extend(EventReceiver, {

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
