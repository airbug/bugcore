/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Task')

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

    /**
     * @class
     * @extends {Flow}
     */
    var Task = Class.extend(Flow, {

        _name: "Task",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(Flow, *...)} taskMethod
         * @param {Object=} taskContext
         */
        _constructor: function(taskMethod, taskContext) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Object}
             */
            this.taskContext    = taskContext;

            /**
             * @private
             * @type {function(Flow, *...)}
             */
            this.taskMethod     = taskMethod;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        getTaskContext: function() {
            return this.taskContext;
        },

        /**
         * @return {function(Flow, *...)}
         */
        getTaskMethod: function() {
            return this.taskMethod;
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<*>} flowArgs
         */
        executeFlow: function(flowArgs) {
            this._super(flowArgs);
            return this.taskMethod.apply(this.taskContext, ([this.generateCallback()]).concat(flowArgs));
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

    bugpack.export('Task', Task);
});
