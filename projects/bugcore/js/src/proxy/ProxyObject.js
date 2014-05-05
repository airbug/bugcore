/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ProxyObject')

//@Require('Class')
//@Require('Interface')
//@Require('IProxy')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Interface   = bugpack.require('Interface');
    var IProxy      = bugpack.require('IProxy');
    var Obj         = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IProxy}
     */
    var ProxyObject = Class.extend(Obj, {

        _name: "ProxyObject",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Object} instance
         */
        _constructor: function(instance) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Object}
             */
            this.instance = instance;
        },


        //-------------------------------------------------------------------------------
        // IProxy Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {string} functionName
         * @param {Array.<*>} args
         */
        proxy: function(functionName, args) {
            return this.instance[functionName].apply(this.instance, args);
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(ProxyObject, IProxy);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ProxyObject', ProxyObject);
});
