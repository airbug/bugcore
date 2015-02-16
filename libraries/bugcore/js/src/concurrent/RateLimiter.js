/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('RateLimiter')

//@Require('Class')
//@Require('Func')
//@Require('Obj')
//@Require('Queue')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Func    = bugpack.require('Func');
    var Obj     = bugpack.require('Obj');
    var Queue   = bugpack.require('Queue');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var RateLimiter = Class.extend(Obj, {

        _name: "RateLimiter",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {number} permitsPerSecond
         */
        _constructor: function(permitsPerSecond) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Queue.<function()>}
             */
            this.acquisitionQueue           = new Queue();

            /**
             * @private
             * @type {number}
             */
            this.lastAcqusitionTime         = null;

            /**
             * @private
             * @type {number}
             */
            this.permitsPerSecond           = permitsPerSecond;

            /**
             * @private
             * @type {boolean}
             */
            this.queueProcessingDelayed     = false;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Queue.<function()>}
         */
        getAcquisitionQueue: function() {
            return this.acquisitionQueue;
        },

        /**
         * @return {number}
         */
        getLastAcquisitionTime: function() {
            return this.lastAcqusitionTime;
        },

        /**
         * @return {number}
         */
        getPermitsPerSecond: function() {
            return this.permitsPerSecond;
        },

        /**
         * @param {number} permitsPerSecond
         */
        setPermitsPerSecond: function(permitsPerSecond) {
            this.permitsPerSecond = permitsPerSecond;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function()} method
         */
        acquire: function(method) {
            this.queueAcquisition(method);
            this.tryProcessQueue();
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        acquirePermit: function(method) {
            this.lastAcqusitionTime = Date.now();
            method();
        },

        /**
         * @private
         * @param {number} wait
         */
        delayQueueProcessing: function(wait) {
            if (!this.queueProcessingDelayed) {
                this.queueProcessingDelayed = true;
                Func.delayCall(this.delayQueueProcessingComplete, this, wait);
            }
        },

        /**
         * @private
         */
        delayQueueProcessingComplete: function() {
            this.queueProcessingDelayed = false;
            this.tryProcessQueue();
        },

        /**
         * @private
         */
        processQueue: function() {
            var method = this.acquisitionQueue.dequeue();
            this.acquirePermit(method);
            this.tryProcessQueue();
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
        tryProcessQueue: function() {
            if (!this.acquisitionQueue.isEmpty()) {
                if (this.lastAcqusitionTime) {
                    var rate        = 1000 / this.permitsPerSecond;
                    var elapsed     = Date.now() - this.lastAcqusitionTime;
                    if (elapsed >= rate) {
                        this.processQueue();
                    } else {
                        this.delayQueueProcessing(rate - elapsed);
                    }
                } else {
                    this.processQueue();
                }
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('RateLimiter', RateLimiter);
});
