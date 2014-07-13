/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ValidatorProcessor')

//@Require('Class')
//@Require('Collections')
//@Require('Exception')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Collections     = bugpack.require('Collections');
    var Exception       = bugpack.require('Exception');
    var Obj             = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var ValidatorProcessor = Class.extend(Obj, /** @lends {ValidatorProcessor.prototype} */{

        _name: "ValidatorProcessor",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ValidatorGroup} validatorGroup
         */
        _constructor: function(validatorGroup) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {function(Throwable=)}
             */
            this.callback           = null;

            /**
             * @private
             * @type {IIterator.<function(Throwable=)>}
             */
            this.callbackIterator   = null;

            /**
             * @private
             * @type {List.<function(Throwable=)>}
             */
            this.callbackList       = Collections.list();

            /**
             * @private
             * @type {boolean}
             */
            this.validating         = false;

            /**
             * @private
             * @type {ValidatorGroup}
             */
            this.validatorGroup     = validatorGroup;

            /**
             * @private
             * @type {IIterator.<Validator>}
             */
            this.validatorIterator  = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {List.<function(Throwable=)>}
         */
        getCallbackList: function() {
            return this.callbackList;
        },

        /**
         * @return {boolean}
         */
        getValidating: function() {
            return this.validating;
        },

        /**
         * @return {ValidatorGroup}
         */
        getValidatorGroup: function() {
            return this.validatorGroup;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        isValidating: function() {
            return this.getValidating();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        addCallback: function(callback) {
            this.callbackList.add(callback);
        },

        /**
         * @param {function(Throwable=)} callback
         */
        validate: function(callback) {
            if (!this.isValidating()) {
                this.validating = true;
                this.doValidation(callback);
            } else {
                throw new Exception("IllegalState", {}, "ValidatorProcessor is already validating. Cannot call validate twice.");
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        completeCallback: function() {

        },

        /**
         * @private
         * @param {function(Throwable=)} callback
         */
        completeValidators: function(callback) {

        },

        /**
         * @private
         * @param {function(Throwable=)} callback
         */
        executeValidators: function(callback) {
            this.validatorIterator = this.validatorGroup.getValidatorList().iterator();
            if (this.validatorIterator.hasNext()) {
                this.nextValidator();
            } else {
                this.completeValidators();
            }
        },

        /**
         * @private
         * @param {function(Throwable=)} callback
         */
        doValidation: function(callback) {

            // TODO BRN: Eww, this is ugly! Would be best to move the core of bugflow in to the bugcore framework so that
            // we can use it in situations like these.

            this.executeValidators()
        },

        nextCallback: function() {

        },

        /**
         * @private
         */
        nextValidator: function() {
            var validator = this.validatorIterator.next();
            validator.validate()
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ValidatorProcessor', ValidatorProcessor);
});
