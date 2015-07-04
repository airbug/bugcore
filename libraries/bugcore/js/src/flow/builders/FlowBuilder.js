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
//@Require('Throwables')


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
    var Throwables  = bugpack.require('Throwables');


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
            var flow    = this.doFactoryFlow();
            flow.execute(flowArgs, callback);
        },


        //-------------------------------------------------------------------------------
        // Abstract Methods
        //-------------------------------------------------------------------------------

        /**
         * @abstract
         * @protected
         * @return {Flow}
         */
        doFactoryFlow: function() {
            throw Throwables.bug("AbstractMethodNotImplemented", {}, "Must implement doFactoryFlow method");
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('FlowBuilder', FlowBuilder);
});
