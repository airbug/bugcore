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
//@Require('IIndexValueIterator')
//@Require('IKeyValueIterator')
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
    var IIndexValueIterator         = bugpack.require('IIndexValueIterator');
    var IKeyValueIterator           = bugpack.require('IKeyValueIterator');
    var IterableFlow                = bugpack.require('IterableFlow');
    var MappedParallelException     = bugpack.require('MappedParallelException');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {IterableFlow}
     */
    var ForInParallel = Class.extend(IterableFlow, {

        _name: "ForInParallel",


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
         * @param {Array<*>} args
         */
        executeFlow: function(args) {
            this._super(args);
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
            if (Class.doesImplement(this.getIterator(), IIndexValueIterator)) {
                var indexValuePair = this.getIterator().nextIndexValuePair();
                this.executeIteration([indexValuePair.index, indexValuePair.value]);
            } else if (Class.doesImplement(this.getIterator(), IKeyValueIterator)) {
                var keyValuePair = this.getIterator().nextKeyValuePair();
                this.executeIteration([keyValuePair.key, keyValuePair.value]);
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

    bugpack.export('ForInParallel', ForInParallel);
});
