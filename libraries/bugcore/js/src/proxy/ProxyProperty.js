/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ProxyProperty')

//@Require('Class')
//@Require('IProxy')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var IProxy  = bugpack.require('IProxy');
    var Obj     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IProxy}
     */
    var ProxyProperty = Class.extend(Obj, {

        _name: 'ProxyProperty',


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Object} instance
         * @param {string} propertyName
         */
        _constructor: function(instance, propertyName) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Object}
             */
            this.instance = instance;

            /**
             * @private
             * @type {string}
             */
            this.propertyName = propertyName;
        },


        //-------------------------------------------------------------------------------
        // IProxy Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {string} functionName
         * @param {Array.<*>} args
         */
        proxy: function(functionName, args) {
            var target = this.instance[this.propertyName];
            if (target) {
                return target[functionName].apply(target, args);
            } else {
                throw new Error('Could not find property "' + this.propertyName + '" on instance');
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(ProxyProperty, IProxy);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ProxyProperty', ProxyProperty);
});
