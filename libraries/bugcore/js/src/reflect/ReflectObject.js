/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ReflectObject')

//@Require('Class')
//@Require('Notifier')
//@Require('ObjectUtil')
//@Require('Reflect')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Notifier        = bugpack.require('Notifier');
    var ObjectUtil      = bugpack.require('ObjectUtil');
    var Reflect         = bugpack.require('Reflect');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Reflect}
     * @template {V}
     */
    var ReflectObject = Class.extend(Reflect, /** @lends {ReflectObject.prototype} */{

        _name: "ReflectObject",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Object.<V>} object
         */
        _constructor: function(object) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Object.<V>}
             */
            this.object = object;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Object.<V>}
         */
        getObject: function() {
            return this.object;
        }
    });


    //-------------------------------------------------------------------------------
    // Prototype
    //-------------------------------------------------------------------------------

    ReflectObject.prototype = {
        keys: (function() {
            'use strict';
            var hasOwnProperty = Object.prototype.hasOwnProperty;
            var hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString');
            var dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ];
            var dontEnumsLength = dontEnums.length;

            return function(obj) {
                if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                    throw new TypeError('Object.keys called on non-object');
                }

                var result = [], prop, i;

                for (prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) {
                        result.push(prop);
                    }
                }

                if (hasDontEnumBug) {
                    for (i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) {
                            result.push(dontEnums[i]);
                        }
                    }
                }
                return result;
            };
        }()),

        /**
         * @param {string} name
         * @return {*}
         */
        get: function(name) {
            return ObjectUtil.getProperty(this.object, name);
        },

        /**
         * DOES include inherited properties
         * @param {string} name
         * @return {boolean}
         */
        has: function(name) {
            return ObjectUtil.hasProperty(this.object, name);
        },

        /**
         * @param {string} name
         * @param {*} value
         * @return {boolean}
         */
        set: function(name, value) {
            try {
                var oldValue = this[name];
                var changeType = "add";
                if (this.has(name)) {
                    changeType = "update";
                }
                ObjectUtil.setProperty(this.object, name, value);
                if (this.notifier) {
                    this.notifier.notify({
                        name: name,
                        object: this,
                        oldValue: oldValue,
                        type: changeType
                    });
                }
                return true;
            } catch(error) {
                return false;
            }
        }
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ReflectObject', ReflectObject);
});
