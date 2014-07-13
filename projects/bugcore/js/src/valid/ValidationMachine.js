/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ValidationMachine')

//@Require('Class')
//@Require('Collections')
//@Require('Obj')
//@Require('Validator')
//@Require('ValidatorGroup')
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
    var Validator           = bugpack.require('Validator');
    var ValidatorGroup      = bugpack.require('ValidatorGroup');
    var ValidatorProcessor  = bugpack.require('ValidatorProcessor');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var ValidationMachine = Class.extend(Obj, /** @lends {ValidationMachine.prototype} */{

        _name: "ValidationMachine",


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
             * @type {Map.<string, ValidatorGroup>}
             */
            this.typeToValidatorGroupMap    = Collections.map()
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Map.<string, ValidatorGroup>}
         */
        getTypeToValidatorGroupMap: function() {
            return this.typeToValidatorGroupMap;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} type
         * @param {function(function(Throwable=))} validatorMethod
         * @param {Object=} validatorContext
         */
        addValidator: function(type, validatorMethod, validatorContext) {
            var validator = new Validator(validatorMethod, validatorContext);
            var validatorGroup = this.generateValidatorGroup(type);
            validatorGroup.addValidator(validator);
        },

        /**
         * @param {string} type
         * @param {function(Throwable=)=} callback
         */
        invalidate: function(type, callback) {
            var validatorGroup = this.generateValidatorGroup(type);
            validatorGroup.invalidate(callback);
        },

        /**
         * @param {string} type
         * @return {boolean}
         */
        isTypeValid: function(type) {
            var validatorGroup = this.typeToValidatorGroupMap.get(type);
            return validatorGroup ? validatorGroup.isValid() : true;
        },

        /**
         * @param {string} type
         * @param {function(function(Throwable=))} validatorMethod
         * @param {Object=} validatorContext
         */
        removeValidator: function(type, validatorMethod, validatorContext) {
            var validatorGroup = this.typeToValidatorGroupMap.get(type);
            if (validatorGroup) {
                var validator = new Validator(validatorMethod, validatorContext);
                validatorGroup.removeValidator(validator);
            }
        },

        /**
         * @param {string} type
         * @param {function(Throwable=)=} callback
         */
        validate: function(type, callback) {
            var validatorGroup = this.generateValidatorGroup(type);
            validatorGroup.validate(callback);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {string} type
         * @return {ValidatorGroup}
         */
        generateValidatorGroup: function(type) {
            var validatorGroup = this.typeToValidatorGroupMap.get(type);
            if (!validatorGroup) {
                validatorGroup = new ValidatorGroup();
                this.typeToValidatorGroupMap.put(type, validatorGroup);
            }
            return validatorGroup;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ValidationMachine', ValidationMachine);
});
