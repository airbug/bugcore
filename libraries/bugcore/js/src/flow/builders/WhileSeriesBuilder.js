/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('WhileSeriesBuilder')

//@Require('Class')
//@Require('FlowBuilder')
//@Require('TaskBuilder')
//@Require('Throwables')
//@Require('TypeUtil')
//@Require('WhileSeries')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var FlowBuilder     = bugpack.require('FlowBuilder');
    var TaskBuilder     = bugpack.require('TaskBuilder');
    var Throwables      = bugpack.require('Throwables');
    var TypeUtil        = bugpack.require('TypeUtil');
    var WhileSeries     = bugpack.require('WhileSeries');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {FlowBuilder}
     */
    var WhileSeriesBuilder = Class.extend(FlowBuilder, {

        _name: "WhileSeriesBuilder",


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
             * @type {function(Assertion, *...)}
             */
            this.assertionMethod        = null;

            /**
             * @private
             * @type {FlowBuilder}
             */
            this.assertPassFlowBuilder  = null;
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Assertion, *...)} assertionMethod
         * @param {(FlowBuilder | function(Flow, *...))} assertPassFlowBuilder
         * @return {WhileSeriesBuilder}
         */
        init: function(assertionMethod, assertPassFlowBuilder) {
            this._super();
            if (TypeUtil.isFunction(assertionMethod)) {
                this.assertionMethod = assertionMethod;
            } else {
                throw Throwables.illegalArgumentBug("assertionMethod", assertionMethod, "must be a function");
            }
            if (TypeUtil.isFunction(assertPassFlowBuilder)) {
                assertPassFlowBuilder = new TaskBuilder(assertPassFlowBuilder);
            }
            if (Class.doesExtend(assertPassFlowBuilder, FlowBuilder)) {
                this.assertPassFlowBuilder = assertPassFlowBuilder;
            } else {
                throw Throwables.illegalArgumentBug("assertPassFlowBuilder", assertPassFlowBuilder, "must be a function or a FlowBuilder");
            }
            return this;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {function(Assertion, *...)}
         */
        getAssertionMethod: function() {
            return this.assertionMethod;
        },

        /**
         * @return {FlowBuilder}
         */
        getAssertPassFlowBuilder: function() {
            return this.assertPassFlowBuilder;
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @return {Flow}
         */
        doFactoryFlow: function() {
            return new WhileSeries(this.assertionMethod, this.assertPassFlowBuilder);
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('WhileSeriesBuilder', WhileSeriesBuilder);
});
