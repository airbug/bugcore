/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IteratorFlow')

//@Require('Class')
//@Require('Flow')
//@Require('Iteration')
//@Require('Throwables')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Flow        = bugpack.require('Flow');
    var Iteration   = bugpack.require('Iteration');
    var Throwables  = bugpack.require('Throwables');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Flow}
     */
    var IteratorFlow = Class.extend(Flow, {

        _name: "IteratorFlow",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {*} data
         * @param {function(Flow, *)} iteratorMethod
         */
        _constructor: function(data, iteratorMethod) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            // TODO BRN: Add support for BugJs data objects that implement the IIterate interface

            /**
             * @private
             * @type {*}
             */
            this.data               = data;

            /**
             * @private
             * @type {function(Flow, *)}
             */
            this.iteratorMethod     = iteratorMethod;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {*}
         */
        getData: function() {
            return this.data;
        },

        /**
         * @return {function(Flow, *)}
         */
        getIteratorMethod: function() {
            return this.iteratorMethod;
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Array.<*>} args
         */
        executeIteration: function(args) {
            var _this = this;
            var iteration = new Iteration(this.getIteratorMethod());
            iteration.execute(args, function(throwable) {
                _this.iterationCallback(throwable, args);
            })
        },


        //-------------------------------------------------------------------------------
        // Abstract Methods
        //-------------------------------------------------------------------------------

        /**
         * @abstract
         * @param {Throwable} throwable
         * @param {Array.<*>} args
         */
        iterationCallback: function(throwable, args) {
            throw Throwables.bug("AbstractMethodNotImplemented", {}, "Must implement iterationCallback");
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('IteratorFlow', IteratorFlow);
});
