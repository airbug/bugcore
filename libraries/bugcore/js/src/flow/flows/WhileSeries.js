/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('WhileSeries')

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

    var Bug     = bugpack.require('Bug');
    var Class   = bugpack.require('Class');
    var Flow    = bugpack.require('Flow');
    var List    = bugpack.require('List');


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
         * @param {function(Flow)} whileMethod
         * @param {Flow} whileFlow
         */
        _constructor: function(whileMethod, whileFlow) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {boolean}
             */
            this.runningWhileCheck      = false;

            /**
             * @private
             * @type {Flow}
             */
            this.whileFlow              = whileFlow;

            /**
             * @private
             * @type {function(Flow)}
             */
            this.whileMethod            = whileMethod;
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array<*>} args
         */
        executeFlow: function(args) {
            this._super(args);
            this.execArgs = args;
            this.runWhileCheck();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean} bool
         */
        assert: function(bool) {
            if (this.runningWhileCheck) {
                if (bool) {
                    this.whileCheckSuccess();
                } else {
                    this.whileCheckFailed();
                }
            } else {
                throw new Bug("UnexpectedCall", {}, "Unexpected assert() call. assert might have been called twice in the same check.");
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        runWhileCheck: function() {
            this.runningWhileCheck = true;
            try {
                this.whileMethod.apply(null, ([this]).concat(this.execArgs));
            } catch(throwable) {
                this.error(throwable);
            }
        },

        /**
         * @private
         */
        runWhileFlow: function() {
            var _this = this;
            this.whileFlow.execute(this.execArgs, function(throwable) {
                if (!throwable) {
                    _this.runWhileCheck();
                } else {
                    _this.error(throwable);
                }
            });
        },

        /**
         * @private
         */
        whileCheckFailed: function() {
            this.runningWhileCheck = false;
            this.complete();
        },

        /**
         * @private
         */
        whileCheckSuccess: function() {
            this.runningWhileCheck = false;
            this.runWhileFlow();
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('WhileSeries', WhileSeries);
});
