//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('NodeJsEventEmitterAdapter')

//@Require('ArgUtil')
//@Require('Class')
//@Require('EventDispatcher')
//@Require('IEventDispatcher')
//@Require('IEventPropagator')
//@Require('IEventReceiver')
//@Require('NodeJsEvent')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgUtil             = bugpack.require('ArgUtil');
var Class               = bugpack.require('Class');
var EventDispatcher     = bugpack.require('EventDispatcher');
var IEventDispatcher    = bugpack.require('IEventDispatcher');
var IEventPropagator    = bugpack.require('IEventPropagator');
var IEventReceiver      = bugpack.require('IEventReceiver');
var NodeJsEvent         = bugpack.require('NodeJsEvent');
var Obj                 = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var NodeJsEventEmitterAdapter = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(adaptee) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {EventEmitter}
         */
        this.adaptee = adaptee;

        /**
         * @private
         * @type {EventDispatcher}
         */
        this.eventDispatcher = new EventDispatcher(adaptee);

        this.wrapAdaptee();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    getTarget: function() {
        return this.eventDispatcher.getTarget();
    },


    //-------------------------------------------------------------------------------
    // IEventPropagator Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {IEventPropagator} eventPropagator
     */
    addEventPropagator: function(eventPropagator) {
        this.eventDispatcher.addEventPropagator(eventPropagator);
    },

    /**
     * @param {Event} event
     */
    propagateEvent: function(event) {
        if (Class.doesExtend(event, NodeJsEvent)) {
            this.adapteeEmitEvent(event);
        } else {
            this.eventDispatcher.propagateEvent(event);
        }
    },

    /**
     * @param {IEventPropagator} eventPropagator
     */
    removeEventPropagator: function(eventPropagator) {
        this.eventDispatcher.removeEventPropagator(eventPropagator);
    },


    //-------------------------------------------------------------------------------
    // IEventDispatcher Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {IEventPropagator}
     */
    getParentPropagator: function() {
        return this.eventDispatcher.getParentPropagator();
    },

    /**
     * @param {IEventPropagator} parentPropagator
     */
    setParentPropagator: function(parentPropagator) {
        this.eventDispatcher.setParentPropagator(parentPropagator);
    },

    /**
     * @param {string} eventType
     * @param {function(Event)} listenerFunction
     * @param {?Object=} listenerContext (optional)
     * @param {?boolean=} once (optional)
     */
    addEventListener: function(eventType, listenerFunction, listenerContext, once) {
        this.eventDispatcher.addEventListener(eventType, listenerFunction, listenerContext, once);
    },

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

        if (Class.doesExtend(event, NodeJsEvent)) {
            this.adapteeEmitEvent(event);
        } else {
            this.eventDispatcher.propagateEvent(event);
        }
    },

    /**
     * @param {string} eventType
     * @param {function(Event)} listenerFunction
     * @param {?Object=} listenerContext (optional)
     */
    hasEventListener: function(eventType, listenerFunction, listenerContext) {
        return this.eventDispatcher.hasEventListener(eventType, listenerFunction, listenerContext);
    },

    /**
     * @param {string} eventType
     * @param {function(Event)} listenerFunction
     * @param {} listenerContext
     */
    onceOn: function(eventType, listenerFunction, listenerContext) {
        this.addEventListener(eventType, listenerFunction, listenerContext, true);
    },

    /**
     * @param {string} eventType
     * @param {function(Event)} listenerFunction
     * @param {?Object=} listenerContext
     */
    removeEventListener: function(eventType, listenerFunction, listenerContext) {
        this.eventDispatcher.removeEventListener(eventType, listenerFunction, listenerContext);
    },

    /**
     *
     */
    removeAllListeners: function() {
        this.eventDispatcher.removeAllListeners();
        this.adaptee.removeAllListeners();
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    off: function() {
        this.removeEventListener.apply(this, arguments);
    },

    /**
     *
     */
    on: function() {
        this.addEventListener.apply(this, arguments);
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {NodeJsEvent} event
     */
    adapteeEmitEvent: function(event) {
        this.adaptee.emit(event);
    },

    /**
     * @private
     */
    wrapAdaptee: function() {
        var _this = this;
        this.adaptee.emit = (function(adaptee, originalEmit) {
            return function() {
                var args = ArgUtil.toArray(arguments);
                var firstArg = args.shift();
                var nodeJsEvent = null;
                var emitArgs = null;

                if (Class.doesExtend(firstArg, NodeJsEvent)) {
                    nodeJsEvent = firstArg;
                    emitArgs = ([nodeJsEvent.getType()]).concat(nodeJsEvent.getArguments());
                } else {
                    nodeJsEvent = new NodeJsEvent(firstArg, args);
                    emitArgs = ([firstArg]).concat(args);
                }
                originalEmit.apply(_this.adaptee, emitArgs);
                _this.eventDispatcher.propagateEvent(nodeJsEvent);
            };
        })(this.adaptee, this.adaptee.emit);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(NodeJsEventEmitterAdapter, IEventDispatcher);
Class.implement(NodeJsEventEmitterAdapter, IEventPropagator);
Class.implement(NodeJsEventEmitterAdapter, IEventReceiver);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('NodeJsEventEmitterAdapter', NodeJsEventEmitterAdapter);
