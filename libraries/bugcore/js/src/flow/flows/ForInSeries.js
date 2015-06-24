/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ForInSeries')

//@Require('Class')
//@Require('IteratorFlow')
//@Require('ObjectUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var IteratorFlow    = bugpack.require('IteratorFlow');
    var ObjectUtil      = bugpack.require('ObjectUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {IteratorFlow}
     */
    var ForInSeries = Class.extend(IteratorFlow, {

        _name: "ForInSeries",


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

            // NOTE BRN: Because JS does not have an iterator implementation, we have to create a copy of the properties
            // here and use the array as our way of iterating through the properties.

            /**
             * @private
             * @type {Array.<string>}
             */
            this.dataProperties     = ObjectUtil.getProperties(data);

            /**
             * @private
             * @type {number}
             */
            this.iteratorIndex      = -1;
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<*>} args
         */
        executeFlow: function(args) {
            this._super(args);
            if (this.dataProperties.length > 0) {
                this.next();
            } else {
                this.complete();
            }
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
            if (throwable) {
                if (!this.hasErrored()) {
                    this.error(throwable);
                }
            } else {
                if (this.iteratorIndex >= (this.dataProperties.length - 1)) {
                    this.complete();
                } else {
                    this.next();
                }
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        next: function() {
            this.iteratorIndex++;
            var nextProperty    = this.dataProperties[this.iteratorIndex];
            var nextValue       = this.getData()[nextProperty];
            this.executeIteration([nextProperty, nextValue]);
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('ForInSeries', ForInSeries);
});
