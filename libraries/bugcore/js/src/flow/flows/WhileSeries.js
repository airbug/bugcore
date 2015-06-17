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
             * @type {Array.<*>}
             */
            this.execArgs               = null;


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
         * @param {Array<*>} args
         */
        executeFlow: function(args) {
            this._super(args);
            this.execArgs = args;
            this.runWhileAssertion();
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        runWhileAssertion: function() {
            var _this = this;
            var assertionFlow = new Assertion(this.assertionMethod);
            assertionFlow.execute(this.execArgs, function(throwable, result) {
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
        },

        /**
         * @private
         */
        runWhileFlow: function() {
            var _this = this;
            this.whileFlow.execute(this.execArgs, function(throwable) {
                if (!throwable) {
                    _this.runWhileAssertion();
                } else {
                    _this.error(throwable);
                }
            });
        },

        /**
         * @private
         */
        whileCheckFailed: function() {
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
