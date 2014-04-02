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
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


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
 * @constructor
 * @extends {Obj}
 * @implements {IJsonable}
 * @implements {IObjectable}
 */
var Config = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {Object} config
     */
    _constructor: function(config) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Properties}
         */
        this.properties = new Properties(config);
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
     * @return {Properties}
     */
    getProperties: function() {
        return this.properties;
    },

    /**
     * @param {string} propertyName
     * @return {*}
     */
    getProperty: function(propertyName) {
        return this.properties.getProperty(propertyName);
    },

    /**
     * @param {string} propertyName
     * @param {*} propertyValue
     */
    setProperty: function(propertyName, propertyValue) {
        this.properties.setProperty(propertyName, propertyValue);
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
