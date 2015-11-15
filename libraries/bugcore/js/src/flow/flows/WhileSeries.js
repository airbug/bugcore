/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('WhileSeries')

//@Require('Assertion')
//@Require('Bug')
//@Require('Class')
//@Require('Flow')
//@Require('List')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Assertion   = bugpack.require('Assertion');
    var Bug         = bugpack.require('Bug');
    var Class       = bugpack.require('Class');
    var Flow        = bugpack.require('Flow');
    var List        = bugpack.require('List');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Flow}
     */
    var WhileSeries = Class.extend(Flow, {

        _name: "WhileSeries",


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
             * @type {function(Assertion)}
             */
            this.assertionMethod        = null;

            /**
             * @private
             * @type {FlowBuilder}
             */
            this.assertPassFlowBuilder  = null;

            /**
             * @private
             * @type {boolean}
             */
            this.syncCall               = false;

            /**
             * @private
             * @type {boolean}
             */
            this.whileCheck             = true;
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Flow, *...)} assertionMethod
         * @param {FlowBuilder} assertPassFlowBuilder
         * @return {WhileSeries}
         */
        init: function(assertionMethod, assertPassFlowBuilder) {
            this._super();
            this.assertionMethod        = assertionMethod;
            this.assertPassFlowBuilder  = assertPassFlowBuilder;
            return this;
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array<*>} flowArgs
         */
        executeFlow: function(flowArgs) {
            this._super(flowArgs);
            this.startSyncWhileLoop();
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        runWhileAssertion: function() {
            var _this           = this;
            var executed        = false;
            var assertionFlow   = new Assertion(this.assertionMethod);
            assertionFlow.execute(this.getFlowArgs(), function(throwable, result) {
                executed = true;
                if (!throwable) {
                    if (result) {
                        _this.whileCheckSuccess();
                    } else {
                        _this.whileCheckFailed();
                    }
                } else {
                    _this.error(throwable);
                }
            });
            //NOTE BRN: This code will run before the above callback for the execute method only if the callback is fired async
             if (!executed) {
                this.syncCall  = false;
            }
        },

        /**
         * @private
         */
        runWhileFlow: function() {
            var _this           = this;
            var executed        = false;
            this.assertPassFlowBuilder.execute(this.getFlowArgs(), function(throwable) {
                executed = true;
                if (!throwable) {
                    if (!_this.syncCall) {
                        _this.startSyncWhileLoop();
                    }
                } else {
                    _this.error(throwable);
                }
            });
            if (!executed) {
                this.syncCall  = false;
            }
        },

        /**
         * @private
         */
        startSyncWhileLoop: function() {
            this.syncCall = true;
            while (this.syncCall && this.whileCheck) {
                this.runWhileAssertion();
            }
        },

        /**
         * @private
         */
        whileCheckFailed: function() {
            this.whileCheck = false;
            this.complete();
        },

        /**
         * @private
         */
        whileCheckSuccess: function() {
            this.runWhileFlow();
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('WhileSeries', WhileSeries);
});
