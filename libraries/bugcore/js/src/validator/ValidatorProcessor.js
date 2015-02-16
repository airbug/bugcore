/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
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
//@Require('Flows')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Collections         = bugpack.require('Collections');
    var Exception           = bugpack.require('Exception');
    var Flows               = bugpack.require('Flows');
    var Obj                 = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $iterableSeries     = Flows.$iterableSeries;
    var $series             = Flows.$series;
    var $task               = Flows.$task;


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

        /**
         * @private
         * @param {function(Throwable=)} callback
         */
        executeValidators: function(callback) {
            $iterableSeries(this.validatorGroup.getValidatorList(), function(flow, validator) {
                validator.validate(function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(callback);
        },

        /**
         * @private
         * @param {Throwable=} throwable
         */
        executeCallbacks: function(throwable) {
            this.callbackList.forEach(function(callback) {
                callback(throwable);
            });
        },

        /**
         * @private
         * @param {function(Throwable=)} callback
         */
        doValidation: function(callback) {
            var _this = this;
            $task(function(flow) {
                _this.executeValidators(function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(function(throwable) {
                _this.executeCallbacks(throwable);
                callback(throwable);
            });
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ValidatorProcessor', ValidatorProcessor);
});
