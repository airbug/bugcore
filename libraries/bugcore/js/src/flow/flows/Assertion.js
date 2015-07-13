/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Assertion')

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

    var Class       = bugpack.require('Class');
    var Flow        = bugpack.require('Flow');
    var Throwables  = bugpack.require('Throwables');
    var TypeUtil    = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Flow}
     */
    var Assertion = Class.extend(Flow, {

        _name: "Assertion",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(Flow, *...)} assertionMethod
         */
        _constructor: function(assertionMethod) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {boolean}
             */
            this.assertCalled       = false;

            /**
             * @private
             * @type {function(Assertion, *...)}
             */
            this.assertionMethod    = assertionMethod;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        getAssertCalled: function() {
            return this.assertCalled;
        },

        /**
         * @return {function(Assertion, *...)}
         */
        getAssertionMethod: function() {
            return this.assertionMethod;
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<*>} flowArgs
         */
        executeFlow: function(flowArgs) {
            this._super(flowArgs);
            var result = this.assertionMethod.apply(null, ([this.generateCallback()]).concat(this.getFlowArgs()));
            if (!TypeUtil.isUndefined(result)) {
                this.assert(result);
            }
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean} bool
         */
        assert: function(bool) {
            if (!this.assertCalled) {
                this.complete(null, bool);
            } else {
                this.error(Throwables.bug("IllegalState", {}, "Flow has already been asserted. Cannot call assert more than once."));
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @returns {function(Throwable, *...)}
         */
        generateCallback: function() {
            var _this = this;
            var callback = function() {
                _this.complete.apply(_this, arguments);
            };
            callback.assert = function() {
                _this.assert.apply(_this, arguments);
            };
            callback.complete = function() {
                _this.complete.apply(_this, arguments);
            };
            callback.resolve = function() {
                _this.resolve.apply(_this, arguments);
            };
            callback.error = function() {
                _this.error.apply(_this, arguments);
            };
            return callback;
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('Assertion', Assertion);
});
