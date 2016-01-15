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

    var Class       = bugpack.require('Class');
    var Notifier    = bugpack.require('Notifier');
    var ObjectUtil  = bugpack.require('ObjectUtil');
    var Reflect     = bugpack.require('Reflect');


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
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} name
         * @returns {boolean}
         */
        deleteProperty: function(name) {
            try {
                if (this.hasProperty(name)) {
                    var oldValue = this.object[name];
                    var result = ObjectUtil.deleteProperty(this.object, name, {own: true});
                    if (result) {
                        if (this.hasNotifier()) {
                            this.getNotifier().notify({
                                name: name,
                                object: this,
                                oldValue: oldValue,
                                type: "delete"
                            });
                        }
                        return true;
                    }
                }
            } catch(error) {
                //do nothing
            }
            return false;
        },

        /**
         * @param {function(string, *)} func
         */
        forIn: function(func) {
            ObjectUtil.forIn(this.object, func, {own: true});
        },

        /**
         * @return {Array.<string>}
         */
        keys: function() {
            return ObjectUtil.getProperties(this.object, {own: true});
        },

        /**
         * @param {string} name
         * @return {*}
         */
        getProperty: function(name) {
            return ObjectUtil.getProperty(this.object, name, {own: true});
        },

        /**
         * DOES include inherited properties
         * @param {string} name
         * @return {boolean}
         */
        hasProperty: function(name) {
            return ObjectUtil.hasProperty(this.object, name, {own: true});
        },

        /**
         * @param {string} name
         * @param {*} value
         * @return {boolean}
         */
        setProperty: function(name, value) {
            try {
                var oldValue = this[name];
                var changeType = "add";
                if (this.hasProperty(name)) {
                    changeType = "update";
                }
                ObjectUtil.setProperty(this.object, name, value);
                if (this.hasNotifier()) {
                    this.getNotifier().notify({
                        name: name,
                        object: this,
                        oldValue: oldValue,
                        type: changeType
                    });
                }
                return true;
            } catch(error) {

            }
            return false;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ReflectObject', ReflectObject);
});
