/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ProxyMethod')

//@Require('Class')
//@Require('IProxy')
//@Require('Interface')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var IProxy      = bugpack.require('IProxy');
    var Interface   = bugpack.require('Interface');
    var Obj         = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IProxy}
     */
    var ProxyMethod = Class.extend(Obj, {

        _name: "ProxyMethod",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(..):*} method
         * @param {Object} context
         */
        _constructor: function(method, context) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Object}
             */
            this.context    = context;

            /**
             * @private
             * @type {function(...):*}
             */
            this.method     = method;
        },


        //-------------------------------------------------------------------------------
        // IProxy Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {string} functionName
         * @param {Array.<*>} args
         */
        proxy: function(functionName, args) {
            var target = this.method.call(this.context);
            if (target) {
                return target[functionName].apply(target, args);
            } else {
                throw new Error("Method did not return a value that could be proxied.");
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(ProxyMethod, IProxy);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ProxyMethod', ProxyMethod);
});
