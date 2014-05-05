/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('WhereConditionBuilder')

//@Require('Class')
//@Require('IConditionBuilder')
//@Require('Obj')
//@Require('Set')
//@Require('WhereCondition')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var IConditionBuilder       = bugpack.require('IConditionBuilder');
    var Obj                     = bugpack.require('Obj');
    var Set                     = bugpack.require('Set');
    var WhereCondition          = bugpack.require('WhereCondition');


    //-------------------------------------------------------------------------------
    // Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IConditionBuilder}
     */
    var WhereConditionBuilder = Class.extend(Obj, {

        _name: "WhereConditionBuilder",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {QueryBuilder} queryBuilder
         * @param {string} propertyQuery
         */
        _constructor: function(queryBuilder, propertyQuery) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Set.<string>}
             */
            this.inSet              = new Set();

            /**
             * @private
             * @type {string}
             */
            this.propertyQuery      = propertyQuery;

            /**
             * @private
             * @type {QueryBuilder}
             */
            this.queryBuilder       = queryBuilder;
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
         * @returns {string}
         */
        getPropertyQuery: function() {
            return this.propertyQuery;
        },

        /**
         * @returns {QueryBuilder}
         */
        getQueryBuilder: function() {
            return this.queryBuilder;
        },


        //-------------------------------------------------------------------------------
        // IConditionBuilder Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {ICondition}
         */
        buildCondition: function() {
            return new WhereCondition(this.propertyQuery, this.inSet);
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<string>} ins
         * @return {QueryBuilder}
         */
        in: function(ins) {
            this.inSet.addAll(ins);
            return this.getQueryBuilder();
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(WhereConditionBuilder, IConditionBuilder);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('WhereConditionBuilder', WhereConditionBuilder);
});
