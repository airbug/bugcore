/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ArgumentBug')

//@Require('Bug')
//@Require('Class')
//@Require('StackTraceUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug             = bugpack.require('Bug');
    var Class           = bugpack.require('Class');
    var StackTraceUtil  = bugpack.require('StackTraceUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Bug}
     */
    var ArgumentBug = Class.extend(Bug, {

        _name: "ArgumentBug",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} type
         * @param {string} argName
         * @param {*} argValue
         * @param {string} message
         * @param {Array.<(Throwable | Error)>} causes
         * @private
         */
        _constructor: function(type, argName, argValue, message, causes) {

            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.argName    = argName;

            /**
             * @private
             * @type {*}
             */
            this.argValue   = argValue;

            this._super(type, {}, message, causes);
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getArgName: function() {
            return this.argName;
        },

        /**
         * @return {string}
         */
        getArgValue: function() {
            return this.argValue;
        },


        //-------------------------------------------------------------------------------
        // Throwable Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @return {string}
         */
        generateStackTrace: function() {
            return this.getMessage() + "\n" +
                "Argument '" + this.argName + "' was " + this.argValue + "\n" +
                StackTraceUtil.generateStackTrace();
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @const {string}
     */
    ArgumentBug.ILLEGAL = "ArgumentBug:Illegal";


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ArgumentBug', ArgumentBug);
});
