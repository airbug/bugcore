/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
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
//@Require('Promises')
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
    var Promises    = bugpack.require('Promises');
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
         * @param {function(Throwable, *...=)=} callback
         * @return {Promise}
         */
        callback: function(callback) {
            var deferred = Promises.deferred();
            this.execute(function(throwable) {
                if (!throwable) {
                    var args = ArgUtil.toArray(arguments);
                    args.shift();
                    deferred.resolve.apply(deferred, args);
                } else {
                    deferred.reject(throwable);
                }
            });
            return deferred.callback(callback);
        },

        /**
         * @param {(Array.<*> | function(Throwable=))} flowArgs
         * @param {function(Throwable, *...=)=} callback
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

        /**
         * @param {function(...):*=} fulfilledFunction
         * @param {function(...):*=} rejectedFunction
         * @return {Promise}
         */
        then: function(fulfilledFunction, rejectedFunction) {
            var deferred = Promises.deferred();
            this.execute(function(throwable) {
                if (!throwable) {
                    var args = ArgUtil.toArray(arguments);
                    args.shift();
                    deferred.resolve.apply(deferred, args);
                } else {
                    deferred.reject(throwable);
                }
            });
            return deferred.then(fulfilledFunction, rejectedFunction);
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
