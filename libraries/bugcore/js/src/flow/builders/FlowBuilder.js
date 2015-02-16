/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('FlowBuilder')

//@Require('ArgUtil')
//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgUtil     = bugpack.require('ArgUtil');
    var Class       = bugpack.require('Class');
    var Obj         = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var FlowBuilder = Class.extend(Obj, {

        _name: "FlowBuilder",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(new:Constructor)} flowConstructor
         * @param {Array.<*>} flowConstructorArgs
         */
        _constructor: function(flowConstructor, flowConstructorArgs) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {function(new:Constructor)}
             */
            this.flowConstructor        = flowConstructor;

            /**
             * @private
             * @type {Array.<*>}
             */
            this.flowConstructorArgs    = flowConstructorArgs;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Array.<*>}
         */
        getFlowConstructorArgs: function() {
            return this.flowConstructorArgs;
        },

        /**
         * @return {function(new:Constructor)}
         */
        getFlowConstructor: function() {
            return this.flowConstructor;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {(Array.<*> | function(Throwable=))} flowArgs
         * @param {function(Throwable=)=} callback
         */
        execute: function(flowArgs, callback) {
            var args = ArgUtil.process(arguments, [
                {name: "flowArgs", optional: true, type: "array", default: []},
                {name: "callback", optional: false, type: "function"}
            ]);
            flowArgs    = args.flowArgs;
            callback    = args.callback;
            var flow    = this.flowConstructor.getClass().newInstance(this.flowConstructorArgs);
            flow.execute(flowArgs, callback);
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('FlowBuilder', FlowBuilder);
});
