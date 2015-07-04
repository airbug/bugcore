/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ForEachParallel')

//@Require('Class')
//@Require('IIndexValueIterable)
//@Require('IKeyValueIterable)
//@Require('IterableFlow')
//@Require('MappedParallelException')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var IIndexValueIterable         = bugpack.require('IIndexValueIterable');
    var IKeyValueIterable           = bugpack.require('IKeyValueIterable');
    var IterableFlow                = bugpack.require('IterableFlow');
    var MappedParallelException     = bugpack.require('MappedParallelException');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {IterableFlow}
     */
    var ForEachParallel = Class.extend(IterableFlow, {

        _name: "ForEachParallel",


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
             * @type {boolean}
             */
            this.iterationComplete          = false;

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
            while (this.getIterator().hasNext()) {
                this.nextIteration();
            }
            this.iterationComplete = true;
            this.checkIterationComplete();
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
            this.checkIterationComplete();
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        checkIterationComplete: function() {
            if (this.iterationComplete && this.numberIterationsComplete >= this.totalIterationCount) {
                if (!this.exception) {
                    this.complete();
                } else {
                    this.error(this.exception);
                }
            }
        },

        /**
         * @private
         */
        nextIteration: function() {
            this.totalIterationCount++;
            if (Class.doesExtend(this.getIterator(), IIndexValueIterable)) {
                var indexValuePair = this.getIterator().nextIndexValuePair();
                this.executeIteration([indexValuePair.value, indexValuePair.index]);
            } else if (Class.doesExtend(this.getIterator(), IKeyValueIterable)) {
                var keyValuePair = this.getIterator().nextKeyValuePair();
                this.executeIteration([keyValuePair.value, keyValuePair.key]);
            } else {
                var value = this.getIterator().next();
                this.executeIteration([value]);
            }
        },

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

    bugpack.export('ForEachParallel', ForEachParallel);
});
