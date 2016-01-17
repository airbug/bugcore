/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('MappedThrowable')

//@Require('Class')
//@Require('Map')
//@Require('Throwable')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Map         = bugpack.require('Map');
    var Throwable   = bugpack.require('Throwable');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Throwable}
     */
    var MappedThrowable = Class.extend(Throwable, {

        _name: "MappedThrowable",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} type
         * @param {*} data
         */
        _constructor: function(type, data) {

            this._super(type, data);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Map.<*, Throwable>}
             */
            this.causeMap   = new Map();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @return {Array.<Throwable>}
         */
        getCauses: function() {
            return this.causeMap.toValueArray();
        },

        /**
         * @return {Map.<*, Throwable>}
         */
        getCauseMap: function() {
            return this.causeMap;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} key
         * @param {Throwable} throwable
         */
        putCause: function(key, throwable) {
            this.causeMap.put(key, throwable);
            this.buildStackTrace();
        },


        //-------------------------------------------------------------------------------
        // Throwable Methods
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @protected
         */
        buildStackTrace: function() {
            var _this = this;
            if (!this.primaryStack) {
                this.primaryStack = this.generateStackTrace();
            }
            var stack = this.primaryStack;
            stack += "\n\n";
            stack += this.getType() + " was caused by " + this.causeMap.getCount() + " exceptions:\n";
            var count = 0;
            this.causeMap.forEach(function(cause, key) {
                count++;
                stack += _this.getType() + " cause mapped to '" + key + "':\n";
                stack += cause.message + "\n";
                stack += cause.stack;
            });
            this.stack = stack;
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @const {string}
     */
    MappedThrowable.MAPPED = "MappedThrowable:Mapped";


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('MappedThrowable', MappedThrowable);
});
