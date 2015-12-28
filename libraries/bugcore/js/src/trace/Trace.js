/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Trace')

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
    var Trace = Class.extend(Obj, {

        _name: "Trace",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} stack
         * @param {string} name
         */
        _constructor: function(stack, name) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Array.<Trace>}
             */
            this.childTraces    = [];

            /**
             * @private
             * @type {string}
             */
            this.name           = name;

            /**
             * @private
             * @type {Trace}
             */
            this.parentTrace    = null;

            /**
             * @private
             * @type {string}
             */
            this.stack          = stack;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Array.<Trace>}
         */
        getChildTraces: function() {
            return this.childTraces;
        },

        /**
         * @return {string}
         */
        getName: function() {
            return this.name;
        },

        /**
         * @param {string} name
         */
        setName: function(name) {
            this.name = name;
        },

        /**
         * @return {Trace}
         */
        getParentTrace: function() {
            return this.parentTrace;
        },

        /**
         * @param {Trace} parentTrace
         */
        setParentTrace: function(parentTrace) {
            this.parentTrace = parentTrace;
        },

        /**
         * @return {string}
         */
        getStack: function() {
            return this.stack;
        },

        /**
         * @param {string} stack
         */
        setStack: function(stack) {
            this.stack = stack;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Trace} childTrace
         */
        addChildTrace: function(childTrace) {
            if (childTrace.hasParentTrace()) {
                childTrace.removeParentTrace();
            }
            this.childTraces.push(childTrace);
            childTrace.setParentTrace(this);
        },

        /**
         * @return {boolean}
         */
        hasParentTrace: function() {
            return !!this.parentTrace;
        },

        /**
         * @param {Trace} childTrace
         * @return {number}
         */
        indexOfChildTrace: function(childTrace) {
            for (var i = 0, size = this.childTraces.length; i < size; i++) {
                if (Obj.equals(this.childTraces[i], childTrace)) {
                    return i;
                }
            }
            return -1;
        },

        /**
         * @return {number}
         */
        numberChildTraces: function() {
            return this.childTraces.length;
        },

        /**
         * @param {Trace} childTrace
         * @return {Trace}
         */
        removeChildTrace: function(childTrace) {
            if (Obj.equals(this, childTrace.getParentTrace())) {
                var childIndex = this.indexOfChildTrace(childTrace);
                if (childIndex > -1) {
                    childTrace.setParentTrace(null);
                    return this.childTraces.splice(childIndex, 1)[0];
                } else {
                    throw new Error("CouldNotFindChildTrace");
                }
            }
        },

        /**
         *
         */
        removeParentTrace: function() {
            this.parentTrace.removeChildTrace(this);
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('Trace', Trace);
});
