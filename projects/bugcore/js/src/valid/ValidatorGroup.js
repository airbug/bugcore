/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ValidatorGroup')

//@Require('Class')
//@Require('Collections')
//@Require('Obj')
//@Require('ValidatorProcessor')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Collections         = bugpack.require('Collections');
    var Obj                 = bugpack.require('Obj');
    var ValidatorProcessor  = bugpack.require('ValidatorProcessor');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var ValidatorGroup = Class.extend(Obj, /** @lends {ValidatorGroup.prototype} */{

        _name: "ValidatorGroup",


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
             * @type {ValidatorProcessor}
             */
            this.buildingValidatorProcessor         = null;

            /**
             * @private
             * @type {List.<ValidatorProcessor>}
             */
            this.executingValidatorProcessorList    = Collections.list();

            /**
             * @private
             * @type {boolean}
             */
            this.valid                              = true;

            /**
             * @private
             * @type {boolean}
             */
            this.validating                         = false;

            /**
             * @private
             * @type {List.<Validator>}
             */
            this.validatorList                      = Collections.list();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        getValid: function() {
            return this.valid;
        },

        /**
         * @return {List.<Validator>}
         */
        getValidatorList: function() {
            return this.validatorList;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        isValid: function() {
            return this.getValid();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Validator} validator
         */
        addValidator: function(validator) {
            if (!this.validatorList.contains(validator)) {
                this.validatorList.add(validator);
            }
        },

        /**
         * @param {function(Throwable=)=} callback
         */
        invalidate: function(callback) {
            this.valid = false;
            if (!this.buildingValidatorProcessor) {
                this.buildingValidatorProcessor = new ValidatorProcessor(this);
            }
            if (callback) {
                this.buildingValidatorProcessor.addCallback(callback);
            }
        },

        /**
         * @param {Validator} validator
         */
        removeValidator: function(validator) {
            this.validatorList.remove(validator);
        },

        /**
         * @param {function(Throwable=)} callback
         */
        validate: function(callback) {
            var _this = this;
            if (!this.isValid()) {
                var validatorProcessor = this.buildingValidatorProcessor;
                this.buildingValidatorProcessor = null;
                this.executingValidatorProcessorList.add(validatorProcessor);
                validatorProcessor.validate(function(throwable) {
                    _this.executingValidatorProcessorList.remove(validatorProcessor);
                    if (_this.executingValidatorProcessorList.isEmpty()) {
                        _this.valid = true;
                    }
                    callback(throwable);
                });
            } else {
                callback();
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ValidatorGroup', ValidatorGroup);
});
