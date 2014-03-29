//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('QueryBuilder')

//@Require('Class')
//@Require('Obj')
//@Require('Query')
//@Require('Set')
//@Require('WhereConditionBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var Query                   = bugpack.require('Query');
var Set                     = bugpack.require('Set');
var WhereConditionBuilder   = bugpack.require('WhereConditionBuilder');


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var QueryBuilder = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Set.<IConditionBuilder>}
         */
        this.conditionBuilderSet    = new Set();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @returns {Set.<IConditionBuilder>}
     */
    getConditionBuilderSet: function() {
        return this.conditionBuilderSet;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} propertyQuery
     * @return {WhereConditionBuilder}
     */
    where: function(propertyQuery) {
        var builder = new WhereConditionBuilder(this, propertyQuery);
        this.conditionBuilderSet.add(builder);
        return builder;
    },

    /**
     * @return {Query}
     */
    build: function() {
        var query = new Query();
        this.conditionBuilderSet.forEach(function(conditionBuilder) {
            var condition = conditionBuilder.buildCondition();
            query.addCondition(condition);
        });
        return query;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('QueryBuilder', QueryBuilder);
