/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ParallelBuilder')

//@Require('Class')
//@Require('FlowBuilder')
//@Require('Parallel')
//@Require('TaskBuilder')
//@Require('Throwables')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var FlowBuilder     = bugpack.require('FlowBuilder');
    var Parallel        = bugpack.require('Parallel');
    var TaskBuilder     = bugpack.require('TaskBuilder');
    var Throwables      = bugpack.require('Throwables');
    var TypeUtil        = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {FlowBuilder}
     */
    var ParallelBuilder = Class.extend(FlowBuilder, {

        _name: 'ParallelBuilder',


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
             * @type {Array.<FlowBuilder>}
             */
            this.flowBuilderArray       = [];
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<(FlowBuilder | function(Flow, *...))>} flowBuilderArray
         * @return {ParallelBuilder}
         */
        init: function(flowBuilderArray) {
            var _this = this;
            if (TypeUtil.isArray(flowBuilderArray)) {
                flowBuilderArray.forEach(function(flowBuilder) {
                    if (TypeUtil.isFunction(flowBuilder)) {
                        flowBuilder = new TaskBuilder(flowBuilder);
                    }
                    if (!Class.doesExtend(flowBuilder, FlowBuilder)) {
                        throw Throwables.illegalArgumentBug('flowBuilderArray', flowBuilderArray, 'values in Array must be either functions for FlowBuilders');
                    }
                    _this.flowBuilderArray.push(flowBuilder);
                });
            } else {
                throw Throwables.illegalArgumentBug('flowBuilderArray', flowBuilderArray, 'must be an Array');
            }
            return this;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Array.<FlowBuilder>}
         */
        getFlowBuilderArray: function() {
            return this.flowBuilderArray;
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @return {Flow}
         */
        doFactoryFlow: function() {
            return new Parallel(this.flowBuilderArray);
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('ParallelBuilder', ParallelBuilder);
});
