//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('EventListener')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
var EventListener = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {function(Event)} listenerFunction
     * @param {Object=} listenerContext
     * @param {boolean=} once
     */
    _constructor: function(listenerFunction, listenerContext, once) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {function(Event)}
         */
        this.listenerFunction   = listenerFunction;

        /**
         * @private
         * @type {Object}
         */
        this.listenerContext    = listenerContext;

        /**
         * @private
         * @type {boolean}
         */
        this.once               = once;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    getListenerContext: function() {
        return this.listenerContext;
    },

    /**
     * @return {function(Event)}
     */
    getListenerFunction: function() {
        return this.listenerFunction;
    },

    /**
     * @return {boolean}
     */
    getOnce: function() {
        return this.once;
    },

    /**
     * @return {boolean}
     */
    isOnce: function(){
        return this.getOnce();
    },


    //-------------------------------------------------------------------------------
    // Obj Methods
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, EventListener)) {
            return (Obj.equals(value.getListenerFunction(), this.listenerFunction) && Obj.equals(value.getListenerContext(), this.listenerContext));
        }
        return false;
    },

    /**
     * @override
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[EventListener]" +
                Obj.hashCode(this.listenerFunction) + "_" +
                Obj.hashCode(this.listenerContext));
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Event} event
     */
    hearEvent: function(event) {
        this.listenerFunction.call(this.listenerContext, event);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('EventListener', EventListener);
