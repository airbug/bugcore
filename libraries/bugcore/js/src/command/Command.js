/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Command')

//@Require('Bug')
//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug     = bugpack.require('Bug');
    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @abstract
     * @class
     * @extends {Obj}
     */
    var Command = Class.extend(Obj, /** @lends {Command.prototype} */{

        _name: "Command",


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
             * @type {boolean}
             */
            this.executed = false;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        getExecuted: function() {
            return this.executed;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        isExecuted: function() {
            return this.executed;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=, *...=)} callback
         */
        execute: function(callback) {
            if (!this.isExecuted()) {
                this.executeCommand(callback);
            } else {
                callback(new Bug("IllegalState", {}, "Command has already been executed"));
            }
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @abstract
         * @param {function(Throwable=, *...=)} callback
         */
        executeCommand: function(callback) {
            callback(new Bug("AbstractMethodNotImplemented", {}, "Must implement executeCommand"));
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Command', Command);
});
