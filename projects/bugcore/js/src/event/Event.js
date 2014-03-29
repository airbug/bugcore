//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Event')

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
var Event = Class.extend(Obj, /** @lends {Event.prototype} */{

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} type
     * @param {*} data
     */
    _constructor: function(type, data) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.bubbles = true;

        /**
         * @private
         * @type {*}
         */
        this.currentTarget = null;

        /**
         * @private
         * @type {*}
         */
        this.data = data;

        /**
         * @private
         * @type {boolean}
         */
        this.propagationStopped = false;

        /**
         * @private
         * @type {*}
         */
        this.target = undefined;

        /**
         * @private
         * @type {string}
         */
        this.type = type;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @return {boolean}
     */
    getBubbles: function() {
        return this.bubbles;
    },

    /**
     * @param {boolean} bubbles
     */
    setBubbles: function(bubbles) {
        this.bubbles = bubbles;
    },

    /**
     * @return {*}
     */
    getCurrentTarget: function() {
        return this.currentTarget;
    },

    /**
     * @param {*} currentTarget
     */
    setCurrentTarget: function(currentTarget) {
        this.currentTarget = currentTarget;
    },

    /**
     * @return {*}
     */
    getData: function() {
        return this.data;
    },

    /**
     * @return {*}
     */
    getTarget: function() {
        return this.target;
    },

    /**
     * @param {*} target
     */
    setTarget: function(target) {
        this.target = target;
    },

    /**
     * @return {string}
     */
    getType: function() {
        return this.type;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    isPropagationStopped: function() {
        return this.propagationStopped
    },

    /**
     * Prevents an further processing event listeners on parent nodes. All event listeners on the current node will be
     * executed though.
     */
    stopPropagation: function() {
        this.propagationStopped = true;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Event', Event);
