/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IterableSeries')

//@Require('Class')
//@Require('IterableFlow')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var IterableFlow    = bugpack.require('IterableFlow');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {IterableFlow}
     */
    var IterableSeries = Class.extend(IterableFlow, {

        _name: "IterableSeries",


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<*>} flowArgs
         */
        executeFlow: function(flowArgs) {
            this._super(flowArgs);
            this.nextIteration();
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
            if (throwable) {
                if (!this.hasErrored()) {
                    this.error(throwable);
                }
            } else {
                this.nextIteration();
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        nextIteration: function() {
            if (!this.getIterator().hasNext()) {
                this.complete();
            } else {
                var nextValue = this.getIterator().next();
                this.executeIteration([nextValue]);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('IterableSeries', IterableSeries);
});
