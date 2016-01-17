/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Parallel')

//@Require('Class')
//@Require('Flow')
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
    var Throwables  = bugpack.require('Throwables');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Flow}
     */
    var Parallel = Class.extend(Flow, {

        _name: "Parallel",


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
             * @type {ParallelException}
             */
            this.exception          = null;

            /**
             * @private
             * @type {Array.<FlowBuilder>}
             */
            this.flowBuilderArray   = [];

            /**
             * @private
             * @type {number}
             */
            this.numberComplete     = 0;
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<FlowBuilder>} flowBuilderArray
         * @return {Parallel}
         */
        init: function(flowBuilderArray) {
            this._super();
            this.flowBuilderArray = flowBuilderArray;
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
         * @param {Array.<*>} flowArgs
         */
        executeFlow: function(flowArgs) {
            this._super(flowArgs);
            var _this = this;
            if (this.flowBuilderArray.length > 0) {
                this.flowBuilderArray.forEach(function(flowBuilder) {
                    flowBuilder.execute(flowArgs, function(throwable) {
                        _this.flowCallback(throwable);
                    });
                });
            } else {
                this.complete();
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Throwable=} throwable
         */
        flowCallback: function(throwable) {
            this.numberComplete++;
            if (throwable) {
                this.processThrowable(throwable);
            }
            if (this.numberComplete >= this.flowBuilderArray.length) {
                if (!this.exception) {
                    this.complete();
                } else {
                    this.error(this.exception);
                }
            }
        },

        /**
         * @private
         * @param {Throwable} throwable
         */
        processThrowable: function(throwable) {
            if (!this.exception) {
                this.exception = Throwables.parallelException();
            }
            this.exception.addCause(throwable);
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('Parallel', Parallel);
});
