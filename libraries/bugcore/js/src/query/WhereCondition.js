/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('WhereCondition')

//@Require('Class')
//@Require('ICondition')
//@Require('Obj')
//@Require('ObjectUtil')
//@Require('Set')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var ICondition  = bugpack.require('ICondition');
    var Obj         = bugpack.require('Obj');
    var ObjectUtil  = bugpack.require('ObjectUtil');
    var Set         = bugpack.require('Set');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {ICondition}
     */
    var WhereCondition = Class.extend(Obj, {

        _name: "WhereCondition",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} propertyQuery
         * @param {Set.<string>} inSet
         */
        _constructor: function(propertyQuery, inSet) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Set.<string>}
             */
            this.inSet              = inSet;

            /**
             * @private
             * @type {string}
             */
            this.propertyQuery      = propertyQuery;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Set.<string>}
         */
        getInSet: function() {
            return this.inSet;
        },

        /**
         * @return {string}
         */
        getPropertyQuery: function() {
            return this.propertyQuery;
        },


        //-------------------------------------------------------------------------------
        // ICondition Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {Object} value
         * @return {boolean}
         */
        check: function(value) {
            var propertyValue = ObjectUtil.findProperty(value, this.propertyQuery);
            return this.inSet.contains(propertyValue);
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(WhereCondition, ICondition);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('WhereCondition', WhereCondition);
});
