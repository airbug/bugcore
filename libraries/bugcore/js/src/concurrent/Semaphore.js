/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Semaphore')

//@Require('Class')
//@Require('Obj')
//@Require('Queue')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');
    var Queue   = bugpack.require('Queue');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Semaphore = Class.extend(Obj, {

        _name: 'Semaphore',


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {number} numberPermits
         */
        _constructor: function(numberPermits) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
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
        // Public Methods
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
        // Private Methods
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

            setTimeout(function() {
                _this.processQueue();
            }, 0);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Semaphore', Semaphore);
});
