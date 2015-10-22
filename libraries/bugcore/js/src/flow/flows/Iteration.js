/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Iteration')

//@Require('Class')
//@Require('Flow')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Flow    = bugpack.require('Flow');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    //NOTE BRN: An instance of this class is designed to be used only once.

    /**
     * @class
     * @extends {Flow}
     */
    var Iteration = Class.extend(Flow, {

        _name: "Iteration",


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
             * @type {function(IterableFlow, *...)}
             */
            this.iteratorMethod = null;
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(IterableFlow, *...)} iteratorMethod
         * @return {Iteration}
         */
        init: function(iteratorMethod) {
            this._super();
            this.iteratorMethod = iteratorMethod;
            return this;
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<*>} flowArgs
         */
        executeFlow: function(flowArgs) {
            this._super(flowArgs);
            return this.iteratorMethod.apply(null, ([this.generateCallback()]).concat(this.getFlowArgs()));
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @returns {function(Throwable, *...)}
         */
        generateCallback: function() {
            var _this = this;
            var callback = function() {
                _this.complete.apply(_this, arguments);
            };
            callback.complete = function() {
                _this.complete.apply(_this, arguments);
            };
            callback.resolve = function() {
                _this.resolve.apply(_this, arguments);
            };
            callback.error = function() {
                _this.error.apply(_this, arguments);
            };
            return callback;
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('Iteration', Iteration);
});
