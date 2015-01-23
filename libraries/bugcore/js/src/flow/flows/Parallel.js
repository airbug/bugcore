/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
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
         * @param {Array.<Flow>} flowArray
         */
        _constructor: function(flowArray) {

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
             * @type {Array.<Flow>}
             */
            this.flowArray          = flowArray;

            /**
             * @private
             * @type {number}
             */
            this.numberComplete     = 0;
        },


        //-------------------------------------------------------------------------------
        // Flow Extensions
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Array.<*>} args
         */
        executeFlow: function(args) {
            this._super(args);
            var _this = this;
            if (this.flowArray.length > 0) {
                this.flowArray.forEach(function(flow) {
                    flow.execute(args, function(error) {
                        _this.flowCallback(error);
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
         * @param {Throwable} throwable
         */
        processThrowable: function(throwable) {
            if (!this.exception) {
                this.exception = Throwables.parallelException();
            }
            this.exception.addCause(throwable);
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
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
            if (this.numberComplete >= this.flowArray.length) {
                if (!this.exception) {
                    this.complete();
                } else {
                    this.error(this.exception);
                }
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('Parallel', Parallel);
});
