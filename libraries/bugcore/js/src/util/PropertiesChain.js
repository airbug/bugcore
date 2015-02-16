/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('PropertiesChain')

//@Require('Class')
//@Require('Exception')
//@Require('List')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Exception   = bugpack.require('Exception');
    var List        = bugpack.require('List');
    var Obj         = bugpack.require('Obj');
    var TypeUtil    = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var PropertiesChain = Class.extend(Obj, {

        _name: "PropertiesChain",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {(Array.<Properties> | List.<Properties>)} propertiesList
         */
        _constructor: function(propertiesList) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            if (!TypeUtil.isUndefined(propertiesList)) {
                if (!(TypeUtil.isArray(propertiesList) || Class.doesExtend(propertiesList, List))) {
                    throw new Exception("propertiesList must either be an Array of Properties or a List of Properties");
                }
            } else {
                propertiesList = [];
            }
            /**
             * @private
             * @type {List.<Properties>}
             */
            this.propertiesList = new List(propertiesList);
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {List.<Properties>}
         */
        getPropertiesList: function() {
            return this.propertiesList;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} propertyQuery
         * @return {*}
         */
        getProperty: function(propertyQuery) {
            for (var i = 0, size = this.propertiesList.getCount(); i < size; i++) {
                var properties = /** @type {Properties} */(this.propertiesList.getAt(i));
                if (properties.hasProperty(propertyQuery)) {
                    return properties.getProperty(propertyQuery);
                }
            }
            return undefined;
        },

        /**
         * @param {string} propertyQuery
         * @return {boolean}
         */
        hasProperty: function(propertyQuery) {
            for (var i = 0, size = this.propertiesList.getCount(); i < size; i++) {
                var properties = /** @type {Properties} */(this.propertiesList.getAt(i));
                if (properties.hasProperty(propertyQuery)) {
                    return true;
                }
            }
            return false;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('PropertiesChain', PropertiesChain);
});
