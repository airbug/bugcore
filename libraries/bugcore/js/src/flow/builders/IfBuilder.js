/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IfBuilder')

//@Require('Class')
//@Require('FlowBuilder')
//@Require('If')
//@Require('List')
//@Require('TaskBuilder')
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
    var If              = bugpack.require('If');
    var List            = bugpack.require('List');
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
    var IfBuilder = Class.extend(FlowBuilder, {

        _name: "IfBuilder",


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

            /**
             * @private
             * @type {FlowBuilder}
             */
            this.elseFlowBuilder        = null;

            /**
             * @private
             * @type {List.<IfBuilder>}
             */
            this.elseIfBuilderList      = new List();
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Assertion, *...)} assertionMethod
         * @param {(FlowBuilder | function(Flow, *...))} assertPassFlowBuilder
         * @return {IfBuilder}
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

        /**
         * @return {FlowBuilder}
         */
        getElseFlowBuilder: function() {
            return this.elseFlowBuilder;
        },

        /**
         * @return {List.<IfBuilder>}
         */
        getElseIfBuilderList: function() {
            return this.elseIfBuilderList;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {FlowBuilder | function(Flow, *...)} elseFlowBuilder
         * @return {IfBuilder}
         */
        $else: function(elseFlowBuilder) {
            if (this.elseFlowBuilder) {
                throw Throwables.bug("IllegalState", {}, "IfBuilder already has an elseFlowBuilder");
            }
            if (TypeUtil.isFunction(elseFlowBuilder)) {
                elseFlowBuilder = new TaskBuilder(elseFlowBuilder);
            }
            if (Class.doesExtend(elseFlowBuilder, FlowBuilder)) {
                this.elseFlowBuilder = elseFlowBuilder;
            } else {
                throw Throwables.illegalArgumentBug("elseFlowBuilder", elseFlowBuilder, "must be a function or a FlowBuilder");
            }
            return this;
        },

        /**
         * @param {function(Assertion, *...)} assertionMethod
         * @param {FlowBuilder | function(Flow, *...)} elseIfFlowBuilder
         * @return {IfBuilder}
         */
        $elseIf: function(assertionMethod, elseIfFlowBuilder) {
            if (this.elseFlowBuilder) {
                throw Throwables.bug("IllegalState", {}, "IfFlowBuilder already has an elseFlowBuilder");
            }
            if (!TypeUtil.isFunction(assertionMethod)) {
                throw Throwables.illegalArgumentBug("assertionMethod", assertionMethod, "must be a function");
            }
            if (TypeUtil.isFunction(elseIfFlowBuilder)) {
                elseIfFlowBuilder = new TaskBuilder(elseIfFlowBuilder);
            }
            if (!Class.doesExtend(elseIfFlowBuilder, FlowBuilder)) {
                throw Throwables.illegalArgumentBug("elseIfFlowBuilder", elseIfFlowBuilder, "must be a function or a FlowBuilder");
            }
            var ifFlowBuilder = new IfBuilder(assertionMethod, elseIfFlowBuilder);
            this.elseIfBuilderList.add(ifFlowBuilder);
            return this;
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @return {Flow}
         */
        doFactoryFlow: function() {
            var flow = new If(this.assertionMethod, this.assertPassFlowBuilder);
            flow.addAllElseIfBuilders(this.elseIfBuilderList);
            flow.setElseFlowBuilder(this.elseFlowBuilder);
            return flow;
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('IfBuilder', IfBuilder);
});
