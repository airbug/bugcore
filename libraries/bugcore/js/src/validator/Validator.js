/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Validator')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Validator = Class.extend(Obj, /** @lends {Validator.prototype} */{

        _name: "Validator",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(*)} validatorMethod
         * @param {Object=} validatorContext
         */
        _constructor: function(validatorMethod, validatorContext) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Object}
             */
            this.validatorContext   = validatorContext || {};

            /**
             * @private
             * @type {function(function(Throwable=))}
             */
            this.validatorMethod    = validatorMethod;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        getValidatorContext: function() {
            return this.validatorContext;
        },

        /**
         * @return {function(function(Throwable=))}
         */
        getValidatorMethod: function() {
            return this.validatorMethod;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        validate: function(callback) {
            this.validatorMethod.call(this.validatorContext, callback);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Validator', Validator);
});
