/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ConfigChain')

//@Require('Class')
//@Require('Exception')
//@Require('List')
//@Require('Obj')
//@Require('PropertiesChain')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Exception           = bugpack.require('Exception');
    var List                = bugpack.require('List');
    var Obj                 = bugpack.require('Obj');
    var PropertiesChain     = bugpack.require('PropertiesChain');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var ConfigChain = Class.extend(Obj, {

        _name: "ConfigChain",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {(Array.<Config> | List.<Config>)} configList
         */
        _constructor: function(configList) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            var properties = [];
            configList.forEach(function(config) {
                properties.push(config.getProperties());
            });

            /**
             * @private
             * @type {PropertiesChain}
             */
            this.propertiesChain = new PropertiesChain(properties);
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {PropertiesChain}
         */
        getPropertiesChain: function() {
            return this.propertiesChain;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} propertyQuery
         * @param {number=} index
         * @return {boolean}
         */
        deleteProperty: function(propertyQuery, index) {
            return this.propertiesChain.deleteProperty(propertyQuery, index);
        },

        /**
         * @param {string} propertyQuery
         * @param {number=} index
         * @return {*}
         */
        getProperty: function(propertyQuery, index) {
            return this.propertiesChain.getProperty(propertyQuery, index);
        },

        /**
         * @param {string} propertyQuery
         * @param {number=} index
         * @return {boolean}
         */
        hasProperty: function(propertyQuery, index) {
            return this.propertiesChain.hasProperty(propertyQuery, index);
        },

        /**
         * @param {string} propertyQuery
         * @param {*} value
         * @param {number=} index
         * @return {boolean}
         */
        setProperty: function(propertyQuery, value, index) {
            return this.propertiesChain.setProperty(propertyQuery, value, index);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ConfigChain', ConfigChain);
});
