/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ForEachSeries')

//@Require('Class')
//@Require('IIndexValueIterable)
//@Require('IKeyValueIterable)
//@Require('IterableFlow')


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


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {IterableFlow}
     */
    var ForEachSeries = Class.extend(IterableFlow, {

        _name: "ForEachSeries",


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<*>} flowArgs
         */
        executeFlow: function(flowArgs) {
            this._super(flowArgs);
            if (this.getIterator().hasNext()) {
                this.nextIteration();
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
            if (throwable) {
                if (!this.hasErrored()) {
                    this.error(throwable);
                }
            } else {
                if (this.getIterator().hasNext()) {
                    this.nextIteration();
                } else {
                    this.complete();
                }
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        nextIteration: function() {
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
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('ForEachSeries', ForEachSeries);
});
