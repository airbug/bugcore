/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugflow may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ForEachSeries')

//@Require('Bug')
//@Require('Class')
//@Require('IIterable')
//@Require('IteratorFlow')
//@Require('Tracer')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug             = bugpack.require('Bug');
    var Class           = bugpack.require('Class');
    var IIterable       = bugpack.require('IIterable');
    var IteratorFlow    = bugpack.require('IteratorFlow');
    var Tracer        = bugpack.require('Tracer');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $error          = Tracer.$error;
    var $trace          = Tracer.$trace;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {IteratorFlow}
     */
    var ForEachSeries = Class.extend(IteratorFlow, {

        _name: "ForEachSeries",


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

            if (Class.doesImplement(data, IIterable)) {
                throw new Bug("UnsupportedType", {}, "ForEachSeries does not support IIterable instances. Use the IterableSeries instead.");
            }

            /**
             * @private
             * @type {number}
             */
            this.iteratorIndex = -1;
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array<*>} args
         */
        executeFlow: function(args) {
            if (!this.getData()) {
                this.error("There is not data. Data value must be iterable");
                //NOTE SUNG
                // You may need to wrap your forEachSeries in another task
                // because the data is defined before the forEachSeries is run
            }
            if (this.getData().length > 0) {
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
         * @param {Array.<*>} args
         * @param {Throwable} throwable
         */
        iterationCallback: function(args, throwable) {
            if (throwable) {
                if (!this.hasErrored()) {
                    this.error(throwable);
                }
            } else {
                if (this.iteratorIndex >= (this.getData().length - 1)) {
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
            var nextValue = this.getData()[this.iteratorIndex];
            this.executeIteration([nextValue, this.iteratorIndex]);
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('ForEachSeries', ForEachSeries);
});
