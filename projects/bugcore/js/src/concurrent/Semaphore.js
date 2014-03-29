//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Semaphore')

//@Require('Class')
//@Require('Obj')
//@Require('Queue')
//@Require('bugtrace.BugTrace')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var Queue       = bugpack.require('Queue');
var BugTrace    = bugpack.require('bugtrace.BugTrace');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $trace = BugTrace.$trace;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Semaphore = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(numberPermits) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Queue.<function()>}
         */
        this.acquisitionQueue       = new Queue();

        /**
         * @private
         * @type {number}
         */
        this.numberPermitsAcquired  = 0;

        /**
         * @private
         * @type {number}
         */
        this.numberPermits          = numberPermits;
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function()} method
     */
    acquire: function(method) {
        this.queueAcquisition(method);
        this.processQueue();
    },

    /**
     *
     */
    release: function() {
        this.releasePermit();
    },


    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    acquirePermit: function(method) {
        this.numberPermitsAcquired++;
        method();
    },

    /**
     * @private
     */
    processQueue: function() {
        while (this.numberPermitsAcquired < this.numberPermits && this.acquisitionQueue.getCount() > 0) {
            var nextMethod = this.acquisitionQueue.dequeue();
            this.acquirePermit(nextMethod);
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
    releasePermit: function() {
        this.numberPermitsAcquired--;
        var _this = this;

        // NOTE BRN: We use a setTimeout here to help prevent stack overflows when it comes to the processing of the
        // queue.

        setTimeout($trace(function() {
            _this.processQueue();
        }), 0);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Semaphore', Semaphore);
