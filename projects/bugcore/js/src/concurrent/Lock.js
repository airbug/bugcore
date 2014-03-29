//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Lock')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('Queue')
//@Require('bugtrace.BugTrace')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Event           = bugpack.require('Event');
var EventDispatcher = bugpack.require('EventDispatcher');
var Queue           = bugpack.require('Queue');
var BugTrace        = bugpack.require('bugtrace.BugTrace');



//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $trace = BugTrace.$trace;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Lock = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Queue.<function()>}
         */
        this.acquisitionQueue = new Queue();

        /**
         * @private
         * @type {boolean}
         */
        this.locked = false;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    hasWaiters: function() {
        return this.acquisitionQueue.getCount() > 0;
    },

    /**
     * @return {boolean}
     */
    isLocked: function() {
        return this.locked;
    },

    /**
     * @return {boolean}
     */
    tryLock: function() {
        if (this.isLocked()) {
            return false;
        } else {
            this.acquireLock();
            return true;
        }
    },

    /**
     *
     */
    unlock: function() {
        this.releaseLock();
    },

    /**
     * @param {function(*=)=} method
     */
    waitLock: function(method) {
        this.queueAcquisition(method);
        this.processQueue();
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {function(*=)=} method
     */
    acquireLock: function(method) {
        this.locked = true;
        if (method) {
            method();
        }
    },

    /**
     * @private
     */
    processQueue: function() {
        if (!this.isLocked()) {
            if (this.acquisitionQueue.getCount() > 0) {
                var nextMethod = this.acquisitionQueue.dequeue();
                this.acquireLock(nextMethod);
            } else {
                this.dispatchEvent(new Event(Lock.EventTypes.EMPTY));
            }
        }
    },

    /**
     * @private
     * @param {function()} method
     */
    queueAcquisition: function(method) {
        this.acquisitionQueue.enqueue(method);
    },

    /**
     * @private
     */
    releaseLock: function() {
        this.locked = false;
        this.dispatchEvent(new Event(Lock.EventTypes.RELEASED));
        var _this = this;

        // NOTE BRN: We use a setTimeout here to help prevent stack overflows when it comes to the processing of the
        // queue.

        setTimeout($trace(function() {
            _this.processQueue();
        }), 0);
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
Lock.EventTypes = {
    EMPTY: "Lock:Empty",
    RELEASED: "Lock:Released"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Lock', Lock);
