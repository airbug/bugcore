//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('EventQueryBuilder')

//@Require('Class')
//@Require('EventQuery')
//@Require('EventQueryListener')
//@Require('Obj')
//@Require('QueryBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var EventQuery              = bugpack.require('EventQuery');
var EventQueryListener      = bugpack.require('EventQueryListener');
var Obj                     = bugpack.require('Obj');
var QueryBuilder            = bugpack.require('QueryBuilder');


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {QueryBuilder}
 */
var EventQueryBuilder = Class.extend(QueryBuilder, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {EventReceiver} eventReceiver
     * @param {(string | Array.<string>)} eventTypes
     */
    _constructor: function(eventReceiver, eventTypes) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {EventReceiver}
         */
        this.eventReceiver  = eventReceiver;

        /**
         * @private
         * @type {(string | Array.<string>)}
         */
        this.eventTypes     = eventTypes;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {EventReceiver}
     */
    getEventReceiver: function() {
        return this.eventReceiver;
    },

    /**
     * @return {string|Array.<string>}
     */
    getEventTypes: function() {
        return this.eventTypes;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Event)} listenerFunction
     * @param {?Object=} listenerContext (optional)
     * @param {?boolean=} once (optional)
     */
    call: function(listenerFunction, listenerContext, once) {
        var eventQuery          = this.build();
        var eventQueryListener  = new EventQueryListener(listenerFunction, listenerContext, once, eventQuery);
        this.eventReceiver.attachEventListenerToTypes(this.eventTypes, eventQueryListener);
    },

    /**
     * @return {EventQuery}
     */
    build: function() {
        var eventQuery = new EventQuery();
        this.getConditionBuilderSet().forEach(function(conditionBuilder) {
            var condition = conditionBuilder.buildCondition();
            eventQuery.addCondition(condition);
        });
        return eventQuery;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('EventQueryBuilder', EventQueryBuilder);
