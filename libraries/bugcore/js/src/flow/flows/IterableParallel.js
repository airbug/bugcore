/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IterableParallel')

//@Require('Class')
//@Require('IterableFlow')
//@Require('MappedParallelException')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var IterableFlow                = bugpack.require('IterableFlow');
    var MappedParallelException     = bugpack.require('MappedParallelException');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {IterableFlow}
     */
    var IterableParallel = Class.extend(IterableFlow, {

        _name: 'IterableParallel',


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {MappedParallelException}
             */
            this.exception                  = null;

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
         * @param {Array.<*>} flowArgs
         */
        executeFlow: function(flowArgs) {
            this._super(flowArgs);
            if (this.getIterator().hasNext()) {
                while (this.getIterator().hasNext()) {
                    var value = this.getIterator().next();
                    this.totalIterationCount++;
                    this.executeIteration([value]);
                }
            } else {
                this.complete();
            }
        },


        //-------------------------------------------------------------------------------
        // IterableFlow Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Throwable} throwable
         * @param {Iteration} iteration
         */
        iterationCallback: function(throwable, iteration) {
            this.numberIterationsComplete++;
            if (throwable) {
                this.processThrowable(throwable, iteration);
            }
            if (!this.getIterator().hasNext() && this.numberIterationsComplete >= this.totalIterationCount) {
                if (!this.exception) {
                    this.complete();
                } else {
                    this.error(this.exception);
                }
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Throwable} throwable
         * @param {Iteration} iteration
         */
        processThrowable: function(throwable, iteration) {
            if (!this.exception) {
                this.exception = new MappedParallelException();
            }
            this.exception.putCause(iteration.getFlowArgs()[0], throwable);
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('IterableParallel', IterableParallel);
});
