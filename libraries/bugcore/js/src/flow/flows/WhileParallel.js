/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('WhileParallel')

//@Require('Assertion')
//@Require('Class')
//@Require('Flow')
//@Require('Throwables')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Assertion       = bugpack.require('Assertion');
    var Class           = bugpack.require('Class');
    var Flow            = bugpack.require('Flow');
    var Throwables      = bugpack.require('Throwables');
    var TypeUtil        = bugpack.require('TypeUtil');


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
         * @param {function(Assertion)} assertionMethod
         * @param {Flow} whileFlow
         */
        _constructor: function(assertionMethod, whileFlow) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {function(Assertion)}
             */
            this.assertionMethod        = assertionMethod;

            /**
             * @private
             * @type {ParallelException}
             */
            this.exception              = null;

            /**
             * @private
             * @type {Array.<*>}
             */
            this.execArgs               = null;

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
            this.syncCall               = false;

            /**
             * @private
             * @type {boolean}
             */
            this.whileCheck             = true;

            /**
             * @private
             * @type {Flow}
             */
            this.whileFlow              = whileFlow;
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
            this.startSyncWhileLoop();
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
        runWhileAssertion: function() {
            var _this           = this;
            var asyncCall       = false;
            var assertionFlow   = new Assertion(this.assertionMethod);
            assertionFlow.execute(this.execArgs, function(throwable, result) {
                if (asyncCall) {
                    _this.syncCall = false;
                }
                if (!throwable) {
                    if (result) {
                        _this.whileCheckSuccess();
                    } else {
                        _this.whileCheckFailed();
                    }
                } else {
                    _this.processThrowable(throwable);
                    _this.whileCheckFailed();
                }
            });

            //NOTE BRN: This code will run before the above callback for the execute method only if the callback is fired async
            asyncCall = true;
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
            this.doCheckComplete();
        },

        /**
         * @private
         */
        whileCheckSuccess: function() {
            this.runWhileFlow();
            if (!this.syncCall) {
                this.startSyncWhileLoop();
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('WhileParallel', WhileParallel);
});
