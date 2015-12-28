/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('TraceTree')

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
    var TraceTree = Class.extend(Obj, {

        _name: "TraceTree",


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
             * @type {Trace}
             */
            this.rootTrace = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Trace}
         */
        getRootTrace: function() {
            return this.rootTrace;
        },

        /**
         * @param {Trace} rootTrace
         */
        setRootTrace: function(rootTrace) {
            this.rootTrace = rootTrace;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function()} func
         * @return {Trace}
         */
        findFirstTrace: function(func) {
            var rootTrace = this.getRootTrace();
            if (rootTrace) {
                return this.findRecursive(rootTrace, func);
            } else {
                return null;
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Trace} trace
         * @param {function(*)} func
         * @return {Trace}
         */
        findRecursive: function(trace, func) {
            var result = func(trace);
            if (result) {
                return trace;
            } else {
                var childTraces = trace.getChildTraces();
                for (var i = 0, size = childTraces.length; i < size; i++) {
                    var childTrace = childTraces[i];
                    var foundTrace = this.findRecursive(childTrace, func);
                    if (foundTrace) {
                        return foundTrace;
                    }
                }
                return null;
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('TraceTree', TraceTree);
});
