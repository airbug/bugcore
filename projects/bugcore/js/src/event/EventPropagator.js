//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('EventPropagator')

//@Require('Class')
//@Require('IEventPropagator')
//@Require('List')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var IEventPropagator    = bugpack.require('IEventPropagator');
var List                = bugpack.require('List');
var Obj                 = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 * @implements {IEventPropagator}
 */
var EventPropagator = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {*} target
     */
    _constructor: function(target) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {List.<IEventPropagator>}
         */
        this.eventPropagatorList    = new List();

        /**
         * @private
         * @type {*}
         */
        this.target                 = target ? target : this;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @returns {List.<IEventPropagator>}
     */
    getEventPropagatorList: function() {
        return this.eventPropagatorList;
    },

    /**
     * @return {*}
     */
    getTarget: function() {
        return this.target;
    },


    //-------------------------------------------------------------------------------
    // IEventPropagator Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {IEventPropagator} eventPropagator
     */
    addEventPropagator: function(eventPropagator) {
        if (!this.eventPropagatorList.contains(eventPropagator)) {
            this.eventPropagatorList.add(eventPropagator);
        }
    },

    /**
     * @param {Event} event
     */
    propagateEvent: function(event) {
        if (!event.isPropagationStopped()) {
            event.setCurrentTarget(this.getTarget());
            this.eventPropagatorList.forEach(function(eventPropagator) {
                eventPropagator.propagateEvent(event);
            });
        }
    },

    /**
     * @param {IEventPropagator} eventPropagator
     */
    removeEventPropagator: function(eventPropagator) {
        if (this.eventPropagatorList.contains(eventPropagator)) {
            this.eventPropagatorList.remove(eventPropagator);
        }
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(EventPropagator, IEventPropagator);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('EventPropagator', EventPropagator);
