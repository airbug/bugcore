/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('WhileParallel')

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
     * @extends {flow}
     */
    var WhileParallel = Class.extend(Flow, {

        _name: "WhileParallel",


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
            this.whileCheck             = true;

            /**
             * @private
             * @type {ParallelException}
             */
            this.exception              = null;

            /**
             * @private
             * @type {number}
             */
            this.numberFlowsCompleted   = 0;

            /**
             * @private
             * @type {number}
             */
            this.numberFlowsExecuted    = 0;

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
         * @param {Array.<*>} args
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
                throw Throwables.bug("UnexpectedCall", {}, "Unexpected assert() call. assert might have been called twice in the same check.");
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        doCheckComplete: function() {
            if (!this.whileCheck) {
                if (this.numberFlowsCompleted === this.numberFlowsExecuted) {
                    if (this.exception) {
                        this.error(this.exception);
                    } else {
                        this.complete();
                    }
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
        },

        /**
         * @private
         */
        runWhileCheck: function() {
            this.runningWhileCheck = true;
            try {
                this.whileMethod.apply(null, ([this]).concat(this.execArgs));
            } catch(throwable) {
                this.processThrowable(throwable);
                this.whileCheckFailed();
            }
        },

        /**
         * @private
         */
        runWhileFlow: function() {
            var _this = this;
            this.numberFlowsExecuted++;
            this.whileFlow.execute(this.execArgs, function(throwable) {
                _this.numberFlowsCompleted++;
                if (throwable) {
                    _this.processThrowable(throwable);
                }
                _this.doCheckComplete();
            });
        },

        /**
         * @private
         */
        whileCheckFailed: function() {
            this.runningWhileCheck = false;
            this.whileCheck = false;
            this.doCheckComplete();
        },

        /**
         * @private
         */
        whileCheckSuccess: function() {
            this.runningWhileCheck = false;
            this.runWhileFlow();
            this.runWhileCheck();
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('WhileParallel', WhileParallel);
});
