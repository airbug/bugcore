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
//@Require('IIndexValueIterator')
//@Require('IKeyValueIterator')
//@Require('IterableFlow')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var IIndexValueIterator     = bugpack.require('IIndexValueIterator');
    var IKeyValueIterator       = bugpack.require('IKeyValueIterator');
    var IterableFlow            = bugpack.require('IterableFlow');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {IterableFlow}
     */
    var ForEachSeries = Class.extend(IterableFlow, {

        _name: 'ForEachSeries',


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
         */
        iterationCallback: function(throwable) {
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
            if (Class.doesImplement(this.getIterator(), IIndexValueIterator)) {
                var indexValuePair = this.getIterator().nextIndexValuePair();
                this.executeIteration([indexValuePair.value, indexValuePair.index]);
            } else if (Class.doesImplement(this.getIterator(), IKeyValueIterator)) {
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
