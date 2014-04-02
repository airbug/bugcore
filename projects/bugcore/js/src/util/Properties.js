//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Properties')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var TypeUtil    = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var Properties = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {Object=} propertiesObject
     */
    _constructor: function(propertiesObject) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        if (TypeUtil.isUndefined(propertiesObject) || TypeUtil.isNull(propertiesObject)) {
            propertiesObject = {};
        }
        if (!TypeUtil.isObject(propertiesObject)) {
            throw new Error("propertiesObject must be an object");
        }

        /**
         * @private
         * @type {Object}
         */
        this.propertiesObject = propertiesObject;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    getPropertiesObject: function() {
        return this.propertiesObject;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Properties} properties
     * @param {(Array.<string> | Collection.<string>)} propertyNames
     */
    absorbProperties: function(properties, propertyNames) {
        var _this = this;
        propertyNames.forEach(function(propertyName) {
            _this.setProperty(propertyName, properties.getProperty(propertyName));
        });
    },

    /**
     * @param {string} propertyQuery
     * @return {*}
     */
    getProperty: function(propertyQuery) {
        return Obj.findProperty(this.propertiesObject, propertyQuery);
    },

    /**
     * @param {Array.<Properties>} arrayOfProperties
     */
    merge: function(arrayOfProperties) {
        for (var i = arrayOfProperties.length - 1; i >=0; i--) {
            var properties = arrayOfProperties[i];
            this.updateProperties(properties.getPropertiesObject());
        }
    },

    /**
     * @param {Object} propertiesObject
     */
    updateProperties: function(propertiesObject) {
        var _this = this;
        Obj.forIn(propertiesObject, function(propertyName, propertyValue) {
            _this.updateProperty(propertyName, propertyValue);
        });
    },

    /**
     * @param {string} propertyName
     * @param {*} propertyValue
     */
    updateProperty: function(propertyName, propertyValue) {
        var currentValue = this.getProperty(propertyName);
        if (TypeUtil.isObject(currentValue) && TypeUtil.isObject(propertyValue)) {
            for (var name in propertyValue) {
                var subValue = propertyValue[name];
                var subName = propertyName + "." + name;
                this.updateProperty(subName, subValue);
            }
        } else {
            this.setProperty(propertyName, propertyValue);
        }
    },

    /**
     * @param {string} propertyName
     * @param {*} propertyValue
     */
    setProperty: function(propertyName, propertyValue) {
        var parts = propertyName.split(".");
        if (parts.length > 1) {
            var subName = null;
            var currentValue = this.propertiesObject;
            var nextValue = null;
            for (var i = 0, size = parts.length; i < size; i++) {
                subName = parts[i];
                if (i === size - 1) {
                    currentValue[subName] = propertyValue;
                } else {
                    nextValue = currentValue[subName];
                    if (!(TypeUtil.isObject(nextValue))) {
                        nextValue = currentValue[subName] = {};
                    }
                    currentValue = nextValue;
                }
            }
        } else {
            this.propertiesObject[propertyName] = propertyValue;
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Properties', Properties);
