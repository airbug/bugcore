/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('NotifyingObject')

//@Require('Class')
//@Require('Notifying')
//@Require('ObjectUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Notifying   = bugpack.require('Notifying');
    var ObjectUtil  = bugpack.require('ObjectUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Notifying}
     * @template {V}
     */
    var NotifyingObject = Class.extend(Notifying, /** @lends {NotifyingObject.prototype} */{

        _name: 'NotifyingObject',


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
                    var result = ObjectUtil.deleteProperty(this.object, name);
                    if (result) {
                        if (this.hasNotifier()) {
                            this.getNotifier().notify({
                                name: name,
                                object: this,
                                oldValue: oldValue,
                                type: 'delete'
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
            ObjectUtil.forInOwn(this.object, func);
        },

        /**
         * @return {Array.<string>}
         */
        keys: function() {
            return ObjectUtil.getOwnProperties(this.object);
        },

        /**
         * @param {string} name
         * @return {*}
         */
        getProperty: function(name) {
            return ObjectUtil.getOwnProperty(this.object, name);
        },

        /**
         * DOES include inherited properties
         * @param {string} name
         * @return {boolean}
         */
        hasProperty: function(name) {
            return ObjectUtil.hasOwnProperty(this.object, name);
        },

        /**
         * @param {string} name
         * @param {*} value
         * @return {boolean}
         */
        setProperty: function(name, value) {
            try {
                var oldValue = this[name];
                var changeType = 'add';
                if (this.hasProperty(name)) {
                    changeType = 'update';
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
                return false;
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('NotifyingObject', NotifyingObject);
});
