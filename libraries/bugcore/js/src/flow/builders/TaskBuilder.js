/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('SeriesBuilder')

//@Require('Class')
//@Require('FlowBuilder')
//@Require('Task')
//@Require('Throwables')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var FlowBuilder     = bugpack.require('FlowBuilder');
    var Task            = bugpack.require('Task');
    var Throwables      = bugpack.require('Throwables');
    var TypeUtil        = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {FlowBuilder}
     */
    var TaskBuilder = Class.extend(FlowBuilder, {

        _name: "TaskBuilder",


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
             * @type {Object}
             */
            this.taskContext    = null;

            /**
             * @private
             * @type {function(Task, *...)}
             */
            this.taskMethod     = null;
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {function(Task, *...)} taskMethod
         * @param {Object=} taskContext
         */
        init: function(taskMethod, taskContext) {
            this._super();
            if (TypeUtil.isFunction(taskMethod)) {
                this.taskMethod = taskMethod;
            } else {
                throw Throwables.illegalArgumentBug("taskMethod", taskMethod, "must be a function");
            }
            if (taskContext) {
                if (TypeUtil.isObject(taskMethod)) {
                    this.taskContext = taskContext;
                } else {
                    throw Throwables.illegalArgumentBug("taskContext", taskContext, "must be an Object");
                }
            }
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @return {Flow}
         */
        doFactoryFlow: function() {
            return new Task(this.taskMethod, this.taskContext);
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('TaskBuilder', TaskBuilder);
});
