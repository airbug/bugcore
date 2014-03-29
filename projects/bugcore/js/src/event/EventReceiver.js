//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('EventReceiver')

//@Require('Class')
//@Require('EventListener')
//@Require('EventPropagator')
//@Require('EventQueryBuilder')
//@Require('IEventReceiver')
//@Require('MultiListMap')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var EventListener       = bugpack.require('EventListener');
var EventPropagator     = bugpack.require('EventPropagator');
var EventQueryBuilder   = bugpack.require('EventQueryBuilder');
var IEventReceiver      = bugpack.require('IEventReceiver');
var MultiListMap        = bugpack.require('MultiListMap');
var TypeUtil            = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {EventPropagator}
 * @implements {IEventReceiver}
 */
var EventReceiver = Class.extend(EventPropagator, /** @lends {EventReceiver.prototype} */{

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {*} target
     */
    _constructor: function(target) {

        this._super(target);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MultiListMap.<string, EventListener>}
         */
        this.eventTypeListenerMap   = new MultiListMap();

        /**
         * @private
         * @type {IEventPropagator}
         */
        this.parentPropagator       = undefined;
    },


    //-------------------------------------------------------------------------------
    // IEventReceiver Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {IEventPropagator}
     */
    getParentPropagator: function() {
        return this.parentPropagator;
    },

    /**
     * @param {IEventPropagator} parentPropagator
     */
    setParentPropagator: function(parentPropagator) {
        this.parentPropagator = parentPropagator;
    },

    /**
     * @param {(string | Array.<string>)} eventTypes
     * @param {function(Event)=} listenerFunction
     * @param {Object=} listenerContext (optional)
     * @param {boolean=} once (optional)
     * @return {(undefined | EventQueryBuilder)}
     */
    addEventListener: function(eventTypes, listenerFunction, listenerContext, once) {
        if (eventTypes && !listenerFunction) {
            return this.generateEventQueryBuilder(eventTypes);
        } else {
            this.buildEventListener(eventTypes, listenerFunction, listenerContext, once);
        }
    },

    /**
     * @param {string} eventType
     * @param {function(Event)} listenerFunction
     * @param {?Object=} listenerContext (optional)
     */
    hasEventListener: function(eventType, listenerFunction, listenerContext) {
        var eventTypeListenerList = this.eventTypeListenerMap.get(eventType);
        if (eventTypeListenerList) {
            var eventListener = this.factoryEventListener(listenerFunction, listenerContext);
            return eventTypeListenerList.contains(eventListener);
        }
        return false;
    },

    /**
     * @param {string} eventType
     * @return {boolean}
     */
    isListening: function(eventType) {
        return this.eventTypeListenerMap.containsKey(eventType);
    },

    /**
     * @param {(string | Array.<string>)} eventTypes
     * @param {function(Event)} listenerFunction
     * @param {Object} listenerContext
     * @return {(undefined | EventQuery)}
     */
    onceOn: function(eventTypes, listenerFunction, listenerContext) {
        return this.addEventListener(eventTypes, listenerFunction, listenerContext, true);
    },

    /**
     * @param {(string | Array.<string>)} eventTypes
     * @param {function(Event)} listenerFunction
     * @param {?Object=} listenerContext
     */
    removeEventListener: function(eventTypes, listenerFunction, listenerContext) {
        var eventListener = this.factoryEventListener(listenerFunction, listenerContext);
        this.detachEventListenerFromTypes(eventTypes, eventListener);
    },

    /**
     *
     */
    removeAllListeners: function() {
        this.eventTypeListenerMap.clear();
    },


    //-------------------------------------------------------------------------------
    // EventPropagator Methods
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @param {Event} event
     */
    propagateEvent: function(event) {
        if (!event.isPropagationStopped()) {
            event.setCurrentTarget(this.getTarget());
            this.propagateEventToListeners(event);
            this.propagateEventToPropagators(event);
            if (event.getBubbles()) {
                this.bubbleEvent(event);
            }
        }
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} eventType
     * @param {EventListener} eventListener
     */
    attachEventListener: function(eventType, eventListener) {
        var eventTypeListenerList = this.eventTypeListenerMap.get(eventType);
        if (!eventTypeListenerList) {
            this.eventTypeListenerMap.put(eventType, eventListener);
        } else if (!eventTypeListenerList.contains(eventListener)) {
            eventTypeListenerList.add(eventListener);
        }
    },

    /**
     * @param {(string | Array.<string>)} eventTypes
     * @param {EventListener} eventListener
     */
    attachEventListenerToTypes: function(eventTypes, eventListener) {
        var _this = this;
        if (TypeUtil.isArray(eventTypes)) {
            eventTypes.forEach(function(eventType) {
                _this.attachEventListener(eventType, eventListener);
            });
        } else {
            this.attachEventListener(eventTypes, eventListener);
        }
    },

    /**
     * @param {string} eventType
     * @param {EventListener} eventListener
     */
    detachEventListener: function(eventType, eventListener) {
        this.eventTypeListenerMap.removeKeyValuePair(eventType, eventListener);
    },

    /**
     * @param {(string | Array.<string>)} eventTypes
     * @param {EventListener} eventListener
     */
    detachEventListenerFromTypes: function(eventTypes, eventListener) {
        var _this = this;
        if (TypeUtil.isArray(eventTypes)) {
            eventTypes.forEach(function(eventType) {
                _this.detachEventListener(eventType, eventListener);
            });
        } else {
            this.detachEventListener(eventTypes, eventListener);
        }
    },

    /**
     *
     */
    off: function() {
        return this.removeEventListener.apply(this, arguments);
    },

    /**
     *
     */
    on: function() {
        return this.addEventListener.apply(this, arguments);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    bubbleEvent: function(event) {
        var parentPropagator = this.getParentPropagator();
        if (parentPropagator) {
            parentPropagator.propagateEvent(event);
        }
    },

    /**
     * @private
     * @param {(string | Array.<string>)} eventTypes
     * @param {function(Event)} listenerFunction
     * @param {(Object | boolean)=} listenerContext
     * @param {boolean=} once
     */
    buildEventListener: function(eventTypes, listenerFunction, listenerContext, once) {
        var eventListener = this.factoryEventListener(listenerFunction, listenerContext, once);
        this.attachEventListenerToTypes(eventTypes, eventListener);
    },

    /**
     * @private
     * @param listenerFunction
     * @param {(Object | boolean)=} listenerContext
     * @param {boolean=} once
     * @return {EventListener}
     */
    factoryEventListener: function(listenerFunction, listenerContext, once) {
        if (!TypeUtil.isBoolean(once)) {
            once = false;
            if (TypeUtil.isBoolean(listenerContext)) {
                once = listenerContext;
            }
        }
        return new EventListener(listenerFunction, listenerContext, once);
    },

    /**
     * @private
     * @param {(string | Array.<string>)} eventTypes
     * @returns {EventQueryBuilder}
     */
    generateEventQueryBuilder: function(eventTypes) {
        return new EventQueryBuilder(this, eventTypes);
    },

    /**
     * @private
     * @param {Event} event
     */
    propagateEventToListeners: function(event) {
        var _this = this;
        var eventTypeListenerList = this.eventTypeListenerMap.get(event.getType());
        if (eventTypeListenerList) {

            // NOTE BRN: Clone the event listener list so that if the list is changed during execution of the listeners
            // we still execute all of the listeners.

            var cloneEventTypeListenerList = eventTypeListenerList.clone();
            cloneEventTypeListenerList.forEach(function(eventListener) {
                eventListener.hearEvent(event);
                if (eventListener.isOnce()) {
                    _this.removeEventListener(event.getType(), eventListener.getListenerFunction(), eventListener.getListenerContext());
                }
            });
        }
    },

    /**
     * @private
     * @param {Event} event
     */
    propagateEventToPropagators: function(event) {
        var cloneEventPropagatorList = this.getEventPropagatorList().clone();
        cloneEventPropagatorList.forEach(function(eventPropagator) {
            eventPropagator.propagateEvent(event);
        });
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(EventReceiver, IEventReceiver);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('EventReceiver', EventReceiver);
