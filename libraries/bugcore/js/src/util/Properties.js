/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Properties')

//@Require('Class')
//@Require('Obj')
//@Require('ObjectUtil')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Obj         = bugpack.require('Obj');
    var ObjectUtil  = bugpack.require('ObjectUtil');
    var TypeUtil    = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Properties = Class.extend(Obj, {

        _name: "Properties",


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
        // Public Methods
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
            return ObjectUtil.getOwnNestedProperty(this.propertiesObject, propertyQuery);
        },

        /**
         * @param {string} propertyQuery
         * @return {boolean}
         */
        hasProperty: function(propertyQuery) {
            return ObjectUtil.hasOwnNestedProperty(this.propertiesObject, propertyQuery);
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
            ObjectUtil.forIn(propertiesObject, function(propertyName, propertyValue) {
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
});
