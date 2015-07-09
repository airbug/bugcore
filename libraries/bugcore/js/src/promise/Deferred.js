/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Deferred')

//@Require('ArgUtil')
//@Require('Class')
//@Require('Obj')
//@Require('Promise')


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
    var Promise     = bugpack.require('Promise');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Deferred = Class.extend(Obj, {

        _name: "Deferred",


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
             * @type {Promise}
             */
            this.deferredPromise    = new Promise();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Promise}
         */
        getDeferredPromise: function() {
            return this.deferredPromise;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=, *...=)} callback
         */
        callback: function(callback) {
            this.deferredPromise.then(function() {
                var args = ArgUtil.toArray(arguments);
                args.unshift(null);
                return callback.apply(null, args);
            }, function(throwable) {
                return callback(throwable);
            });
        },

        /**
         * @param {...[*]} args
         */
        reject: function() {
            var args = ArgUtil.toArray(arguments);
            this.deferredPromise.rejectPromise(args);
        },

        /**
         * @param {...[*]} args
         */
        resolve: function() {
            var args = ArgUtil.toArray(arguments);
            this.deferredPromise.resolvePromise(args);
        },

        /**
         * @return {Promise}
         */
        promise: function() {
            return this.getDeferredPromise();
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Deferred', Deferred);
});
