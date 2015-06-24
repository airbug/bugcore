/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ForInParallel')

//@Require('Class')
//@Require('IteratorFlow')
//@Require('MappedParallelException')
//@Require('ObjectUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var IteratorFlow                = bugpack.require('IteratorFlow');
    var MappedParallelException     = bugpack.require('MappedParallelException');
    var ObjectUtil                  = bugpack.require('ObjectUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {IteratorFlow}
     */
    var ForInParallel = Class.extend(IteratorFlow, {

        _name: "ForInParallel",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {*} data
         * @param {function(Flow, *)} iteratorMethod
         */
        _constructor: function(data, iteratorMethod) {

            this._super(data, iteratorMethod);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            // TODO BRN: Add support for BugJs data objects that implement the IIterate interface

            /**
             * @private
             * @type {MappedParallelException}
             */
            this.exception                  = null;

            /**
             * @private
             * @type {boolean}
             */
            this.iterationCompleted         = false;

            /**
             * @private
             * @type {number}
             */
            this.numberIterationsComplete   = 0;

            /**
             * @private
             * @type {number}
             */
            this.totalIterationCount        = 0;
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array<*>} args
         */
        executeFlow: function(args) {
            this._super(args);
            var _this = this;
            ObjectUtil.forIn(this.getData(), function(key, value) {
                _this.totalIterationCount++;
                _this.executeIteration([key, value]);
            });
            this.iterationCompleted = true;
            this.checkIterationComplete();
        },


        //-------------------------------------------------------------------------------
        // IteratorFlow Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Throwable} throwable
         * @param {Array.<*>} args
         */
        iterationCallback: function(throwable, args) {
            this.numberIterationsComplete++;
            if (throwable) {
                this.processThrowable(throwable, args);
            }
            this.checkIterationComplete();
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        checkIterationComplete: function() {
            if (this.iterationCompleted && this.numberIterationsComplete >= this.totalIterationCount) {
                if (!this.exception) {
                    this.complete();
                } else {
                    this.error(this.exception);
                }
            }
        },

        /**
         * @private
         * @param {Throwable} throwable
         * @param {Array.<*>} args
         */
        processThrowable: function(throwable, args) {
            if (!this.exception) {
                this.exception = new MappedParallelException();
            }
            this.exception.putCause(args, throwable);
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('ForInParallel', ForInParallel);
});
