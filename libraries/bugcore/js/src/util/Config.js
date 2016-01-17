/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Config')

//@Require('Class')
//@Require('IJsonable')
//@Require('IObjectable')
//@Require('Obj')
//@Require('Properties')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var IJsonable       = bugpack.require('IJsonable');
    var IObjectable     = bugpack.require('IObjectable');
    var Obj             = bugpack.require('Obj');
    var Properties      = bugpack.require('Properties');


    //-------------------------------------------------------------------------------
    // Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IJsonable}
     * @implements {IObjectable}
     */
    var Config = Class.extend(Obj, {

        _name: "Config",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Object} configObject
         */
        _constructor: function(configObject) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Properties}
             */
            this.properties = new Properties(configObject);
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @param {Config} config
         * @param {(Array.<string> | Collection.<string>)} propertyNames
         */
        absorbConfig: function(config, propertyNames) {
            this.properties.absorbProperties(config.getProperties(), propertyNames);
        },

        /**
         * @param {string} propertyQuery
         * @return {boolean}
         */
        deleteProperty: function(propertyQuery) {
            return this.properties.deleteProperty(propertyQuery);
        },

        /**
         * @return {Properties}
         */
        getProperties: function() {
            return this.properties;
        },

        /**
         * @param {string} propertyQuery
         * @return {*}
         */
        getProperty: function(propertyQuery) {
            return this.properties.getProperty(propertyQuery);
        },

         /**
         * @param {string} propertyQuery
         * @return {boolean}
         */
        hasProperty: function(propertyQuery) {
            return this.properties.hasProperty(propertyQuery);
        },

        /**
         * @param {string} propertyQuery
         * @param {*} propertyValue
         */
        setProperty: function(propertyQuery, propertyValue) {
            this.properties.setProperty(propertyQuery, propertyValue);
        },

        /**
         * @param {Object} propertiesObject
         */
        updateProperties: function(propertiesObject) {
            this.properties.updateProperties(propertiesObject);
        },


        //-------------------------------------------------------------------------------
        // IObjectable Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        toObject: function() {
            return Obj.clone(this.properties.getPropertiesObject(), true);
        },


        //-------------------------------------------------------------------------------
        // IJsonable Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        toJson: function() {
            return JSON.stringify(this.toObject());
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(Config, IJsonable);
    Class.implement(Config, IObjectable);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("Config", Config);
});
